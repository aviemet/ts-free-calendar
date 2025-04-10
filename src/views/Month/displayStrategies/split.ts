import clsx from "clsx"

import { EventResources, CalendarEvent } from "@/."
import {
	BaseDisplayStrategy,
} from "@/lib/displayStrategies/BaseDisplayStrategy"
import {
	EventDisplayDetails,
	GridDisplayProperties,
} from "@/lib/displayStrategies/types"


/**
 * Month Split Strategy:
 * - Splits events first by week boundaries if they cross.
 * - Then splits each resulting segment by day boundaries.
 * - Each final segment represents the event's presence on a single day.
 * - Renders as a filled block occupying one column.
 */
export class MonthSplitStrategy<TEventResources extends EventResources>
	extends BaseDisplayStrategy<TEventResources, GridDisplayProperties> {
	/**
	 * Processes an event, splitting it by week and day boundaries.
	 * Returns an array of display details, one for each day the event appears on.
	 */
	processEvent(event: CalendarEvent<TEventResources>): EventDisplayDetails<TEventResources, GridDisplayProperties>[] {
		const weekSegments: CalendarEvent<TEventResources>[] = this.spansWeekBorder(event)
			? this.splitAtWeekBoundaries(event)
			: [{ ...event }]

		type DaySegment = { event: CalendarEvent<TEventResources>, displayStart: Date, displayEnd: Date };

		const daySegments: DaySegment[] = weekSegments.flatMap((weekSegment: CalendarEvent<TEventResources>) =>
			this.splitAtDayBoundaries(weekSegment)
		)

		return daySegments.map((segment: DaySegment, index: number): EventDisplayDetails<TEventResources, GridDisplayProperties> => {
			// Calculate grid placement for the specific day segment
			// Pass the correct object shape { start, end } using segment's display times
			const gridPlacement = this.calculateMonthGridPlacement({
				...segment.event,
				start: segment.displayStart,
				end: segment.displayEnd,
			})

			const displayProperties: GridDisplayProperties = {
				displayStart: segment.displayStart,
				displayEnd: segment.displayEnd,
				columnStart: gridPlacement.columnStart,
				columnSpan: 1, // Split strategy always results in 1-day segments
				className: clsx(
					"filled", // Split events are typically shown as solid blocks
					this.getContinuationClasses(index, daySegments.length)
				),
			}

			return {
				event: segment.event,
				displayProperties,
				compare: this.compare,
			}
		})
	}

	/**
	 * Compares two event details for sorting.
	 * Split strategy sorts primarily by start time, as all segments are single-day.
	 */
	compare(a: EventDisplayDetails<TEventResources, GridDisplayProperties>, b: EventDisplayDetails<TEventResources, GridDisplayProperties>): number {
		const startDiff = a.displayProperties.displayStart.valueOf() - b.displayProperties.displayStart.valueOf()
		if(startDiff !== 0) return startDiff

		return 0
	}
}
