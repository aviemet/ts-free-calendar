import React, { createContext as ReactCreateContext, useContext as ReactUseContext } from "react"

import { CalendarLocalizer } from "./lib/localizers"
import { VIEW_NAMES, NAVIGATION_ACTION } from "./views"


export interface Resource {
	id: string | number
	title: string
}

export type EventResources = Record<string, object>

export interface CalendarEvent<TEventResources extends EventResources = EventResources> {
	id: string | number
	title: string | ((event: Pick<CalendarEvent<TEventResources>, "start" | "end" | "allDay" | "resources" | "resourceId">) => string)
	start: Date
	end: Date
	allDay?: boolean
	color?: string
	resources?: TEventResources
	resourceId?: string | number
}

export type CalendarEventTitleCallback<TEventResources extends EventResources = EventResources> = (event: Pick<CalendarEvent<TEventResources>, "start" | "end" | "allDay" | "resources" | "resourceId">) => string

interface CalendarContextValue<TEventResources extends EventResources = EventResources> {
	date: Date
	events: CalendarEvent<TEventResources>[]
	localizer: CalendarLocalizer
	handleViewChange: (view: VIEW_NAMES) => void
	handleDateChange: (action: NAVIGATION_ACTION, newDate?: Date) => void
	onEventClick: (event: CalendarEvent<TEventResources>, element: HTMLElement) => void
	resourcesById: Map<string | number, Resource>
	groupByResource: boolean
}

export type CalendarContext<TEventResources extends EventResources = EventResources> = CalendarContextValue<TEventResources>

const ContextObject = ReactCreateContext<CalendarContextValue<any> | undefined>(undefined)

export const useCalendarContext = <TEventResources extends EventResources = EventResources>(): CalendarContextValue<TEventResources> => {
	const context = ReactUseContext(ContextObject)
	if(context === undefined) {
		throw new Error("useCalendarContext must be used within a CalendarProvider")
	}
	return context as CalendarContextValue<TEventResources>
}

export const CalendarProvider = <TEventResources extends EventResources>(
	props: React.PropsWithChildren<{ value: CalendarContextValue<TEventResources> }>
) => {
	return <ContextObject.Provider value={ props.value }>{ props.children }</ContextObject.Provider>
}

export { Calendar } from "./Calendar"
