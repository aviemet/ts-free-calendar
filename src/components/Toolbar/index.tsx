import { forwardRef, useMemo } from "react"

import { useCalendarContext } from "@/."
import { NAVIGATION, VIEW_NAMES, viewComponents, VIEWS } from "@/views"

interface ToolbarProps {
	views?: readonly VIEW_NAMES[]
	view: VIEW_NAMES
}

const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>((
	{
		views = Object.values(VIEWS),
		view,
	},
	ref,
) => {
	const { date, localizer, handleViewChange, handleDateChange, resourcesById } = useCalendarContext()

	const label = useMemo(() => {
		const ViewComponent = viewComponents[view]
		return ViewComponent.title(date, {
			date,
			today: new Date(),
			localizer,
			events: [],
			resourcesById,
		})
	}, [date, localizer, view, resourcesById])

	return (
		<div ref={ ref } style={ { display: "flex", justifyContent: "space-between", alignItems: "center", margin: "1rem 0" } }>

			{ /* Time navigation buttons */ }
			<div>
				<button
					onClick={ () => handleDateChange(NAVIGATION.previous) }
					style={ { marginRight: "0.5rem" } }
				>
					{ localizer.messages.navigation.previous }
				</button>

				<button
					onClick={ () => handleDateChange(NAVIGATION.today) }
					style={ { marginRight: "0.5rem" } }
				>
					{ localizer.messages.navigation.today }
				</button>

				<button
					onClick={ () => handleDateChange(NAVIGATION.next) }
				>
					{ localizer.messages.navigation.next }
				</button>
			</div>

			{ /* Title */ }
			<h2>
				{ label }
			</h2>

			{ /* Calendar view buttons */ }
			<div>
				{ views.map(name => (
					<button
						key={ name }
						onClick={ () => handleViewChange(name) }
						style={ {
							marginLeft: "0.5rem",
							fontWeight: view === name ? "bold" : "normal",
						} }
					>
						{ localizer.messages.views[name] }
					</button>
				)) }
			</div>
		</div>
	)
})

export default Toolbar
