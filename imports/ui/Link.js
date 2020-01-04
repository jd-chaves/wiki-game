import React, { Component } from "react";

export default class Link extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.props.goToPage(this.props.page);
	}

	render() {
		let page = this.props.page;
		return (
			<button
				className="btn btn-outline-secondary"
				type="button"
				onClick={this.handleClick}>
				<strong>{page}</strong>
			</button>
		);
	}
}
