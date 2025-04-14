import { join, dirname } from "path"
import { fileURLToPath } from "url"

import { type StorybookConfig } from "@storybook/react-vite"
import wyw from "@wyw-in-js/vite"

import { wywConfig } from "../vite.config"

const storybookDir = dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
	"stories": [
		"../stories/**/*.mdx",
		"../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
	],
	"addons": [
		"@storybook/addon-essentials",
		"@storybook/addon-onboarding",
		"@storybook/addon-interactions",
	],
	"framework": {
		"name": "@storybook/react-vite",
		"options": {},
	},
	viteFinal: async(config) => {
		if(config.resolve) {
			config.resolve.alias = {
				...config.resolve.alias,
				"@": join(storybookDir, "../src"),
			}
		}

		config.plugins = config.plugins || []

		if(!config.plugins.some((p: any) => p && p.name === "wyw")) {
			config.plugins.push(wyw(wywConfig))
		}

		return config
	},
}
export default config
