import { useCallback, useLayoutEffect, useState } from "react"

import { EventResources, CalendarEvent } from "@/."
import { useClickOutside } from "@/lib/hooks/useClickOutside"

interface PopoverPosition {
	top: number
	left: number
}

interface UseEventPopoverReturn<TEventResources extends EventResources> {
	popoverOpen: boolean
	selectedEvent: CalendarEvent<TEventResources> | null
	popoverPosition: PopoverPosition | null
	popoverRef: React.RefObject<HTMLDivElement | null>
	handleEventClick: (event: CalendarEvent<TEventResources>, element: HTMLElement) => void
}

const useEventPopover = <TEventResources extends EventResources>(): UseEventPopoverReturn<TEventResources> => {
	const [selectedEvent, setSelectedEvent] = useState<CalendarEvent<TEventResources> | null>(null)
	const [popoverPosition, setPopoverPosition] = useState<PopoverPosition | null>(null)
	const [clickedElement, setClickedElement] = useState<HTMLElement | null>(null)

	// Replace useDisclosure with useState
	const [opened, setOpened] = useState(false)

	// Custom close function
	const close = useCallback(() => {
		setOpened(false)
	}, [])

	// Custom open function
	const open = useCallback(() => {
		setOpened(true)
	}, [])

	// Use our custom useClickOutside hook
	const popoverRef = useClickOutside<HTMLDivElement>(close)

	const closePopover = useCallback(() => {
		close()
		setSelectedEvent(null)
		setPopoverPosition(null)
		setClickedElement(null)
	}, [close])

	const openPopover = useCallback((event: CalendarEvent<TEventResources>, position: PopoverPosition) => {
		setSelectedEvent(event)
		setPopoverPosition(position)
		open()
	}, [open])

	const handleEventClick = useCallback((event: CalendarEvent<TEventResources>, element: HTMLElement) => {
		const rect = element.getBoundingClientRect()
		const scrollTop = window.scrollY || document.documentElement.scrollTop
		const scrollLeft = window.scrollX || document.documentElement.scrollLeft

		// Check if the clicked element is inside a TimeGrid
		const isTimeGrid = element.closest('[data-calendar-view="time-grid"]') !== null

		// Default position is bottom
		let topPosition = rect.bottom + scrollTop

		if(isTimeGrid) {
			// For TimeGrid, position above the element initially
			// We don't know the popover height yet, so we use rect.top.
			// The useLayoutEffect will adjust it precisely later.
			topPosition = rect.top + scrollTop
		}

		setClickedElement(element)
		openPopover(event, {
			// Use the calculated initial top position
			top: topPosition,
			// Keep initial left calculation simple, layout effect centers it
			left: rect.left + scrollLeft,
		})
	}, [openPopover])

	// Close popover with escape key
	useLayoutEffect(() => {
		const handleEscKey = (e: KeyboardEvent) => {
			if(e.key === "Escape") {
				closePopover()
			}
		}
		document.addEventListener("keydown", handleEscKey)

		return () => {
			document.removeEventListener("keydown", handleEscKey)
		}
	}, [closePopover])

	// Adjust popover position if near viewport edges
	useLayoutEffect(() => {
		if(opened && popoverRef.current && popoverPosition && clickedElement) {
			const popoverRect = popoverRef.current.getBoundingClientRect()
			const viewportWidth = window.innerWidth
			const viewportHeight = window.innerHeight
			const scrollTop = window.scrollY || document.documentElement.scrollTop
			const scrollLeft = window.scrollX || document.documentElement.scrollLeft

			const eventRect = clickedElement.getBoundingClientRect()
			const isTimeGrid = clickedElement.closest('[data-calendar-view="time-grid"]') !== null

			// Define potential positions
			const topAlignTop = eventRect.top + scrollTop // Align popover top to event top
			const bottomAlignBottom = eventRect.bottom + scrollTop + 5 // Align popover top below event bottom (gap)
			const topAlignBottom = eventRect.top + scrollTop - popoverRect.height - 5 // Align popover bottom above event top (gap)

			let top: number

			if(isTimeGrid) {
				// Prefer top-to-top alignment for TimeGrid
				if(topAlignTop + popoverRect.height <= viewportHeight + scrollTop) {
					top = topAlignTop
				} else {
					// Fallback: position below event if top-to-top doesn't fit
					top = bottomAlignBottom
				}
			} else {
				// Prefer positioning below event for Month/Other views
				if(bottomAlignBottom + popoverRect.height <= viewportHeight + scrollTop) {
					top = bottomAlignBottom
				} else {
					// Fallback: position above event if below doesn't fit
					top = topAlignBottom
				}
			}

			// Center horizontally on the event
			let left = eventRect.left + (eventRect.width / 2) - (popoverRect.width / 2) + scrollLeft

			// Ensure horizontal bounds
			if(left < scrollLeft + 10) {
				left = scrollLeft + 10
			}
			if(left + popoverRect.width > viewportWidth + scrollLeft - 10) {
				left = viewportWidth + scrollLeft - popoverRect.width - 10
			}

			// Update position if calculated values differ from current state
			if(popoverPosition.top !== top || popoverPosition.left !== left) {
				setPopoverPosition({ top, left })
			}
		}
	}, [opened, popoverPosition, popoverRef, clickedElement])

	return {
		popoverOpen: opened,
		selectedEvent,
		popoverPosition,
		popoverRef,
		handleEventClick,
	}
}

export { useEventPopover }
export type { UseEventPopoverReturn }
