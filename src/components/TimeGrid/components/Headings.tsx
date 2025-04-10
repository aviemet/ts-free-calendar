import { TimeGridHeading } from ".."
import * as classes from "../TimeGrid.css"

interface HeadingsProps {
	columnHeadings: TimeGridHeading[]
}

const Headings = ({ columnHeadings }: HeadingsProps) => {
	return (
		<div className={ classes.headerArea }>
			<div className={ classes.columnHeadings }>
				{ columnHeadings.map((heading, index) => (
					<div key={ index } className={ classes.columnHeading }>
						{ heading.label }
					</div>
				)) }
			</div>
		</div>
	)
}

export default Headings
