import dayjs from "dayjs"
import isBetween from "dayjs/plugin/isBetween"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import localeData from "dayjs/plugin/localeData"
import localizedFormat from "dayjs/plugin/localizedFormat"
import minMax from "dayjs/plugin/minMax"
import utc from "dayjs/plugin/utc"
import weekdayPlugin from "dayjs/plugin/weekday"

import { CalendarEvent } from "@/index"
import { dayJsLocalizer } from "@/lib/localizers/dayJsLocalizer" // Import the factory
import { VIEW_NAMES } from "@/views"

// Extend dayjs with necessary plugins, as the localizer factory expects
dayjs.extend(localeData)
dayjs.extend(weekdayPlugin)
dayjs.extend(utc)
dayjs.extend(minMax)
dayjs.extend(localizedFormat)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(isBetween)

// Instantiate the actual localizer
const localizer = dayJsLocalizer(dayjs)

// Predefined colors for consistency
const colors = [
	"#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6",
	"#0ea5e9", "#6366f1", "#a855f7", "#ec4899", "#84cc16",
	"#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#d946ef",
]

const getDeterministicColor = (seed: string): string => {
	let hash = 0
	for(let i = 0; i < seed.length; i++) {
		hash = (hash << 5) - hash + seed.charCodeAt(i)
		hash |= 0 // Convert to 32bit integer
	}
	const index = Math.abs(hash) % colors.length
	return colors[index]
}

// Define a richer pattern of events relative to the view start
interface EventPattern {
	dayOffset: number
	title: string
	hour?: number
	minute?: number
	durationMinutes?: number
	durationDays?: number
	allDay?: boolean
}

const eventPatterns: EventPattern[] = [
	// --- Day 0 (Usually Sunday or Start of Month view) ---
	{ dayOffset: 0, allDay: true, title: "View Start Conf" },
	{ dayOffset: 0, hour: 14, minute: 0, durationMinutes: 90, title: "Afternoon Meet" },
	{ dayOffset: 0, hour: 16, minute: 0, durationMinutes: 60, title: "Planning Session" },

	// --- Day 1 ---
	{ dayOffset: 1, hour: 9, minute: 0, durationMinutes: 30, title: "Quick Sync" },
	{ dayOffset: 1, hour: 9, minute: 15, durationMinutes: 60, title: "Overlap Sync A" }, // Overlaps
	{ dayOffset: 1, hour: 10, minute: 30, durationMinutes: 90, title: "Project Work" },
	{ dayOffset: 1, hour: 11, minute: 0, durationMinutes: 60, title: "Overlap Event B" }, // Overlaps previous
	{ dayOffset: 1, hour: 15, minute: 0, durationMinutes: 120, title: "Design Review" },

	// --- Day 2 ---
	{ dayOffset: 2, allDay: true, durationDays: 1, title: "2-Day All Day Event" }, // Spans Day 2 and 3
	{ dayOffset: 2, hour: 8, minute: 0, durationMinutes: 45, title: "Early Bird Task" },
	{ dayOffset: 2, hour: 10, minute: 0, durationMinutes: 120, title: "Workshop Part 1" },
	{ dayOffset: 2, hour: 13, minute: 0, durationMinutes: 60, title: "Lunch & Learn" },
	{ dayOffset: 2, hour: 16, minute: 30, durationMinutes: 90, title: "Late Session" },

	// --- Day 3 ---
	{ dayOffset: 3, hour: 10, minute: 0, durationMinutes: 120, title: "Workshop Part 2" }, // Continues from Day 2 conceptually
	{ dayOffset: 3, hour: 14, minute: 0, durationMinutes: 60, title: "Client Call" },
	{ dayOffset: 3, hour: 14, minute: 15, durationMinutes: 30, title: "Short Follow-up" }, // Contained/Overlap

	// --- Day 4 ---
	{ dayOffset: 4, allDay: true, title: "Single All Day" },
	{ dayOffset: 4, hour: 9, minute: 30, durationMinutes: 150, title: "Deep Dive" },
	{ dayOffset: 4, hour: 22, minute: 0, durationMinutes: 360, title: "Overnight Task" }, // Spans Day 4/5

	// --- Day 5 ---
	{ dayOffset: 5, hour: 11, minute: 0, durationMinutes: 90, title: "Mid-day Strategy" },
	{ dayOffset: 5, hour: 15, minute: 0, durationMinutes: 60, title: "Team Building" },

	// --- Day 6 (Usually Saturday) ---
	{ dayOffset: 6, hour: 10, minute: 0, durationMinutes: 45, title: "Weekend Check-in" },
	{ dayOffset: 6, allDay: true, durationDays: 1, title: "Weekend Offsite" }, // Spans Sat/Sun

	// --- Add more patterns for longer views (e.g., Month) ---
	{ dayOffset: 8, hour: 9, minute: 0, durationMinutes: 60, title: "Week 2 Start" },
	{ dayOffset: 10, allDay: true, title: "Mid-Week All Day" },
	{ dayOffset: 12, hour: 13, minute: 0, durationMinutes: 180, title: "Long Afternoon Block" },
	{ dayOffset: 15, hour: 10, minute: 0, durationMinutes: 60, title: "Week 3 Checkpoint" },
	{ dayOffset: 20, allDay: true, durationDays: 2, title: "Multi-Week All Day Event" }, // Spans into week 4
	{ dayOffset: 25, hour: 11, minute: 0, durationMinutes: 90, title: "Late Month Review" },
	{ dayOffset: 28, hour: 16, minute: 0, durationMinutes: 120, title: "Month End Prep" },

	// --- Edge Cases ---
	{ dayOffset: 1, hour: 0, minute: 0, durationMinutes: 60, title: "Starts at Midnight" },
	{ dayOffset: 1, hour: 23, minute: 30, durationMinutes: 60, title: "Ends Past Midnight" }, // Crosses day boundary
	{ dayOffset: 7, hour: 0, minute: 0, durationMinutes: 1440, title: "Full 24h Timed Event" }, // Spans exactly one day
]

