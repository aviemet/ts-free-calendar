import { useMemo } from "react"

import { EventResources, useCalendarContext } from "@/."
import { VIEW_NAMES } from "@/views"


import {
	displayStrategyFactories,
	ViewStrategyName,
	BaseDisplayStrategy,
	StrategyConfig,
	BaseDisplayProperties,
	DisplayStrategyFactories,
} from "."


export const useDisplayStrategy = <
	TEventResources extends EventResources,
	V extends keyof DisplayStrategyFactories,
	P extends BaseDisplayProperties
>(
	view: V,
	strategyName: ViewStrategyName<V>,
	viewConfig?: Partial<StrategyConfig>
) => {
	const { date, localizer, events, groupByResource } = useCalendarContext<TEventResources>()

	return useMemo(() => {
		const currentView = view
		const strategiesForView: DisplayStrategyFactories[typeof currentView] = displayStrategyFactories[currentView]

		if(!strategiesForView || !strategiesForView.hasOwnProperty(strategyName)) {
			throw new Error(`Invalid strategy factory for view="${currentView}", name="${String(strategyName)}"`)
		}

		const strategyFactory = strategiesForView[strategyName] as (config: StrategyConfig) => BaseDisplayStrategy<TEventResources, P>

		const strategyInstance = strategyFactory({
			localizer,
			...(viewConfig || {}),
		})

		return strategyInstance.groupAndFilterEvents(
			currentView as VIEW_NAMES,
			events,
			date,
			groupByResource
		)

	}, [view, strategyName, viewConfig, date, localizer, events, groupByResource])
}
