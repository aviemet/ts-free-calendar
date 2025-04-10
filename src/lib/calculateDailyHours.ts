import { CalendarEvent, EventResources } from "@/."
import { CalendarLocalizer } from "@/lib/localizers"


/**
 * Calculates the total hours worked for each day given an array of events.
 * Returns a Map where the key is the ISO string of the start of each day,
 * and the value is the total minutes worked that day.
 */
export function calculateDailyHours<TEventResources extends EventResources = EventResources>(
	events: CalendarEvent<TEventResources>[],
	localizer: CalendarLocalizer
): Map<string, number> {
	const dailyTotals = new Map<string, number>()

	events.forEach(event => {
		const eventEnd = localizer.adjustMidnightTime(event.end)
		let currentDate = localizer.startOf(event.start, "day")
		const endDate = localizer.startOf(eventEnd, "day")

		// Handle each day the event spans
		while(currentDate <= endDate) {
			const dayKey = currentDate.toISOString()
			const dayStart = currentDate
			const dayEnd = localizer.endOf(currentDate, "day")

			// Calculate the overlap period for this day
			const periodStart = event.start > dayStart ? event.start : dayStart
			const periodEnd = eventEnd < dayEnd ? eventEnd : dayEnd

			// Add minutes to the daily total
			const currentTotal = dailyTotals.get(dayKey) || 0
			dailyTotals.set(dayKey, currentTotal + localizer.duration(periodStart, periodEnd))

			// Move to next day
			currentDate = localizer.add(currentDate, 1, "day")
		}
	})

	return dailyTotals
}
