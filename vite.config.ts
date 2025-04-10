import path from "path"

import linaria from "@linaria/vite"
import react from "@vitejs/plugin-react"
import dts from "vite-plugin-dts"
import { defineConfig } from "vitest/config"

export default defineConfig({
	plugins: [
		react(),
		linaria({
			sourceMap: process.env.NODE_ENV !== "production",
			include: ["**/*.{ts,tsx}"],
			exclude: ["**/node_modules/**"],
			babelOptions: {
				presets: ["@babel/preset-typescript", "@babel/preset-react"],
			},
		}),
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
