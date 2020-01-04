import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import JSAlert from "js-alert";

export default class Join extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gameIdInput: ""
		};
		this.handleJoin = this.handleJoin.bind(this);
		this.handleGameIdInputChange = this.handleGameIdInputChange.bind(this);
	}

	handleJoin(event) {
		event.preventDefault();
		let gameIdInput = this.state.gameIdInput;
		if (gameIdInput === "") return;
		Meteor.call("games.join",
			gameIdInput,
			(err, res) => {
				if (err) throw err;
				if (res.ok) {
					this.props.goToGame(gameIdInput);
				} else {
					JSAlert.alert(res.errorMessage, null, JSAlert.Icons.Failed);
				}
			}
		);
	}

	handleGameIdInputChange(event) {
		let gameIdInput = event.target.value;
		if (!/^\d*$/.test(gameIdInput)) return;
		this.setState({
			gameIdInput
		});
	}

	render() {
		return (
			<div className="join-rc card">
				<div className="card-body">
					<h1 className="card-title">Join a game</h1>
					<div className="card-text">
						<form onSubmit={this.handleJoin}>
							<label>
								The game ID is{" "}
								<input
									className="game-id-input"
									autoFocus
									type="text"
									value={this.state.gameIdInput}
									onChange={this.handleGameIdInputChange} />
							</label>
						</form>
					</div>
					<div>
						<em>Hit <kbd>Enter</kbd> to join</em>
					</div>
				</div>
			</div>
		);
	}
}
