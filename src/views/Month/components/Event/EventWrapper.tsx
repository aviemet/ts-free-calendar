import clsx from "clsx"
import { CSSProperties, PropsWithChildren } from "react"

import { EventResources, CalendarEvent } from "@/."
import { vars } from "@/lib"
import { getContrastingTextColor } from "@/lib/color"
import { GridDisplayProperties } from "@/lib/displayStrategies"

import * as classes from "./Event.css"

interface EventWrapperProps<TEventResources extends EventResources, P extends GridDisplayProperties = GridDisplayProperties> extends PropsWithChildren {
	style?: CSSProperties
	event: CalendarEvent<TEventResources>
	displayProperties: P
	setHoverId: React.Dispatch<React.SetStateAction<string>>
}

/**
 * EventWrapper
 * Internal only, used solely to position the event on the calendar view.
 * Event component is passed as children, which can be customized.
 */
const EventWrapper = <TEventResources extends EventResources, P extends GridDisplayProperties = GridDisplayProperties>({
	children,
	style,
	event,
	displayProperties,
	setHoverId,
}: EventWrapperProps<TEventResources, P>) => {
	const eventColor = event.color || vars.colors.primary
	const contrastingColor = getContrastingTextColor(eventColor)
	const isLight = contrastingColor === "#000000"
	const hoverColor = isLight ? `${eventColor}dd` : `${eventColor}aa`

	return (
		<div
			className={ clsx(classes.monthEventWrapper, displayProperties.className) }
			style={ {
				"--column-start": displayProperties.columnStart,
				"--column-span": displayProperties.columnSpan,
				"--event-color": eventColor,
				"--contrasting-color": contrastingColor,
				"--hover-color": hoverColor,
				...style,
			} as React.CSSProperties }
			data-event-id={ event.id }
			data-id={ event.id }
			onMouseOver={ () => setHoverId(String(event.id)) }
			onMouseOut={ () => setHoverId("") }
		>
			{ children }
		</div>
	)
}

export { EventWrapper }
