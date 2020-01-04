import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import JSAlert from "js-alert";

import AccountsUIWrapper from "./AccountsUIWrapper.js";

import { Games } from "../api/games.js";

class Header extends Component {
	constructor(props) {
		super(props);
		this.handleHome = this.handleHome.bind(this);
		this.handleRestart = this.handleRestart.bind(this);
		this.handleHelp = this.handleHelp.bind(this);
	}

	handleHome() {
		this.props.goToGame(null);
	}

	handleRestart() {
		Meteor.call("games.restart", this.props.gameId);
	}

	handleHelp() {
		let message = "Black nodes are the start and end pages. Nodes with the same color have been discovered by the same person. Likewise, links with the same color have been created by the same person. A dashed link indicates that the target page has been already discovered by another person, thus creating a cycle. If a node has a number on it, it indicates how many people have visited that node besides the discoverer. Hovering over the nodes and links will show information about them. Drag the nodes and links at your will.";
		JSAlert.alert(message, null, JSAlert.Icons.Information);
	}

	render() {
		return (
			<div className="header-rc row">
				<div className="col">
					<AccountsUIWrapper />
				</div>
				<div className="col text-right">
					{Meteor.user() &&
						<button
							className="btn"
							title="Home"
							type="button"
							onClick={this.handleHome}>
							<i className="fa fa-home fa-2x"></i>
						</button>
					}
					{this.props.inLobby === false && this.props.playing === false &&
						<span>
							{this.props.host === Meteor.user().username &&
								<button
									className="btn"
									title="Restart game"
									type="button"
									onClick={this.handleRestart}>
									<i className="fa fa-rotate-left fa-2x"></i>
								</button>
							}
							<button
								className="btn btn-info"
								title="Help"
								type="button"
								onClick={this.handleHelp}>
								<i className="fa fa-question fa-2x"></i>
							</button>
						</span>
					}
				</div>
			</div>
		);
	}
}

export default withTracker(props => {
	let gameId = props.gameId;
	if (!Meteor.subscribe("games", gameId).ready()) return {};
	let game = Games.findOne(gameId);
	return game ? game : {};
})(Header);