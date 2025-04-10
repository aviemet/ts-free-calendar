import { ElementProps } from "@mantine/core"
import clsx from "clsx"

import { useCalendarContext, EventResources, CalendarEvent } from "@/."
import { BaseDisplayProperties } from "@/lib/displayStrategies"
import { CalendarLocalizer } from "@/lib/localizers"

import * as classes from "./Event.css"

import { Box, BoxProps } from "@/Components"

interface Event<TEventResources extends EventResources> extends
	BoxProps, Omit<ElementProps<"div", keyof BoxProps>, "onClick"> {
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
}: Event<TEventResources>) => {
	const { onEventClick } = useCalendarContext<TEventResources>()

	const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if(onClick) {
			onClick(event, e.currentTarget)
		} else if(onEventClick) {
			onEventClick(event, e.currentTarget)
		}
	}

	return (
		<Box
			className={ clsx(classes.event, className) }
			onClick={ handleClick }
		>
			<Box component="span">{ children }</Box>
		</Box>
	)
}

export { Event }
