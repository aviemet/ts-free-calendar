import { VIEW_NAMES } from "../views"

export interface CalendarMessages {
	views: Record<VIEW_NAMES, string>
	navigation: {
		previous: string
		today: string
		next: string
	}
	formats: {
		monthTitle: string
		weekTitle: string
		dayTitle: string
		agendaTitle: string
	}
	labels: {
		allDay: string
		noEvents: string
		loading: string
	}
}

export const defaultMessages: CalendarMessages = {
	views: {
		month: "Month",
		week: "Week",
		day: "Day",
		agenda: "Agenda",
	},
	navigation: {
		previous: "Previous",
		today: "Today",
		next: "Next",
	},
	formats: {
		monthTitle: "MMMM YYYY",
		weekTitle: "Week of MMM D, YYYY",
		dayTitle: "dddd, MMMM D, YYYY",
		agendaTitle: "MMM D, YYYY",
	},
	labels: {
		allDay: "All Day",
		noEvents: "No Events",
		loading: "Loading...",
	},
}
