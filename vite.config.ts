import path from "path"

import react from "@vitejs/plugin-react"
import wyw from "@wyw-in-js/vite"
import dts from "vite-plugin-dts"
import { defineConfig } from "vitest/config"


export const wywConfig = {
	sourceMap: process.env.NODE_ENV !== "production",
	include: ["**/*.{ts,tsx}"],
	exclude: ["**/node_modules/**"],
	babelOptions: {
		presets: ["@babel/preset-typescript", "@babel/preset-react"],
	},
}

export default defineConfig({
	plugins: [
		react(),
		wyw(wywConfig),
		dts({
			insertTypesEntry: true,
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		lib: {
			entry: path.resolve(__dirname, "src/index.tsx"),
			name: "TsFreeCalendar",
			formats: ["es", "umd", "cjs"],
			fileName: (format) => `ts-free-calendar.${format}.js`,
		},
		rollupOptions: {
			external: ["react", "react-dom"],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
				},
			},
		},
		sourcemap: true,
		emptyOutDir: true,
		cssCodeSplit: false,
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./tests/setupTests.ts",
		css: false,
	},
})
