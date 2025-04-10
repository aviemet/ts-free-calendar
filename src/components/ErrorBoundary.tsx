import React from "react"

interface Props {
	children: React.ReactNode
}

interface State {
	hasError: boolean
}

export class ErrorBoundary extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError() {
		return { hasError: true }
	}

	componentDidCatch() {
		// Reset error state after a brief delay to allow HMR to complete
		setTimeout(() => {
			this.setState({ hasError: false })
		}, 0)
	}

	render() {
		if(this.state.hasError) {
			return null // or a loading spinner
		}

		return this.props.children
	}
}
