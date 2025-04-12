import clsx from "clsx"
import { HTMLAttributes } from "react"

import { useCalendarContext, EventResources, CalendarEvent } from "@/."
import { BaseDisplayProperties } from "@/lib/displayStrategies"
import { CalendarLocalizer } from "@/lib/localizers"

import * as classes from "./Event.css"

export interface EventProps<TEventResources extends EventResources> extends
	Omit<HTMLAttributes<HTMLDivElement>, "onClick"> {
	event: CalendarEvent<TEventResources>
	onClick?: (event: CalendarEvent<TEventResources>, element: HTMLElement) => void
	localizer: CalendarLocalizer
	displayProperties: BaseDisplayProperties
}

const Event = <TEventResources extends EventResources>({
	children,
	className,
	event,
	onClick,
	displayProperties,
	...props
}: EventProps<TEventResources>) => {
	const { onEventClick } = useCalendarContext<TEventResources>()

	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if(onClick) {
			onClick(event, e.currentTarget)
		} else if(onEventClick) {
			onEventClick(event, e.currentTarget)
		}
	}

	return (
		<div
			className={ clsx(classes.event, className) }
			onClick={ handleClick }
			{ ...props }
		>
			<span>{ children }</span>
		</div>
	)
}

export { Event }
