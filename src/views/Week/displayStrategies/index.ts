import { WeekOverlapStrategy } from "./overlap"

export const weekDisplayStrategies = {
	overlap: WeekOverlapStrategy,
} as const

export type WeekStrategyType = keyof typeof weekDisplayStrategies
