import { type Meta, type StoryObj } from "@storybook/react"

import { Calendar, type CalendarEvent, type EventResources, type Resource } from "@/."
import { StrategyNameMap } from "@/lib/displayStrategies"
import { type CalendarLocalizer } from "@/lib/localizers"
import { VIEWS, VIEW_NAMES, NAVIGATION_ACTION } from "@/views"

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
	return <Calendar { ...props } />
}

const meta: Meta<typeof Calendar> = {
	title: "Calendar/Calendar",
	component: Calendar,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		defaultDate: { control: "date" },
		defaultView: { control: "select", options: Object.keys(VIEWS) },
		events: { control: "object" },
		views: { control: "object" },
		displayStrategies: { control: "object" },
		resources: { control: "object" },
		groupByResource: { control: "boolean" },
	},
}

export default meta
type Story = StoryObj<typeof Calendar>

export const Default: Story = {
	args: {
		defaultDate: new Date(),
		events: [],
		resources: [],
	},
	render: (args) => <CalendarWrapper { ...args } />,
}

export const WithEvents: Story = {
	args: {
		defaultDate: new Date(),
		events: [
			{
				id: "1",
				title: "Meeting",
				start: new Date(),
				end: new Date(new Date().setHours(new Date().getHours() + 1)),
			},
		],
		resources: [],
	},
	render: (args) => <CalendarWrapper { ...args } />,
}

export const WithResources: Story = {
	args: {
		defaultDate: new Date(),
		events: [],
		resources: [
			{ id: "1", title: "Room 1" },
			{ id: "2", title: "Room 2" },
		],
		groupByResource: true,
	},
	render: (args) => <CalendarWrapper { ...args } />,
}
