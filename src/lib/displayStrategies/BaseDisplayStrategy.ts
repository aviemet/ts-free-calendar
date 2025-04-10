import clsx from "clsx"


import { EventResources, CalendarEvent } from "@/."
import { TimeGridHeading } from "@/components/TimeGrid"
import { SortedArray } from "@/lib/SortedArray"
import { VIEW_NAMES } from "@/views"

import { CalendarLocalizer } from "../localizers"
import { BaseDisplayProperties, EventDisplayDetails } from "./types"


export interface StrategyConfig {
	localizer: CalendarLocalizer
	timeIncrement?: number
	startTime?: Date
	endTime?: Date
	columnHeadings?: TimeGridHeading[]
}

export abstract class BaseDisplayStrategy<
	TEventResources extends EventResources,
	P extends BaseDisplayProperties
> {
	protected config: StrategyConfig

	constructor(config: StrategyConfig) {
		if(!config || !config.localizer) {
			throw new Error("BaseDisplayStrategy requires a localizer in its configuration.")
		}
		this.config = config
	}

	/**
   * Process an event and return display details with the specific shape P.
   * The implementation MUST return objects conforming to P.
   */
	abstract processEvent(event: CalendarEvent<TEventResources>): EventDisplayDetails<TEventResources, P>[]

	/**
   * Compare two events. It receives details containing properties of shape P.
   */
	abstract compare(a: EventDisplayDetails<TEventResources, P>, b: EventDisplayDetails<TEventResources, P>): number

	/**
   * Update the strategy configuration.
   * Useful for dynamic updates without creating a new strategy instance.
   */
	configure(config: Partial<StrategyConfig>): void {
		this.config = { ...this.config, ...config }
		if(!this.config.localizer) {
			throw new Error("Cannot remove localizer during configuration update.")
		}
	}

	/******************
	 * Helper Methods *
	 ******************/

	/**
   * Check if an event spans multiple days based on the localizer.
   */
	protected spansMultipleDays(event: CalendarEvent<TEventResources>): boolean {
		const startDay = this.config.localizer.startOf(event.start, "day")
		const endDay = this.config.localizer.startOf(
			this.config.localizer.adjustMidnightTime(event.end),
			"day"
		)
		return startDay.getTime() !== endDay.getTime()
	}

	/**
   * Check if an event spans week boundaries based on the localizer.
   */
	protected spansWeekBorder(event: CalendarEvent<TEventResources>): boolean {
		return !this.config.localizer.dateWithinRange("week", event.end, event.start)
	}

	/**
   * Split an event at day boundaries according to the localizer.
   * Returns segments with adjusted displayStart/displayEnd times.
   */
	protected splitAtDayBoundaries(event: CalendarEvent<TEventResources>): Array<{
		event: CalendarEvent<TEventResources>
		displayStart: Date
		displayEnd: Date
	}> {
		const segments: Array<{ event: CalendarEvent<TEventResources>, displayStart: Date, displayEnd: Date }> = []
		let currentStart = event.start
		const finalEnd = this.config.localizer.adjustMidnightTime(event.end)

		// Ensure we don't get stuck in an infinite loop if start >= end
		if(!this.config.localizer.isBefore(currentStart, finalEnd)) {
			return [{ event, displayStart: currentStart, displayEnd: finalEnd }]
		}

		while(
			this.config.localizer.isBefore(currentStart, finalEnd) &&
      this.config.localizer.startOf(currentStart, "day").getTime() < // Use < to handle exact midnight end
      this.config.localizer.startOf(finalEnd, "day").getTime()
		) {
			const dayEnd = this.config.localizer.endOf(currentStart, "day")
			// Clamp the segment end to the actual final end time
			const segmentEnd = this.config.localizer.isBefore(dayEnd, finalEnd) ? dayEnd : finalEnd

			segments.push({
				event,
				displayStart: currentStart,
				displayEnd: segmentEnd,
			})

			// Move to the start of the next day, ensuring it's aligned with a day boundary
			currentStart = this.config.localizer.add(this.config.localizer.startOf(currentStart, "day"), 1, "day")
		}

		// Add the final segment if the loop finished but currentStart is still before finalEnd
		if(this.config.localizer.isBefore(currentStart, finalEnd)) {
			segments.push({
				event,
				displayStart: currentStart,
				displayEnd: finalEnd,
			})
		}

		return segments
	}

	/**
   * Split an event at week boundaries according to the localizer.
   * Returns segments with adjusted displayStart/displayEnd times.
   */
	protected splitAtWeekBoundaries(event: CalendarEvent<TEventResources>): CalendarEvent<TEventResources>[] {
		const { localizer } = this.config

		const segments: CalendarEvent<TEventResources>[] = []
		let currentStart = event.start
		const finalEnd = localizer.adjustMidnightTime(event.end)

		// Ensure we don't get stuck in an infinite loop if start >= end
		if(!localizer.isBefore(currentStart, finalEnd)) {
			return [{ ...event, start: currentStart, end: finalEnd }]
		}

		while(
			localizer.isBefore(currentStart, finalEnd) &&
      localizer.startOf(currentStart, "week").getTime() < localizer.startOf(finalEnd, "week").getTime()
		) {
			const weekEnd = localizer.endOf(currentStart, "week")
			const segmentEnd = localizer.isBefore(weekEnd, finalEnd) ? weekEnd : finalEnd

			segments.push({
				...event,
				start: currentStart,
				end: segmentEnd,
			})

			// Move to the start of the next week, ensuring it's aligned with a week boundary
			currentStart = localizer.add(localizer.startOf(currentStart, "week"), 1, "week")
		}

		// Add the final segment if the loop finished but currentStart is still before finalEnd
		if(localizer.isBefore(currentStart, finalEnd)) {
			segments.push({
				...event,
				start: currentStart,
				end: finalEnd,
			})
		}

		return segments
	}

	/**
	 * Calculates the grid column placement for an event in a calendar view
	 */
	protected calculateMonthGridPlacement(
		event: CalendarEvent<TEventResources>
	) {
		const start = event.start
		const end = this.config.localizer.adjustMidnightTime(event.end)

		const startDay = this.config.localizer.dayOfWeek(start)
		const endDay = this.config.localizer.dayOfWeek(end)

		const columnStart = startDay + 1
		const columnSpan = (endDay < startDay ? endDay + 7 : endDay) - startDay + 1

		return { columnStart, columnSpan }
	}

	/**
   * Calculate grid column placement.
   */
	protected calculateTimeGridPlacement(columnIndex: number, totalColumns: number): {
		columnStart: number
		columnSpan: number
	} | null {
		if(columnIndex < 0 || columnIndex >= totalColumns) {
			// eslint-disable-next-line no-console
			console.warn("Invalid columnIndex provided to calculateGridPlacement", { columnIndex, totalColumns })
			return null
		}

		const columnStart = columnIndex + 1 // CSS grid is 1-based
		const columnSpan = 1

		return { columnStart, columnSpan }
	}

	/**
   * Calculate time grid row indices based on configuration.
   * Returns null if necessary configuration (timeIncrement, startTime) is missing.
   */
	protected calculateTimeGridRows(start: Date, end: Date): { rowStart: number, rowEnd: number } | null {
		if(this.config.timeIncrement === undefined || !this.config.startTime) {
			// eslint-disable-next-line no-console
			console.warn("TimeGrid configuration (timeIncrement, startTime) missing for row calculation.")
			return null
		}

		const viewStartOfDay = this.config.localizer.startOf(start, "day")

		const startMinutesRaw = this.config.localizer.duration(viewStartOfDay, start)

		const endAdjusted = this.config.localizer.adjustMidnightTime(end)
		const endMinutesRaw = this.config.localizer.duration(viewStartOfDay, endAdjusted)

		const startMinutes = startMinutesRaw
		const endMinutes = endMinutesRaw

		const timeIncrementMinutes = this.config.timeIncrement
		let rowStart = Math.floor(startMinutes / timeIncrementMinutes) + 1
		let rowEnd = Math.ceil(endMinutes / timeIncrementMinutes) + 1

		if(rowEnd <= rowStart) {
			rowEnd = rowStart + 1
		}

		return { rowStart, rowEnd }
	}

	/**
   * Create common continuation CSS classes.
   */
	protected getContinuationClasses(index: number, totalSegments: number): string {
		return clsx({
			"continues-on": totalSegments > 1 && index < totalSegments - 1,
			"continued-from": totalSegments > 1 && index > 0,
		})
	}

	/**
	 * Filters events based on view range and processes them using a given strategy instance.
	 * Groups the resulting display details by day.
	 */
	public groupAndFilterEvents(
		view: VIEW_NAMES,
		events: CalendarEvent<TEventResources>[],
		date: Date,
		groupByResource?: boolean
	): Map<string, SortedArray<EventDisplayDetails<TEventResources, P>>> {
		const firstDay = this.config.localizer.firstVisibleDay(date, view)
		const lastDay = this.config.localizer.lastVisibleDay(date, view)

		const groupedEvents = new Map<string, SortedArray<EventDisplayDetails<TEventResources, P>>>()

		const isResourceGroup = Boolean(groupByResource) && (this.config.columnHeadings ?? []).length > 0

		events.forEach(event => {
			// Ignore events outside visible range for current view
			if(!this.config.localizer.isAfter(event.end, firstDay) || !this.config.localizer.isBefore(event.start, lastDay)) return

			this.processEvent(event).forEach(processedEvent => {
				const key = isResourceGroup && event.resourceId !== undefined
					? this.resourceKey(event.resourceId)
					: this.dateKey(processedEvent.displayProperties.displayStart)

				if(!key) return

				if(!groupedEvents.has(key)) {
					groupedEvents.set(key, new SortedArray<EventDisplayDetails<TEventResources, P>>(this.compare.bind(this)))
				}
				groupedEvents.get(key)!.push(processedEvent)
			})
		})

		return groupedEvents
	}

	private dateKey = (date: Date) => this.config.localizer.startOf(date, "day").toISOString()

	private resourceKey = (resourceId: string | number | undefined) => {
		const matchingHeading = this.config.columnHeadings!.find(h => h.resourceId === resourceId)

		if(matchingHeading) return String(resourceId)

		return undefined
	}

}
