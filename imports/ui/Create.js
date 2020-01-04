import React, { Component } from "react";
import { Meteor } from "meteor/meteor";

export default class Create extends Component {
	constructor(props) {
		super(props);
		this.state = {
			language: "es"
		};
		this.handleLanguageChange = this.handleLanguageChange.bind(this);
		this.handleCreate = this.handleCreate.bind(this);
	}

	handleLanguageChange(event) {
		this.setState({
			language: event.target.value
		});
	}

	handleCreate() {
		Meteor.call("games.create",
			this.state.language, 
			(err, gameId) => {
				if (err) throw err;
				this.props.goToGame(gameId);
			}
		);
	}

	render() {
		return (
			<div className="create-rc card">
				<div className="card-body">
					<h1 className="card-title">Create a game</h1>
					<div className="card-text">
						<label>
							<span className="language-label">I want to play in</span>
							<select
								value={this.state.language}
								onChange={this.handleLanguageChange}>
								<option value="es">Spanish</option>
								<option value="en">English</option>
								<option value="fr">French</option>
								<option value="it">Italian</option>
								<option value="de">German</option>
							</select>
						</label>
					</div>
					<br/>
					<button
						className="btn btn-info"
						title="Create game"
						type="button"
						onClick={this.handleCreate}>
						<i className="fa fa-group fa-2x"></i>
					</button>
				</div>
			</div>
		);
	}
}
