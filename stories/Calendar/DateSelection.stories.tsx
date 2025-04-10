import { type Meta, type StoryObj } from "@storybook/react"
import { useState } from "react"

import { Calendar, type CalendarEvent, type EventResources } from "@/."
import { VIEWS } from "@/views"

/**
 * The Calendar component provides a flexible interface for displaying and interacting with dates and events.
 * This story demonstrates various ways to handle date selection and event display.
 */
const meta: Meta<typeof Calendar> = {
	title: "Calendar/DateSelection",
	component: Calendar,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		defaultDate: {
			control: "date",
			description: "The initial date to display in the calendar",
		},
		defaultView: {
			control: "select",
			options: Object.values(VIEWS),
			description: "The initial view to display (month, week, day, or agenda)",
		},
		events: {
			control: "object",
			description: "Array of events to display in the calendar",
		},
		onSelectSlot: {
			action: "selected",
			description: "Callback fired when a date slot is selected",
		},
	},
}

export default meta
type Story = StoryObj<typeof Calendar>

/**
 * Basic calendar with no events, demonstrating the default appearance and behavior.
 */
export const Default: Story = {
	args: {
		defaultDate: new Date(),
		defaultView: VIEWS.month,
		events: [],
	},
}

/**
 * Calendar with a sample event, showing how events are displayed and can be interacted with.
 */
export const WithEvents: Story = {
	args: {
		defaultDate: new Date(),
		defaultView: VIEWS.month,
		events: [
			{
				id: "1",
				title: "Meeting",
				start: new Date(),
				end: new Date(new Date().setHours(new Date().getHours() + 2)),
			},
		],
	},
}

/**
 * Calendar with slot selection handling, demonstrating how to capture user interactions with date slots.
 */
export const WithSlotSelection: Story = {
	args: {
		defaultDate: new Date(),
		defaultView: VIEWS.month,
		events: [],
		onSelectSlot: (date: Date) => {
			console.log("Selected date:", date)
		},
	},
}
