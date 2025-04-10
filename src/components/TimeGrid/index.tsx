import clsx from "clsx"
import { useMemo } from "react"

import { EventResources, useCalendarContext } from "@/."
import {
	useDisplayStrategy,
	ViewStrategyName,
	TimeGridDisplayProperties,
	DisplayStrategyFactories,
	displayStrategyFactories,
} from "@/lib/displayStrategies"
import { CalendarLocalizer } from "@/lib/localizers"

import { Event } from "./components/Event/Event"
import { EventWrapper } from "./components/Event/EventWrapper"
import Headings from "./components/Headings"
import TimeColumn from "./components/TimeColumn"
import * as classes from "./TimeGrid.css"


export interface TimeGridHeading {
	date: Date
	label: string
	resourceId?: string | number
}

// eslint-disable-next-line no-unused-vars
interface TimeGridProps<TEventResources extends EventResources, V extends keyof DisplayStrategyFactories = "week"> {
	className?: string
	style?: React.CSSProperties
	view: V
	startTime?: Date
	endTime?: Date
	columnHeadings: TimeGridHeading[]
	/**
	 * Number of minutes between each time slot
	 * @default 30
	 */
	timeIncrement?: number
	/**
	 * How to display overlapping events
	 */
	displayStrategy?: ViewStrategyName<V>
}

const generateTimeSlots = (start: Date, end: Date, increment: number, localizer: CalendarLocalizer) => {
	const slots: Date[] = []
	let current = localizer.startOf(start, "hour")
	const boundaryTime = localizer.add(localizer.startOf(end, "hour"), 1, "hour")

	while(localizer.isBefore(current, boundaryTime)) {
		slots.push(current)
		current = localizer.add(current, increment, "minute")
	}

	return slots
}

const TimeGrid = <
	TEventResources extends EventResources,
	V extends keyof DisplayStrategyFactories = "week"
>({
	className,
	style,
	view,
	startTime = (() => {
		const date = new Date()
		date.setHours(0, 0, 0, 0)
		return date
	})(),
	endTime = (() => {
		const date = new Date()
		date.setHours(23, 59, 59, 999)
		return date
	})(),
	columnHeadings,
	timeIncrement = 60,
	displayStrategy,
}: TimeGridProps<TEventResources, V>) => {
	const { localizer, onEventClick, groupByResource } = useCalendarContext<TEventResources>()

	const strategyNameToUse = displayStrategy || (() => {
		const strategiesForView = displayStrategyFactories[view]
		const defaultName = strategiesForView ? Object.keys(strategiesForView)[0] as ViewStrategyName<V> : undefined
		if(!defaultName) {
			// eslint-disable-next-line no-console
			console.error(`No display strategies found for view: ${String(view)}. Cannot determine default.`)
			throw new Error(`No display strategies found for view: ${String(view)}`)
		}
		// eslint-disable-next-line no-console
		console.warn(`No displayStrategy provided for view '${String(view)}', falling back to '${String(defaultName)}'.`)
		return defaultName
	})()

	const eventsByColumn = useDisplayStrategy<TEventResources, V, TimeGridDisplayProperties>(
		view,
		strategyNameToUse,
		{
			timeIncrement,
			startTime,
			endTime,
			columnHeadings: columnHeadings,
		}
	)

	const timeSlots = useMemo(() => {
		return generateTimeSlots(startTime, endTime, timeIncrement, localizer)
	}, [startTime, endTime, timeIncrement, localizer])

	const rowsPerDay = (24 * 60) / timeIncrement

	return (
		<div
			data-calendar-view="time-grid"
			className={ clsx(classes.timeGrid, className) }
			style={ {
				"--rows-per-day": rowsPerDay,
				"--column-count": columnHeadings.length,
				...style,
			} as React.CSSProperties }>
			<div className={ classes.cornerSpacer } />

			<Headings columnHeadings={ columnHeadings } />

			<TimeColumn timeSlots={ timeSlots } />

			<div className={ classes.contentArea } style={ { "--rows-per-day": rowsPerDay } as React.CSSProperties }>
				<div className={ classes.contentGrid }>
					<div className={ classes.gridLines } />
					<div className={ classes.eventsContainer }>
						{ columnHeadings.map((heading, columnIndex) => {
							// Determine the correct key based on grouping
							const key = groupByResource && heading.resourceId !== undefined
								? String(heading.resourceId)
								: heading.date.toISOString()

							const columnEvents = eventsByColumn?.get(key)

							if(!columnEvents) return null

							return columnEvents.map(({ event, displayProperties }) => {
								return (
									<EventWrapper<TEventResources>
										key={ `${event.id}-${displayProperties.displayStart.toISOString()}` }
										event={ event }
										displayProperties={ displayProperties }
									>
										<Event<TEventResources>
											key={ event.id }
											event={ event }
											localizer={ localizer }
											displayProperties={ displayProperties }
											startTime={ startTime }
											timeIncrement={ timeIncrement }
											className={ clsx(displayProperties.className) }
											onEventClick={ onEventClick }
										/>
									</EventWrapper>
								)
							})
						}) }
					</div>
				</div>
			</div>
		</div>
	)
}

export default TimeGrid
