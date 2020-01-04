import React, { Component } from "react";

import Graph from "./Graph.js";
import NodeInfo from "./NodeInfo.js";
import LinkInfo from "./LinkInfo.js";

import formatDuration from "../api/durationFormater.js";

export default class Overview extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedNode: null,
			selectedLink: null
		};
		this.setSelectedNode = this.setSelectedNode.bind(this);
		this.setSelectedLink = this.setSelectedLink.bind(this);
	}

	setSelectedNode(selectedNode) {
		this.setState({
			selectedNode
		});
	}

	setSelectedLink(selectedLink) {
		this.setState({
			selectedLink
		});
	}

	render() {
		let winner = this.props.winner;
		let host = this.props.host;
		let startTime = this.props.startTime;
		let endTime = this.props.endTime;
		let startPage = this.props.startPage;
		let endPage = this.props.endPage;
		let graph = this.props.graph;

		let selected = null;
		let selectedNode = this.state.selectedNode;
		let selectedLink = this.state.selectedLink;
		if (selectedNode) {
			selected = <NodeInfo
				node={selectedNode}
				startTime={startTime}
				startPage={startPage}
				endPage={endPage} />;
		} else if (selectedLink) {
			selected = <LinkInfo
				link={selectedLink} 
				startTime={startTime} />;
		}
		return (
			<div>
				<div className="row">
					<div className="col-lg-3">
						{winner ?
							<h1>{winner} has won!</h1> :
							<h1>{host} has ended the game</h1>
						}
						<h3>
							Total time:{" "}
							{formatDuration(startTime, endTime)}
						</h3>
						<h4>From {startPage} to {endPage}</h4>
						{selected}
					</div>
					<div className="col-lg-9">
						<div>
							<Graph
								startPage={startPage}
								endPage={endPage}
								graph={graph}
								setSelectedNode={this.setSelectedNode}
								setSelectedLink={this.setSelectedLink} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}
