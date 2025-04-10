import { EventResources } from "@/."
import { BaseViewProps, createViewComponent, NAVIGATION, VIEWS } from "@/views"


interface AgendaViewProps<TEventResources extends EventResources> extends BaseViewProps<TEventResources> {
	className?: string
	style?: React.CSSProperties
}

const AgendaViewComponent = <TEventResources extends EventResources>(props: AgendaViewProps<TEventResources>) => {
	return (
		<div>AgendaView</div>
	)
}

export const AgendaView = createViewComponent(AgendaViewComponent, {
	range: (date, { localizer }) => {
		let start = localizer.firstVisibleDay(date, VIEWS.agenda)
		let end = localizer.lastVisibleDay(date, VIEWS.agenda)
		return { start, end }
	},
	navigate: (date, action, { localizer }) => {
		switch(action) {
			case NAVIGATION.today:
				return new Date()
			case NAVIGATION.previous:
				return localizer.add(date, - 7, "day")
			case NAVIGATION.next:
				return localizer.add(date, 7, "day")
			default:
				return date
		}
	},
	title: (date, { localizer }) => localizer.format(date, localizer.messages.formats.agendaTitle),
})
