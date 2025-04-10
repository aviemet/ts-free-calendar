import dayjsLib, { Dayjs } from "dayjs"
import isBetween from "dayjs/plugin/isBetween"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import localeData from "dayjs/plugin/localeData"
import localizedFormat from "dayjs/plugin/localizedFormat"
import minMax from "dayjs/plugin/minMax"
import utc from "dayjs/plugin/utc"
import weekdayPlugin from "dayjs/plugin/weekday"

import { CalendarLocalizer, CalendarLocalizerFactory, TIME_UNIT } from "@/lib/localizers"
import { VIEW_NAMES } from "@/views"

import { defaultMessages } from "../messages"


dayjsLib.extend(localeData)
dayjsLib.extend(weekdayPlugin)
dayjsLib.extend(utc)
dayjsLib.extend(minMax)
dayjsLib.extend(localizedFormat)
dayjsLib.extend(isSameOrBefore)
dayjsLib.extend(isSameOrAfter)
dayjsLib.extend(isBetween)

interface TZ {
	(date: number | Date | string | Dayjs, timezone?: string): Dayjs
	guess(): string
}

type DayjsLib = typeof dayjsLib & {
	tz?: TZ
}

export const dayJsLocalizer: CalendarLocalizerFactory<DayjsLib> = (dayjs) => {
	/**
	 * Date Localizer Functions
	 */

	const firstVisibleDay = <T extends boolean = true>(
		date: Date,
		view: VIEW_NAMES,
		asDate: T = true as T
	): T extends true ? Date : dayjsLib.Dayjs => {
		let d: dayjsLib.Dayjs

		switch(view) {
			case "month":
				d = dayjs(date).startOf(view).startOf("week").startOf("day")
				break
			case "week":
				d = dayjs(date).startOf(view).startOf("day")
				break
			case "day":
				d = dayjs(date).startOf("day")
				break
			case "agenda":
				d = dayjs(date).startOf("day")
				break
			default:
				d = dayjs(date).startOf("day")
		}

		return (asDate ? d.toDate() : d) as T extends true ? Date : dayjsLib.Dayjs
	}

	const lastVisibleDay = <T extends boolean = true>(
		date: Date,
		view: VIEW_NAMES,
		asDate: T = true as T
	): T extends true ? Date : dayjsLib.Dayjs => {
		let d: dayjsLib.Dayjs

		switch(view) {
			case "month":
				d = dayjs(date).endOf(view).endOf("week").endOf("day")
				break
			case "week":
				d = dayjs(date).endOf(view).endOf("day")
				break
			case "day":
				d = dayjs(date).endOf("day")
				break
			case "agenda":
				d = dayjs(date).endOf("day")
				break
			default:
				d = dayjs(date).endOf("day")
		}

		return (asDate ? d.toDate() : d) as T extends true ? Date : dayjsLib.Dayjs
	}

	const visibleDays = (date: Date, view: VIEW_NAMES) => {
		let current = dayjs(firstVisibleDay(date, view, false))
		const last = dayjs(lastVisibleDay(date, view, false))
		const days = []

		while(current.isBefore(last)) {
			days.push(current.clone().toDate())
			current = current.add(1, "day")
		}

		return days
	}

	const isBefore = (date: Date, compareDate: Date) => {
		return dayjs(date).isBefore(compareDate)
	}

	const isAfter = (date: Date, compareDate: Date) => {
		return dayjs(date).isAfter(compareDate)
	}

	const isSame = (date: Date, compareDate: Date, unit: TIME_UNIT) => {
		return dayjs(date).isSame(compareDate, unit)
	}

	const add = (date: Date, amount: number, unit: TIME_UNIT) => {
		return dayjs(date).add(amount, unit).toDate()
	}

	const subtract = (date: Date, amount: number, unit: TIME_UNIT) => {
		return dayjs(date).subtract(amount, unit).toDate()
	}

	const dayOfWeek = (date: Date) => {
		return dayjs(date).weekday()
	}

	const startOf = (date: Date, unit: TIME_UNIT) => {
		return dayjs(date).startOf(unit).toDate()
	}

	const endOf = (date: Date, unit: TIME_UNIT) => {
		return dayjs(date).endOf(unit).toDate()
	}

	const dateWithinRange = (view: VIEW_NAMES, date: Date, compareDate: Date = new Date()) => {
		const timeUnit = view === "agenda" ? "day" : view
		return dayjs(date).isSame(compareDate, timeUnit)
	}

	const duration = (start: Date, end: Date, unit: dayjsLib.UnitType = "minute"): number => {
		const startDayjs = dayjs(start)
		const endDayjs = dayjs(end)
		const diff = endDayjs.diff(startDayjs, unit)
		return diff
	}

	const adjustMidnightTime = (date: Date) => {
		const d = dayjs(date)
		if(d.hour() !== 0 || d.minute() !== 0) return date

		return d.subtract(1, "millisecond").toDate()
	}

	const format = (date: Date, formatString: string) => {
		return dayjs(date).format(formatString)
	}

	/**
	 * Return an instantiated localizer object
	 */

	return new CalendarLocalizer({
		weekdays: dayjsLib.weekdays,
		firstVisibleDay: (date: Date, view: VIEW_NAMES): Date => firstVisibleDay(date, view, true),
		lastVisibleDay: (date: Date, view: VIEW_NAMES): Date => lastVisibleDay(date, view, true),
		visibleDays,
		isBefore,
		isAfter,
		isSame,
		add,
		subtract,
		format,
		messages: defaultMessages,
		dayOfWeek,
		startOf,
		endOf,
		dateWithinRange,
		duration,
		adjustMidnightTime,
	})
}
