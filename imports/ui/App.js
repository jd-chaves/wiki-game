import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import CreateJoin from "./CreateJoin.js";
import CurrentGame from "./CurrentGame.js";
import Header from "./Header.js";
import Overview from "./Overview.js";
import Sketch from "./Sketch.js";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gameId: null
		};
		this.goToGame = this.goToGame.bind(this);
	}

	goToGame(gameId) {
		this.setState({
			gameId
		});
	}

	render() {
		let gameId = this.state.gameId;
		let currentUser = this.props.currentUser;
		return (
			<div className="container-fluid">
				<Header
					gameId={gameId}
					goToGame={this.goToGame}/>
				{currentUser ?
					(gameId ?
						<CurrentGame gameId={gameId} />:
						<CreateJoin goToGame={this.goToGame} />) :
					<Sketch />
				}
			</div>
		);
		/*
		let winner = "b";
		let host = "h";
		let startTime = new Date();
		let baseTime = startTime.getTime();
		let steps = 18;
		let dates = [startTime];
		for (let i = 1; i <= steps; i++) {
			dates.push(new Date(baseTime + i * 10000));
		}
		let endTime = dates[steps];

		let startPage = "1";
		let endPage = "16";

		let graph = {
			nodes: [
				{page: "1"},
				{page: "2", discoveredBy: "h", discoveredAt: dates[2], otherVisits: []},
				{page: "3", discoveredBy: "c", discoveredAt: dates[1], otherVisits: []},
				{page: "4", discoveredBy: "b", discoveredAt: dates[4], otherVisits: []},
				{page: "5", discoveredBy: "a", discoveredAt: dates[6], otherVisits: []},
				{page: "6", discoveredBy: "b", discoveredAt: dates[5], otherVisits: []},
				{page: "7", discoveredBy: "b", discoveredAt: dates[7], otherVisits: []},
				{page: "8", discoveredBy: "b", discoveredAt: dates[11], otherVisits: []},
				{page: "9", discoveredBy: "a", discoveredAt: dates[14], otherVisits: []},
				{page: "10", discoveredBy: "a", discoveredAt: dates[10], otherVisits: []},
				{page: "11", discoveredBy: "a", discoveredAt: dates[16], otherVisits: []},
				{page: "12", discoveredBy: "a", discoveredAt: dates[13], otherVisits: [{visitedBy: "b", visitedAt: dates[15]}]},
				{page: "13", discoveredBy: "h", discoveredAt: dates[8], otherVisits: []},
				{page: "14", discoveredBy: "c", discoveredAt: dates[9], otherVisits: [{visitedBy: "b", visitedAt: dates[17]},{visitedBy: "h", visitedAt: dates[12]}]},
				{page: "15", discoveredBy: "c", discoveredAt: dates[3], otherVisits: []},
				{page: "16", discoveredBy: "b", discoveredAt: dates[18], otherVisits: []},
			],
			links: [
				{
					source: "1",
					target: "3",
					createdBy: "c",
					createdAt: dates[1],
					otherTravels: []
				},
				{
					source: "1",
					target: "2",
					createdBy: "h",
					createdAt: dates[2],
					otherTravels: []
				},
				{
					source: "3",
					target: "15",
					createdBy: "c",
					createdAt: dates[3],
					otherTravels: []
				},
				{
					source: "1",
					target: "4",
					createdBy: "b",
					createdAt: dates[4],
					otherTravels: []
				},
				{
					source: "4",
					target: "6",
					createdBy: "b",
					createdAt: dates[5],
					otherTravels: []
				},
				{
					source: "1",
					target: "5",
					createdBy: "a",
					createdAt: dates[6],
					otherTravels: []
				},
				{
					source: "4",
					target: "7",
					createdBy: "b",
					createdAt: dates[7],
					otherTravels: []
				},
				{
					source: "2",
					target: "13",
					createdBy: "h",
					createdAt: dates[8],
					otherTravels: []
				},
				{
					source: "15",
					target: "14",
					createdBy: "c",
					createdAt: dates[9],
					otherTravels: []
				},
				{
					source: "5",
					target: "10",
					createdBy: "a",
					createdAt: dates[10],
					otherTravels: []
				},
				{
					source: "6",
					target: "8",
					createdBy: "b",
					createdAt: dates[11],
					otherTravels: []
				},
				{
					source: "2",
					target: "14",
					createdBy: "h",
					createdAt: dates[12],
					otherTravels: []
				},
				{
					source: "10",
					target: "12",
					createdBy: "a",
					createdAt: dates[13],
					otherTravels: []
				},
				{
					source: "5",
					target: "9",
					createdBy: "a",
					createdAt: dates[14],
					otherTravels: []
				},
				{
					source: "8",
					target: "12",
					createdBy: "b",
					createdAt: dates[15],
					otherTravels: []
				},
				{
					source: "5",
					target: "11",
					createdBy: "a",
					createdAt: dates[16],
					otherTravels: []
				},
				{
					source: "4",
					target: "14",
					createdBy: "b",
					createdAt: dates[17],
					otherTravels: []
				},
				{
					source: "12",
					target: "16",
					createdBy: "b",
					createdAt: dates[18],
					otherTravels: []
				},
			]
		};
		

		return (
			<Overview 
				winner={winner}
				host={host}
				startTime={startTime}
				endTime={endTime}
				startPage={startPage}
				endPage={endPage}
				graph={graph} />
		);
		*/
	}
}

export default withTracker(() => {
	return {
		currentUser: Meteor.user()
	};
})(App);