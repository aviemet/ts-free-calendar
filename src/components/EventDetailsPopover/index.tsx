import clsx from "clsx"
import React, { forwardRef, useEffect, useState } from "react"

import { EventResources, CalendarEvent } from "@/."
import { vars } from "@/lib"

import { DefaultPopoverContent } from "./DefaultPopoverContent"
import * as classes from "./EventDetailsPopover.css"


interface EventDetailsPopoverProps<TEventResources extends EventResources> {
	event: CalendarEvent<TEventResources>
	position: { top: number, left: number }
	children?: (event: CalendarEvent<TEventResources>) => React.ReactNode
}

function EventDetailsPopover<TEventResources extends EventResources>(
	props: EventDetailsPopoverProps<TEventResources>,
	ref: React.ForwardedRef<HTMLDivElement | null>
) {
	const { event, position, children } = props
	const [isEntering, setIsEntering] = useState(true)

	useEffect(() => {
		setIsEntering(true)
		const timer = setTimeout(() => {
			setIsEntering(false)
		}, 10)

		return () => clearTimeout(timer)
	}, [])

	const color = event.color || vars.colors.primaryColors.filled

	return (
		<div
			ref={ ref }
			className={ clsx(classes.container) }
			data-entering={ isEntering || undefined }
			style={ {
				top: `${position.top}px`,
				left: `${position.left}px`,
			} }
		>
			<div
				className={ clsx(classes.popover) }
				style={ { borderTop: `4px solid ${color}` } }
			>
				{ children ? children(event) : <DefaultPopoverContent event={ event } /> }
			</div>
		</div>
	)
}

export default forwardRef(EventDetailsPopover) as <TEventResources extends EventResources>(
	props: EventDetailsPopoverProps<TEventResources> & { ref?: React.ForwardedRef<HTMLDivElement | null> }
) => React.JSX.Element
