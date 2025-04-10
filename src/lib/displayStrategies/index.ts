import { VIEW_NAMES } from "@/views"
import { DayOverlapStrategy } from "@/views/Day/displayStrategies/overlap"
import { MonthSpanStrategy } from "@/views/Month/displayStrategies/span"
import { MonthSplitStrategy } from "@/views/Month/displayStrategies/split"
import { MonthStackStrategy } from "@/views/Month/displayStrategies/stack"
import { WeekOverlapStrategy } from "@/views/Week/displayStrategies/overlap"

import { StrategyConfig } from "./BaseDisplayStrategy"

export * from "./types"
export * from "./BaseDisplayStrategy"
export * from "./useDisplayStrategy"

export const displayStrategyFactories = {
	month: {
		split: (config: StrategyConfig) => new MonthSplitStrategy(config),
		stack: (config: StrategyConfig) => new MonthStackStrategy(config),
		span: (config: StrategyConfig) => new MonthSpanStrategy(config),
	},
	week: {
		overlap: (config: StrategyConfig) => new WeekOverlapStrategy(config),
	},
	day: {
		overlap: (config: StrategyConfig) => new DayOverlapStrategy(config),
	},
	agenda: {
		// overlap: (config: StrategyConfig) => new AgendaOverlapStrategy(config),
	},
} as const

export type DisplayStrategyFactories = typeof displayStrategyFactories
export type ViewStrategyName<V extends keyof DisplayStrategyFactories> = keyof DisplayStrategyFactories[V]

export type AllViewStrategyNames = {
	[V in keyof DisplayStrategyFactories]: ViewStrategyName<V>
}[keyof DisplayStrategyFactories];

export type StrategyNameMap = {
	[V in VIEW_NAMES]: V extends keyof DisplayStrategyFactories ? ViewStrategyName<V> : never
}
