import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import Lobby from "./Lobby.js";
import Navigator from "./Navigator.js";
import Overview from "./Overview.js";

import { Games } from "../api/games.js";

class CurrentGame extends Component {
	render() {
		if (!this.props.host) return <div></div>;
		let inLobby = this.props.inLobby;
		let playing = this.props.playing;
		let gameId = this.props.gameId;
		let host = this.props.host;
		let players = this.props.players;
		// let players = [
		// 	"juan",
		// 	"camilo",
		// 	"pinilla",
		// 	"ramirez",
		// 	"juancamilo",
		// 	"juancamilopinilla",
		// 	"juancamilopinillaramirez",
		// ];
		let language = this.props.language;
		let startPage = this.props.startPage;
		let endPage = this.props.endPage;
		let winner = this.props.winner;
		let startTime = this.props.startTime;
		let endTime = this.props.endTime;
		let graph = this.props.graph;
		if (inLobby) {
			return <Lobby
				gameId={gameId}
				players={players}
				host={host}
				language={language}
				startPage={startPage}
				endPage={endPage} />;
		}
		if (playing) {
			return <Navigator
				gameId={gameId}
				language={language}
				startPage={startPage}
				endPage={endPage}
				host={host} />;
		} else {
			return <Overview
				winner={winner}
				startPage={startPage}
				endPage={endPage}
				startTime={startTime}
				endTime={endTime}
				host={host}
				graph={graph} />;
		}
	}
}

export default withTracker(props => {
	let gameId = props.gameId;
	if (!Meteor.subscribe("games", gameId).ready()) return {};
	let game = Games.findOne(gameId);
	return game;
})(CurrentGame);