export const generateEvents = (date: Date, view: VIEW_NAMES): CalendarEvent[] => {
	// Use the *actual* localizer to get the visible range
	const viewStartDt = localizer.firstVisibleDay(date, view)
	const viewEndDt = localizer.lastVisibleDay(date, view)
	const viewStart = dayjs(viewStartDt) // Convert to dayjs for manipulation
	const viewEnd = dayjs(viewEndDt)

	const events: CalendarEvent[] = []

	// Generate events based on the expanded pattern
	eventPatterns.forEach((pattern) => {
		const eventStartBase = viewStart.add(pattern.dayOffset, "day")
		let eventStart: dayjs.Dayjs
		let eventEnd: dayjs.Dayjs
		let allDay = pattern.allDay || false

		if(allDay) {
			eventStart = eventStartBase.startOf("day")
			const durationDays = pattern.durationDays === undefined ? 0 : pattern.durationDays // Default to single day if undefined
			eventEnd = eventStart.add(durationDays, "day").endOf("day")
		} else {
			// Ensure hour and minute are defined for timed events
			if(pattern.hour === undefined || pattern.minute === undefined || pattern.durationMinutes === undefined) {
				console.warn("Skipping timed event pattern due to missing time/duration:", pattern)
				return // Skip this pattern
			}
			eventStart = eventStartBase.set("hour", pattern.hour).set("minute", pattern.minute)
			eventEnd = eventStart.add(pattern.durationMinutes, "minute")
		}

		// Check if the event overlaps with the visible range
		// (Event ends after view starts AND Event starts before view ends)
		// Use isSameOrAfter/isSameOrBefore for inclusive range checks
		if(eventEnd.isSameOrAfter(viewStart) && eventStart.isSameOrBefore(viewEnd)) {
			// Use a combination of view, title, and offset for a unique ID
			const eventId = `${view}-${pattern.title.replace(/\s+/g, "-")}-${pattern.dayOffset}`
			events.push({
				id: eventId,
				title: pattern.title,
				start: eventStart.toDate(),
				end: eventEnd.toDate(),
				allDay,
				color: getDeterministicColor(eventId),
			})
		}
	})

	return events
}
