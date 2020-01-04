import React, { Component } from "react";

import { Meteor } from "meteor/meteor";

export default class Summary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			summary: null
		};
	}
	componentDidMount() {
		this.update();
	}

	componentDidUpdate(prevProps) {
		if (this.props !== prevProps) {
			this.update();
		}
	}

	update() {
		Meteor.call(
			"wiki.getSummary",
			this.props.language,
			this.props.page,
			(err, summary) => {
				this.setState({
					summary
				});
			});
	}

	render() {
		let summary = this.state.summary;
		if (!summary) return null;
		let page = this.props.page;
		return (
			<div>
				<h1>{page}</h1>
				<p className="text-justify">{summary}</p>
			</div>
		);
	}
}
