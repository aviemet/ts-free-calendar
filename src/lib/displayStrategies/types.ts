import { EventResources, CalendarEvent } from "@/."

export interface BaseDisplayProperties {
	displayStart: Date
	displayEnd: Date
	className?: string
	allDay?: boolean
}

export interface GridDisplayProperties extends BaseDisplayProperties {
	columnStart: number
	columnSpan: number
}

export interface TimeGridDisplayProperties extends GridDisplayProperties {
	rowStart: number
	rowEnd: number
}

export interface AgendaDisplayProperties extends BaseDisplayProperties {

}

export type CompareFunction<TEventResources extends EventResources, P extends BaseDisplayProperties> = (
	a: EventDisplayDetails<TEventResources, P>,
	b: EventDisplayDetails<TEventResources, P>
) => number


export interface EventDisplayDetails<
	TEventResources extends EventResources,
	P extends BaseDisplayProperties
> {
	event: CalendarEvent<TEventResources>
	displayProperties: P
	compare: CompareFunction<TEventResources, P>
}
