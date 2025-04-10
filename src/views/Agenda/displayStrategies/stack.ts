import clsx from "clsx"

import { EventResources, CalendarEvent } from "@/."
import {
	BaseDisplayStrategy,
} from "@/lib/displayStrategies/BaseDisplayStrategy"
import {
	EventDisplayDetails,
	AgendaDisplayProperties,
} from "@/lib/displayStrategies/types"


/**
 * Agenda Stack Strategy (Placeholder/Basic Implementation)
 * - Renders event as a single entry.
 * - Sorting is done by start time, then duration.
 */
export class AgendaStackStrategy<TEventResources extends EventResources>
	extends BaseDisplayStrategy<TEventResources, AgendaDisplayProperties> {

	processEvent(event: CalendarEvent<TEventResources>): EventDisplayDetails<TEventResources, AgendaDisplayProperties>[] {
		// Agenda view typically doesn't involve complex grid calculations
		// It just needs the event data and maybe basic display flags.
		const displayProperties: AgendaDisplayProperties = {
			displayStart: event.start,
			displayEnd: event.end,
			// className could indicate all-day, etc.
			className: clsx({ "all-day": event.allDay }),
			allDay: event.allDay,
		}

		return [{
			event,
			displayProperties,
			compare: this.compare,
		}]
	}

	/**
	 * Compares two event details for sorting.
	 * Agenda stack strategy: sort by start time then duration.
	 */
	compare(a: EventDisplayDetails<TEventResources, AgendaDisplayProperties>, b: EventDisplayDetails<TEventResources, AgendaDisplayProperties>): number {
		const startDiff = a.event.start.valueOf() - b.event.start.valueOf()
		if(startDiff !== 0) return startDiff

		const durationA = a.event.end.valueOf() - a.event.start.valueOf()
		const durationB = b.event.end.valueOf() - b.event.start.valueOf()
		return durationB - durationA // Longer duration first for same start time
	}
}
