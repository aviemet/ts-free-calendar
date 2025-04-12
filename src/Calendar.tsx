import clsx from "clsx"
import { useMemo, useState, useCallback, useRef, useLayoutEffect } from "react"

import * as classes from "./Calendar.css"
import { ErrorBoundary } from "./components/ErrorBoundary"
import EventDetailsPopover from "./components/EventDetailsPopover"
import { useEventPopover } from "./components/EventDetailsPopover/useEventPopover"
import Overlay from "./components/Overlay"
import Toolbar from "./components/Toolbar"
import { StrategyNameMap } from "./lib/displayStrategies"
import { CalendarLocalizer, useDefaultLocalizer } from "./lib/localizers"
import { viewComponents, VIEWS, VIEW_NAMES, NAVIGATION_ACTION } from "./views"

import { CalendarProvider, CalendarContext, EventResources, CalendarEvent, Resource } from "."

interface CalendarProps<TEventResources extends EventResources = EventResources> {
	defaultDate?: Date
	defaultView?: VIEW_NAMES
	events: CalendarEvent<TEventResources>[]
	localizer?: CalendarLocalizer
	views?: readonly VIEW_NAMES[]
	displayStrategies?: Partial<StrategyNameMap>
	onNavigate?: (newDate: Date, action: NAVIGATION_ACTION, view: VIEW_NAMES) => void
	onViewChange?: (view: VIEW_NAMES) => void
	eventPopoverContent?: (event: CalendarEvent<TEventResources>, localizer: CalendarLocalizer) => React.ReactNode
	onSelectSlot?: (date: Date) => void
	resources?: Resource[]
	groupByResource?: boolean
	maxEvents?: number
}

const Calendar = <TEventResources extends EventResources>({
	defaultDate,
	defaultView = VIEWS.month,
	events,
	localizer,
	views = Object.values(VIEWS),
	displayStrategies = {},
	onNavigate,
	onViewChange,
	eventPopoverContent,
	onSelectSlot,
	resources = [],
	groupByResource = false,
	maxEvents = 4,
}: CalendarProps<TEventResources>) => {
	const localLocalizer = useDefaultLocalizer(localizer)

	const [date, setDate] = useState<Date>(defaultDate || new Date())
	const [currentView, setCurrentView] = useState<VIEW_NAMES>(defaultView)

	const localDisplayStrategies = useMemo(() => Object.assign({
		month: "stack",
		week: "overlap",
		day: "overlap",
		agenda: "overlap",
	}, displayStrategies), [displayStrategies])

	const resourcesById = useMemo(() => {
		const map = new Map<string | number, Resource>()
		if(process.env.NODE_ENV !== "production") {
			const uniqueIds = new Set<string | number>()
			const duplicateIds = new Set<string | number>()
			for(const resource of resources) {
				if(uniqueIds.has(resource.id)) {
					duplicateIds.add(resource.id)
				} else {
					uniqueIds.add(resource.id)
				}
			}
			if(duplicateIds.size > 0) {
				// eslint-disable-next-line no-console
				console.warn(
					`[CalendarComponent] Duplicate resource IDs found: ${Array.from(duplicateIds).join(", ")}. Ensure IDs are unique.`
				)
			}
		}
		for(const resource of resources) {
			map.set(resource.id, resource)
		}
		return map
	}, [resources])

	const {
		popoverOpen,
		selectedEvent,
		popoverPosition,
		popoverRef,
		handleEventClick,
	} = useEventPopover<TEventResources>()

	const toolbarRef = useRef<HTMLDivElement>(null)

	const [minHeight, setMinHeight] = useState("100%")
	useLayoutEffect(() => {
		if(!toolbarRef.current) return

		const { height } = toolbarRef.current.getBoundingClientRect()
		setMinHeight(`calc(100% - ${height}px)`)
	}, [])

	const ViewComponent = useMemo(() => viewComponents[currentView], [currentView])

	const handleViewChange = useCallback((view: VIEW_NAMES) => {
		setCurrentView(view)
		onViewChange?.(view)
	}, [onViewChange])

	const handleDateChange = useCallback((action: NAVIGATION_ACTION, newDate?: Date) => {
		if(!localLocalizer) return undefined

		const nextDate = (ViewComponent as any).navigate(
			newDate || date,
			action,
			{
				date: date,
				today: new Date(),
				localizer: localLocalizer,
				events: events,
				resourcesById: resourcesById,
			}
		)

		setDate(nextDate)

		onNavigate?.(nextDate, action, currentView)

		return nextDate
	}, [ViewComponent, date, events, localLocalizer, onNavigate, currentView, resourcesById])

	const handleSelectSlot = useCallback((date: Date) => {
		onSelectSlot?.(date)
	}, [onSelectSlot])

	const calendarProviderState = useMemo<CalendarContext<TEventResources>>(() => ({
		date,
		events,
		localizer: localLocalizer as CalendarLocalizer,
		handleViewChange,
		handleDateChange,
		onEventClick: handleEventClick,
		resourcesById,
		groupByResource,
		maxEvents,
	}), [
		date,
		events,
		localLocalizer,
		handleViewChange,
		handleDateChange,
		handleEventClick,
		resourcesById,
		groupByResource,
		maxEvents,
	])

	if(!localLocalizer) return <></>

	return (
		<div className={ clsx(classes.calendarOuterContainer) } style={ { minHeight } }>
			<ErrorBoundary>
				<CalendarProvider<TEventResources> value={ calendarProviderState }>
					<Toolbar ref={ toolbarRef } views={ views } view={ currentView } />

					<div className={ clsx(classes.calendar) }>
						<div className={ clsx(classes.calendarInnerContainer) }>
							<ErrorBoundary>
								<ViewComponent displayStrategy={ localDisplayStrategies[currentView] } onSelectSlot={ handleSelectSlot }/>
							</ErrorBoundary>
						</div>

						{ /* Overlay - Rendered when popover is open */ }
						{ popoverOpen && <Overlay /> }
					</div>


					{ /* Event Details Popover */ }
					{ popoverOpen && selectedEvent && popoverPosition && localLocalizer && (
						<EventDetailsPopover<TEventResources>
							ref={ popoverRef }
							event={ selectedEvent }
							position={ popoverPosition }
						>
							{ eventPopoverContent && ((event) => eventPopoverContent(event, localLocalizer)) }
						</EventDetailsPopover>
					) }

				</CalendarProvider>
			</ErrorBoundary>
		</div>
	)
}

export { Calendar }
