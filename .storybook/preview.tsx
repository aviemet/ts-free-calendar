import { type Preview } from "@storybook/react"
import React from "react"

import { GlobalThemeStyles } from "../src/lib/theme/GlobalThemeStyles"

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
	decorators: [
		(Story) => (
			<>
				<GlobalThemeStyles />
				<Story />
			</>
		),
	],
}

export default preview
