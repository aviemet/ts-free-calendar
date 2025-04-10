import clsx from "clsx"

import { useCalendarContext, EventResources, CalendarEvent } from "@/."
import { vars } from "@/lib"

import * as classes from "./EventDetailsPopover.css"

interface DefaultPopoverContentProps<TEventResources extends EventResources> {
	event: CalendarEvent<TEventResources>
}

const DefaultPopoverContent = <TEventResources extends EventResources>({ event }: DefaultPopoverContentProps<TEventResources>) => {
	const { localizer } = useCalendarContext<TEventResources>()
	const color = event.color || vars.colors.primaryColors.filled

	return (
		<div className={ clsx(classes.popover) }>
			<div>
				<div>
					<div
						style={ { backgroundColor: color } }
					/>
					<h4>
						{ typeof event.title === "function"
							? event.title({ start: event.start, end: event.end, allDay: event.allDay, resources: event.resources })
							: event.title
						}
					</h4>
				</div>
			</div>

			<p>
				<strong>Start:</strong> { localizer.format(event.start, "M/D h:mma") }
			</p>

			<p>
				<strong>End:</strong> { localizer.format(event.end, "M/D h:mma") }
			</p>

			{ event.allDay
				? <p>All day event</p>
				: <p>
					<strong>Hours:</strong> { Math.round(localizer.duration(event.start, event.end) / 60) }
				</p>
			}
		</div>
	)
}

export { DefaultPopoverContent }
