import { MonthSpanStrategy } from "./span"
import { MonthSplitStrategy } from "./split"
import { MonthStackStrategy } from "./stack"


export const monthDisplayStrategies = {
	split: MonthSplitStrategy,
	stack: MonthStackStrategy,
	span: MonthSpanStrategy,
} as const

export type MonthStrategyType = keyof typeof monthDisplayStrategies
