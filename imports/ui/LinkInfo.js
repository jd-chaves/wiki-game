import React, { Component } from "react";

import formatDuration from "../api/durationFormater.js";

export default class LinkInfo extends Component {
	render() {
		let startTime = this.props.startTime;
		let link = this.props.link;
		let source = link.source;
		let target = link.target;
		let createdBy = link.createdBy;
		let createdAt = link.createdAt;
		let otherTravels = link.otherTravels;
		if (otherTravels) {
			otherTravels.sort((travel1, travel2) => 
				travel1.traveledAt.getTime()-travel2.traveledAt.getTime());
		}
		return (
			<div className="link-info-rc">
				<h1>Link from</h1>
				<h3>{source}</h3>
				<h1>to</h1>
				<h3>{target}</h3>
				<h3 className="created-by">Created by {createdBy} after {formatDuration(startTime, createdAt)}</h3>
				{otherTravels && otherTravels.length !== 0 &&
					<div>
						<h4>Others that used the same link:</h4>
						{
							otherTravels.map(travel => 
								<p
									key={createdAt}
									className="other-travels">
									<em>{travel.traveledBy}</em> after {formatDuration(startTime, travel.traveledAt)}
								</p>
							)
						}
					</div>
				}
			</div>
		);
	}
}
