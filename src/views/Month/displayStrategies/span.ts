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
 * Month Span Strategy:
 * - Splits events only if they cross week boundaries.
 * - Events are rendered spanning the columns representing the days they cover within a week.
 * - Can render as 'filled' or 'indicator' based on duration within the segment.
 */
export class MonthSpanStrategy<TEventResources extends EventResources>
	extends BaseDisplayStrategy<TEventResources, GridDisplayProperties> {
	processEvent(event: CalendarEvent<TEventResources>): EventDisplayDetails<TEventResources, GridDisplayProperties>[] {
		// 1. Split by week boundaries if necessary
		const weekSegments: CalendarEvent<TEventResources>[] = this.spansWeekBorder(event)
			? this.splitAtWeekBoundaries(event)
			: [{ ...event }] // Use a shallow copy

		// 2. Generate display details for each week segment
		return weekSegments.map((segment, index): EventDisplayDetails<TEventResources, GridDisplayProperties> => {
			// Determine if the segment itself spans multiple days (for styling)
			const doesSpanMultipleDays = !this.config.localizer.isSame(
				segment.start,
				segment.end,
				"day"
			)

			// Calculate grid placement for the segment
			const gridPlacement = this.calculateMonthGridPlacement(segment)

			const displayProperties: GridDisplayProperties = {
				displayStart: segment.start,
				displayEnd: segment.end,
				columnStart: gridPlacement.columnStart,
				columnSpan: gridPlacement.columnSpan,
				className: clsx(
					doesSpanMultipleDays ? "filled" : "indicator",
					this.getContinuationClasses(index, weekSegments.length)
				),
			}

			return {
				event: event,
				displayProperties,
				compare: this.compare,
			}
		})
	}

	/**
	 * Compares two event details for sorting.
	 * Span strategy prioritizes longer events (wider columnSpan),
	 * then falls back to start time.
	 */
	compare(a: EventDisplayDetails<TEventResources, GridDisplayProperties>, b: EventDisplayDetails<TEventResources, GridDisplayProperties>): number {
		// Longer spans first
		const spanDiff = b.displayProperties.columnSpan - a.displayProperties.columnSpan
		if(spanDiff !== 0) return spanDiff

		// If spans are equal, earlier start time first
		// Use displayStart as it reflects the segment's position
		return a.displayProperties.displayStart.valueOf() - b.displayProperties.displayStart.valueOf()
	}
}
