import { CalendarEvent, Resource, EventResources } from "@/."
import { CalendarLocalizer } from "@/lib/localizers"


import { AgendaView } from "./Agenda"
import { DayView } from "./Day"
import { MonthView } from "./Month"
import { WeekView } from "./Week"
import { AllViewStrategyNames } from "../lib/displayStrategies"


export const VIEWS = {
	month: "month",
	week: "week",
	day: "day",
	agenda: "agenda",
} as const
export type VIEW_NAMES = keyof typeof VIEWS

export const NAVIGATION = {
	previous: "previous",
	today: "today",
	next: "next",
	date: "date",
} as const
export type NAVIGATION_ACTION = keyof typeof NAVIGATION

// eslint-disable-next-line no-unused-vars
export interface BaseViewProps<TEventResources extends EventResources = EventResources> {
	className?: string
	style?: React.CSSProperties
	displayStrategy: AllViewStrategyNames
	onSelectSlot?: (date: Date) => void
}

export type DateRange = { start: Date, end: Date }

export interface ViewStaticMethodProps<TEventResources extends EventResources = EventResources> {
	date: Date
	today: Date
	localizer: CalendarLocalizer
	events: CalendarEvent<TEventResources>[]
	resourcesById: Map<string | number, Resource>
}

export type ViewComponent<TEventResources extends EventResources, Props extends BaseViewProps<TEventResources> = BaseViewProps<TEventResources>> = React.ComponentType<Props> & {
	range: (date: Date, props: ViewStaticMethodProps<TEventResources>) => DateRange
	navigate: (date: Date, action: NAVIGATION_ACTION, props: ViewStaticMethodProps<TEventResources>) => Date
	title: (date: Date, props: ViewStaticMethodProps<TEventResources>) => string
}

export function validateViewComponent<TEventResources extends EventResources, Props extends BaseViewProps<TEventResources>>(
	component: ViewComponent<TEventResources, Props>
) {
	if(typeof component.range !== "function")
		throw new Error("View component must implement static range method")
	if(typeof component.navigate !== "function")
		throw new Error("View component must implement static navigate method")
	if(typeof component.title !== "function")
		throw new Error("View component must implement static title method")
}

export function createViewComponent<TEventResources extends EventResources, Props extends BaseViewProps<TEventResources> = BaseViewProps<TEventResources>>(
	component: React.ComponentType<Props>,
	staticProps: {
		range: (date: Date, props: ViewStaticMethodProps<TEventResources>) => DateRange
		navigate: (date: Date, action: NAVIGATION_ACTION, props: ViewStaticMethodProps<TEventResources>) => Date
		title: (date: Date, props: ViewStaticMethodProps<TEventResources>) => string
	}
): ViewComponent<TEventResources, Props> {
	const viewComponent = component as ViewComponent<TEventResources, Props>
	viewComponent.range = staticProps.range
	viewComponent.navigate = staticProps.navigate
	viewComponent.title = staticProps.title

	validateViewComponent(viewComponent)

	return viewComponent
}

export const viewComponents = {
	[VIEWS.month]: MonthView,
	[VIEWS.week]: WeekView,
	[VIEWS.day]: DayView,
	[VIEWS.agenda]: AgendaView,
} as const
