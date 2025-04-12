import { type Meta, type StoryObj } from "@storybook/react"

import { Calendar, type CalendarEvent, type EventResources, type Resource } from "@/."
import { StrategyNameMap } from "@/lib/displayStrategies"
import { type CalendarLocalizer } from "@/lib/localizers"
import { VIEWS, VIEW_NAMES, NAVIGATION_ACTION } from "@/views"

import { generateEvents } from "../lib/events"

interface CalendarProps<TEventResources extends EventResources = EventResources> {
	defaultDate?: Date
	defaultView?: VIEW_NAMES
	events: CalendarEvent<TEventResources>[]
	localizer?: CalendarLocalizer
	views?: readonly VIEW_NAMES[]
	displayStrategies?: Partial<StrategyNameMap>
	onNavigate?: (newDate: Date, action: NAVIGATION_ACTION, view: VIEW_NAMES) => void
	onViewChange?: (view: VIEW_NAMES) => void
	eventPopoverContent?: (event: CalendarEvent<TEventResources>, localizer: CalendarLocalizer) => React.ReactNode
	onSelectSlot?: (date: Date) => void
	resources?: Resource[]
	groupByResource?: boolean
}

const CalendarWrapper = <TEventResources extends EventResources>(props: CalendarProps<TEventResources>) => {
	return (
		<div style={ { width: "1000px", height: "700px" } }>
			<Calendar { ...props } />
		</div>
	)
}

const meta: Meta<typeof Calendar> = {
	title: "Calendar/Calendar",
	component: Calendar,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		defaultDate: {
			control: "date",
			description: "The initial date the calendar should display. Defaults to the current date if not provided.",
		},
		defaultView: {
			control: "select",
			options: Object.keys(VIEWS),
			description: "The initial view the calendar should display (e.g., month, week, day).",
			defaultValue: VIEWS.month,
		},
		events: {
			control: "object",
			description: "An array of event objects to be displayed on the calendar.",
		},
		localizer: {
			control: "object",
			description: "Optional. A localizer object for date formatting and internationalization. Defaults to an English localizer.",
		},
		views: {
			control: "object",
			description: "An array of view names (keys from VIEWS) that the calendar should support and allow switching between. Defaults to all views.",
			defaultValue: Object.keys(VIEWS),
		},
		displayStrategies: {
			control: "object",
			description: "Optional. An object mapping view names to display strategy names (e.g., 'stack', 'overlap') to control event layout.",
		},
		onNavigate: {
			action: "navigated",
			description: "Callback function fired when the user navigates the calendar (e.g., next/prev month, today).",
		},
		onViewChange: {
			action: "viewChanged",
			description: "Callback function fired when the user changes the calendar view.",
		},
		eventPopoverContent: {
			control: "object",
			description: "Optional. A function that returns custom React node content for the event popover.",
		},
		onSelectSlot: {
			action: "slotSelected",
			description: "Callback function fired when the user clicks or selects a time slot or day cell.",
		},
		resources: {
			control: "object",
			description: "An array of resource objects (e.g., rooms, people) used for grouping events when `groupByResource` is true.",
		},
		groupByResource: {
			control: "boolean",
			description: "If true, enables grouping events by resources in applicable views (like Week and Day). Requires the `resources` prop to be set.",
			defaultValue: false,
		},
	},
}

export default meta
type Story = StoryObj<typeof Calendar>

const now = new Date()

export const Default: Story = {
	args: {
		defaultDate: now,
		defaultView: VIEWS.month,
		events: generateEvents(now, VIEWS.month),
		resources: [],
	},
	render: (args) => <CalendarWrapper { ...args } />,
}

export const WithEvents: Story = {
	args: {
		defaultDate: now,
		defaultView: VIEWS.month,
		events: generateEvents(now, VIEWS.month),
		resources: [],
	},
	render: (args) => <CalendarWrapper { ...args } />,
}

