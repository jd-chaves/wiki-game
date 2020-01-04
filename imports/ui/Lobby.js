import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import JSAlert from "js-alert";

import Summary from "./Summary.js";

export default class Lobby extends Component {
	constructor(props) {
		super(props);
		this.state = {
			startPageInput: "",
			endPageInput: ""
		};
		this.handleStartPageInputChange = this.handleStartPageInputChange.bind(this);
		this.handleEndPageInputChange = this.handleEndPageInputChange.bind(this);
		this.handleValidate = this.handleValidate.bind(this);
		this.handleStartGame = this.handleStartGame.bind(this);
		this.handleSelectNewPages = this.handleSelectNewPages.bind(this);
	}

	handleSelectNewPages() {
		Meteor.call("games.setStartEndPages",
			this.props.gameId,
			null,
			null
		);
	}

	handleStartPageInputChange(event) {
		this.setState({
			startPageInput: event.target.value
		});
	}

	handleEndPageInputChange(event) {
		this.setState({
			endPageInput: event.target.value
		});
	}

	handleValidate() {
		let startPageInput = this.state.startPageInput.trim();
		let endPageInput = this.state.endPageInput.trim();
		if (startPageInput === "" || endPageInput === "") {
			JSAlert.alert("Both pages must be defined.", null, JSAlert.Icons.Warning);
			return;
		}
		let language = this.props.language;
		Meteor.call("wiki.validate",
			language,
			startPageInput,
			endPageInput,
			(err, res) => {
				if (res.errorMessage) {
					JSAlert.alert(res.errorMessage, null, JSAlert.Icons.Failed);
				} else {
					let gameId = this.props.gameId;
					Meteor.call("games.setStartEndPages",
						gameId,
						res.startPage,
						res.endPage
					);
					this.setState({
						startPageInput: "",
						endPageInput: ""
					});
				}
			}
		);
	}

	handleStartGame() {
		Meteor.call("games.startGame", this.props.gameId);
	}

	render() {
		let gameId = this.props.gameId;
		let players = this.props.players;
		let host = this.props.host;
		let isHost = host === Meteor.user().username;
		let startPage = this.props.startPage;
		let endPage = this.props.endPage;
		let language = this.props.language;
		let pagesValidated = startPage !== null && endPage !== null;
		let isHostDisplay = pagesValidated ?
			<div>
				<button
					className="btn btn-info"
					type="button"
					onClick={this.handleStartGame}>
					Start game
				</button>
				<button
					className="btn btn-secondary"
					type="button"
					onClick={this.handleSelectNewPages}>
					Select new pages
				</button>
			</div> :
			<div>
				<div className="from-to">
					<h2>
						Go from{" "}
						<input
							className="from-input"
							autoFocus
							placeholder="a wikipedia page"
							type="text"
							value={this.state.startPageInput}
							onChange={this.handleStartPageInputChange} />
						{" "}to{" "}
						<input
							className="to-input"
							type="text"
							placeholder="another wikipedia page"
							value={this.state.endPageInput}
							onChange={this.handleEndPageInputChange} />
					</h2>
				</div>
				<button
					className="btn btn-info"
					type="button"
					onClick={this.handleValidate}>
					Validate pages
				</button>
			</div>;
		return (
			<div className="row lobby-rc">
				<div className="col-lg-6">
					<h1>Lobby of game {gameId}</h1>
					{pagesValidated &&
						<div>
							<h2>Go from {startPage} to {endPage}</h2>
							<h5>Waiting for {isHost ? "you" : <em>{host}</em>} to start the game</h5>
						</div>
					}
					{
						isHost ? isHostDisplay :
						!pagesValidated && 
						<h3>
							<em>{host}</em> is deciding the Wikipedia pages...
						</h3>
					}
					<div className="players">
						<h2>Players:</h2>
						{
							players.map(player =>
								<div
									className="badge badge-pill badge-dark"
									key={player}>
									{player}
								</div>
							)
						}
					</div>
				</div>
				{pagesValidated &&
					<div className="col-lg-6">
						<Summary
							page={startPage}
							language={language} />
						<Summary
							page={endPage}
							language={language} />
					</div>
				}
			</div>
		);
	}
}