import clsx from "clsx"
import { useMemo } from "react"

import { useCalendarContext, Resource, EventResources } from "@/."
import TimeGrid, { TimeGridHeading } from "@/components/TimeGrid"
import { BaseViewProps, createViewComponent, NAVIGATION, VIEWS, ViewStaticMethodProps } from "@/views"

import * as classes from "./DayView.css"


interface DayViewProps<TEventResources extends EventResources> extends BaseViewProps<TEventResources> {
	className?: string
	style?: React.CSSProperties
}

interface DayViewTimeGridHeading extends TimeGridHeading {
	resourceId?: string | number
}

const DayViewComponent = <TEventResources extends EventResources>({
	className,
	style,
}: DayViewProps<TEventResources>) => {
	const { date, localizer, resourcesById, groupByResource } = useCalendarContext<TEventResources>()

	const columnHeadings = useMemo<DayViewTimeGridHeading[]>(() => {
		if(groupByResource && resourcesById.size > 0) {
			return Array.from(resourcesById.values())
				.sort((a, b) => a.title.localeCompare(b.title))
				.map((resource: Resource) => ({
					date: date,
					label: resource.title,
					resourceId: resource.id,
				}))
		}

		return [{
			date: date,
			label: localizer.format(date, "dddd, MMM D"),
		}]
	}, [date, localizer, resourcesById, groupByResource])

	const startTime = useMemo(() => localizer.startOf(date, "day"), [date, localizer])
	const endTime = useMemo(() => localizer.endOf(date, "day"), [date, localizer])

	return (
		<div className={ clsx(classes.dayView, className) } style={ style }>
			<TimeGrid<TEventResources, typeof VIEWS.day>
				view={ VIEWS.day }
				columnHeadings={ columnHeadings }
				startTime={ startTime }
				endTime={ endTime }
			/>
		</div>
	)
}

export const DayView = createViewComponent<EventResources, DayViewProps<EventResources>>(DayViewComponent, {
	range: (date, { localizer }: ViewStaticMethodProps<EventResources>) => {
		const start = localizer.startOf(date, "day")
		const end = localizer.endOf(date, "day")
		return { start, end }
	},
	navigate: (date, action, { localizer }: ViewStaticMethodProps<EventResources>) => {
		switch(action) {
			case NAVIGATION.today:
				return new Date()
			case NAVIGATION.previous:
				return localizer.add(date, - 1, "day")
			case NAVIGATION.next:
				return localizer.add(date, 1, "day")
			default:
				return date
		}
	},
	title: (date, { localizer }: ViewStaticMethodProps<EventResources>) => localizer.format(date, localizer.messages.formats.dayTitle),
})
