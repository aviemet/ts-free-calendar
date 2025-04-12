import clsx from "clsx"
import { HTMLAttributes } from "react"

import { useCalendarContext, EventResources, CalendarEvent } from "@/."
import { Event, EventProps } from "@/components/Event"
import { BaseDisplayProperties } from "@/lib/displayStrategies"
import { CalendarLocalizer } from "@/lib/localizers"

import * as classes from "./Event.css"

const MonthEvent = <TEventResources extends EventResources>({
	className,
	...props
}: EventProps<TEventResources>) => {
	return (
		<Event
			className={ clsx(classes.monthEvent, className) }
			{ ...props }
		/>
	)
}

export { MonthEvent }
