import { useEffect, useState } from "react"

import { VIEW_NAMES } from "@/views"

import { CalendarMessages, defaultMessages } from "../messages"


export { dayJsLocalizer } from "./dayJsLocalizer"

export type TIME_UNIT = "year" | "month" | "week" | "day" | "hour" | "minute" | "second"

export type CalendarLocalizerFactory<TLib extends unknown> = (lib: TLib) => CalendarLocalizer

export interface CalendarLocalizerMethods {
	weekdays: () => string[]
	firstVisibleDay: (date: Date, view: VIEW_NAMES) => Date
	lastVisibleDay: (date: Date, view: VIEW_NAMES) => Date
	visibleDays: (date: Date, view: VIEW_NAMES) => Date[]
	isBefore: (date: Date, compareDate: Date) => boolean
	isAfter: (date: Date, compareDate: Date) => boolean
	isSame: (date: Date, compareDate: Date, unit: TIME_UNIT) => boolean
	add: (date: Date, amount: number, unit: TIME_UNIT) => Date
	subtract: (date: Date, amount: number, unit: TIME_UNIT) => Date
	dayOfWeek: (date: Date) => number
	startOf: (date: Date, unit: TIME_UNIT) => Date
	endOf: (date: Date, unit: TIME_UNIT) => Date
	dateWithinRange: (view: VIEW_NAMES, date: Date, compareDate?: Date) => boolean
	/**
	 * Returns the difference between 2 events in minutes
	 */
	duration: (start: Date, end: Date) => number
	/**
	 * Subtracts 1 millisecond if the time is midnight.
	 * Ensures reading the date for an event ending at midnight returns the starting day
	 * rather than the next day, which would cause the event to flow to the next date cell
	 */
	adjustMidnightTime: (date: Date) => Date
	format: (date: Date, format: string) => string
	messages: CalendarMessages
}

export class CalendarLocalizer {
	weekdays: CalendarLocalizerMethods["weekdays"]
	firstVisibleDay: CalendarLocalizerMethods["firstVisibleDay"]
	lastVisibleDay: CalendarLocalizerMethods["lastVisibleDay"]
	visibleDays: CalendarLocalizerMethods["visibleDays"]
	isBefore: CalendarLocalizerMethods["isBefore"]
	isAfter: CalendarLocalizerMethods["isAfter"]
	isSame: CalendarLocalizerMethods["isSame"]
	add: CalendarLocalizerMethods["add"]
	subtract: CalendarLocalizerMethods["subtract"]
	dayOfWeek: CalendarLocalizerMethods["dayOfWeek"]
	startOf: CalendarLocalizerMethods["startOf"]
	endOf: CalendarLocalizerMethods["endOf"]
	dateWithinRange: CalendarLocalizerMethods["dateWithinRange"]
	duration: CalendarLocalizerMethods["duration"]
	adjustMidnightTime: CalendarLocalizerMethods["adjustMidnightTime"]
	format: CalendarLocalizerMethods["format"]
	messages: CalendarLocalizerMethods["messages"]

	constructor(fns: CalendarLocalizerMethods) {
		this.weekdays = fns.weekdays
		this.firstVisibleDay = fns.firstVisibleDay
		this.lastVisibleDay = fns.lastVisibleDay
		this.visibleDays = fns.visibleDays
		this.isBefore = fns.isBefore
		this.isAfter = fns.isAfter
		this.isSame = fns.isSame
		this.add = fns.add
		this.subtract = fns.subtract
		this.format = fns.format
		this.messages = fns.messages || defaultMessages
		this.dayOfWeek = fns.dayOfWeek
		this.startOf = fns.startOf
		this.endOf = fns.endOf
		this.dateWithinRange = fns.dateWithinRange
		this.duration = fns.duration
		this.adjustMidnightTime = fns.adjustMidnightTime
	}
}

/**
 * Lazy loads default dayjs localizer if none is provided
 */
export const useDefaultLocalizer = (localizer: CalendarLocalizer | undefined) => {
	const [localLocalizer, setLocalLocalizer] = useState<CalendarLocalizer | undefined>(localizer)

	useEffect(() => {
		if(!localLocalizer && !localizer) {
			const loadLocalizer = async() => {
				const dayjsModule = await import("dayjs")
				const { dayJsLocalizer } = await import("@/lib/localizers")
				setLocalLocalizer(dayJsLocalizer(dayjsModule.default))
			}
			loadLocalizer()
		} else if(localizer && !localLocalizer) {
			setLocalLocalizer(localizer)
		}
	}, [localizer, localLocalizer])

	return localLocalizer
}