export const WithResources: Story = {
	args: {
		defaultDate: now,
		defaultView: VIEWS.week,
		events: [
			{
				id: "r1-event1",
				title: "Room 1 - Morning Task",
				start: new Date(new Date().setHours(9, 0, 0, 0)),
				end: new Date(new Date().setHours(10, 30, 0, 0)),
				resourceId: "1",
			},
			{
				id: "r2-event1",
				title: "Room 2 - Afternoon Meeting",
				start: new Date(new Date().setHours(14, 0, 0, 0)),
				end: new Date(new Date().setHours(15, 0, 0, 0)),
				resourceId: "2",
			},
			{
				id: "r1-event2",
				title: "Room 1 - Late Work",
				start: new Date(new Date().setHours(16, 0, 0, 0)),
				end: new Date(new Date().setHours(17, 30, 0, 0)),
				resourceId: "1",
			},
		],
		resources: [
			{ id: "1", title: "Room 1" },
			{ id: "2", title: "Room 2" },
		],
		groupByResource: true,
	},
	render: (args) => <CalendarWrapper { ...args } />,
}

export const AllDayEvents: Story = {
	args: {
		defaultDate: new Date(),
		defaultView: VIEWS.month, // Start with month view
		events: [
			{
				id: "allday-1",
				title: "All Day Conference",
				start: new Date(new Date().setHours(0, 0, 0, 0)), // Start at beginning of day
				end: new Date(new Date().setHours(23, 59, 59, 999)), // End at end of day
				allDay: true,
			},
			{
				id: "normal-1",
				title: "Morning Meeting",
				start: new Date(new Date().setHours(10, 0, 0, 0)),
				end: new Date(new Date().setHours(11, 30, 0, 0)),
			},
			{
				id: "allday-multi",
				title: "Multi-Day Offsite",
				start: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(0, 0, 0, 0)), // Starts tomorrow
				end: new Date(new Date(new Date().setDate(new Date().getDate() + 3)).setHours(23, 59, 59, 999)), // Ends day after tomorrow
				allDay: true,
			},
		],
		resources: [],
	},
	render: (args) => <CalendarWrapper { ...args } />,
}

export const DisplayStrategiesDemo: Story = {
	args: {
		defaultDate: new Date(),
		defaultView: VIEWS.month,
		events: [
			// Multiple overlapping events for demonstration
			{
				id: "ds-1",
				title: "Event A",
				start: new Date(new Date().setHours(9, 0, 0, 0)),
				end: new Date(new Date().setHours(11, 0, 0, 0)),
			},
			{
				id: "ds-2",
				title: "Event B",
				start: new Date(new Date().setHours(9, 30, 0, 0)),
				end: new Date(new Date().setHours(10, 30, 0, 0)),
			},
			{
				id: "ds-3",
				title: "Event C",
				start: new Date(new Date().setHours(10, 0, 0, 0)),
				end: new Date(new Date().setHours(11, 30, 0, 0)),
			},
			// Another set for a different day
			{
				id: "ds-4",
				title: "Event D",
				start: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(14, 0, 0, 0)),
				end: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(15, 0, 0, 0)),
			},
			{
				id: "ds-5",
				title: "Event E",
				start: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(14, 30, 0, 0)),
				end: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(15, 30, 0, 0)),
			},
		],
		displayStrategies: {
			month: "stack", // Default strategy for month
			week: "overlap", // Default strategy for week/day
			day: "overlap",
		},
	},
	argTypes: {
		// Override argTypes specifically for this story to control strategies
		displayStrategies: {
			control: "object",
			description: "Control event layout strategy per view. Try changing 'month' between 'stack' and 'overlap', or 'week'/'day' between 'overlap' and 'stack'.",
		},
	},
	render: (args) => <CalendarWrapper { ...args } />,
}

export const CustomPopover: Story = {
	args: {
		defaultDate: new Date(),
		events: [
			{
				id: "1",
				title: "Meeting with Custom Popover",
				start: new Date(),
				end: new Date(new Date().setHours(new Date().getHours() + 1)),
			},
		],
		eventPopoverContent: (event, localizer) => (
			<div style={ { padding: "10px", border: "1px solid blue", background: "lightblue" } }>
				<h4>Custom Content</h4>
				<p>Event ID: { event.id }</p>
				<p>Title: { typeof event.title === "function" ? event.title(event as any) : event.title }</p>
				<p>Starts: { localizer.format(event.start, "Pp") }</p>
				<p>Ends: { localizer.format(event.end, "Pp") }</p>
			</div>
		),
	},
	render: (args) => <CalendarWrapper { ...args } />,
}
