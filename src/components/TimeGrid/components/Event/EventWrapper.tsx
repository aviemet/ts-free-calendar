import clsx from "clsx"

import { EventResources, CalendarEvent } from "@/."
import { TimeGridDisplayProperties } from "@/lib/displayStrategies/types"

import * as classes from "./Event.css"


interface EventWrapperProps<TEventResources extends EventResources, P extends TimeGridDisplayProperties = TimeGridDisplayProperties> {
	event: CalendarEvent<TEventResources>
	children: React.ReactNode
	style?: React.CSSProperties
	displayProperties: P
}

const EventWrapper = <TEventResources extends EventResources, P extends TimeGridDisplayProperties = TimeGridDisplayProperties>({
	children,
	style,
	displayProperties,
}: EventWrapperProps<TEventResources, P>) => {
	return (
		<div
			className={ clsx(classes.eventWrapper) }
			style={ {
				"--column-start": displayProperties.columnStart,
				"--grid-row-start": displayProperties.rowStart,
				"--grid-row-end": displayProperties.rowEnd,
				...style,
			} as React.CSSProperties }
		>
			{ children }
		</div>
	)
}

export { EventWrapper }
