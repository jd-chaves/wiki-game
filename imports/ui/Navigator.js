import React, { Component } from "react";
import { Meteor } from "meteor/meteor";

import Link from "./Link.js";

export default class Navigator extends Component {
	constructor(props) {
		super(props);
		this.goToPage = this.goToPage.bind(this);
		this.state = {
			stack: [],
			links: null,
			filter: ""
		};
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.handleEndGameByHost = this.handleEndGameByHost.bind(this);
		this.handleFilterChange = this.handleFilterChange.bind(this);

		this.backKey = "Shift";
	}

	handleFilterChange(event) {
		this.setState({
			filter: event.target.value
		});
	}

	componentDidMount() {
		document.addEventListener("keydown", this.handleKeyPress);
		this.goToPage(this.props.startPage);
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this.handleKeyPress);
	}

	handleKeyPress(event) {
		if (event.key === this.backKey) {
			this.goBack();
		}
	}

	goToPage(page) {
		let stack = this.state.stack;
		if (stack.length !== 0) {
			let currentPage = stack[stack.length-1];
			let gameId = this.props.gameId;
			Meteor.call("games.navigate", gameId, currentPage, page);
		}
		if (page === this.props.endPage) {
			this.endGame(Meteor.user().username);
			return;
		}
		Meteor.call(
			"wiki.getLinks",
			this.props.language,
			page,
			(err, links) => {
				this.setState(state => {
					let stack = state.stack;
					stack.push(page);
					return {
						stack,
						links,
						filter: ""
					};
				});
			}
		);
	}

	goBack() {
		let stack = this.state.stack;
		if (stack.length === 1) return;
		Meteor.call(
			"wiki.getLinks",
			this.props.language,
			stack[stack.length-2],
			(err, links) => {
				this.setState(state => {
					let newStack = state.stack;
					newStack.pop();
					return {
						stack: newStack,
						links,
						filter: ""
					};
				});
			}
		);
	}

	handleEndGameByHost() {
		this.endGame(null);
	}

	endGame(winner) {
		Meteor.call("games.endGame", this.props.gameId, winner);
	}

	render() {
		let startPage = this.props.startPage;
		let endPage = this.props.endPage;
		let stack = this.state.stack;
		let currentPage = stack[stack.length-1];
		let host = this.props.host;
		let isHost = host === Meteor.user().username;
		let links = this.state.links;
		let filter = this.state.filter;
		if (this.filterInput) {
			this.filterInput.focus();
		}
		if (links) {
			if (filter) {
				links = links
				.filter(link => link.toLowerCase()
					.includes(filter.toLowerCase()));
			}
		}
		return (
			<div className="navigator-rc">
				<div className="row">
					<div className="col-lg-4">
						<h3>Go from {startPage} to {endPage}</h3>
						<p><em>Press <kbd>{this.backKey}</kbd> to go back on history</em></p>
					</div>
					<div className="col-lg-4 text-center">
						<h1>{currentPage}</h1>
					</div>
					<div className="col-lg-4 text-right">
						<h1>Navigator</h1>
						{isHost &&
							<button
								className="btn btn-secondary"
								type="button"
								onClick={this.handleEndGameByHost}>
								End game
							</button>
						}
					</div>
				</div>
				{links &&
					<div className="current-page-links">
						<h2>Links for this page:</h2>
						<div>
							<div className="text-center">
								<input
									ref={input => this.filterInput = input}
									value={filter}
									placeholder="Filter"
									onChange={this.handleFilterChange}
									autoFocus
									type="text"/>
							</div>
						</div>
						<div className="text-center">
							{
								links.map(link =>
									<Link
										key={link}
										goToPage={this.goToPage}
										page={link} />
								)
							}
						</div>
					</div>
				}
			</div>
		);
	}
}
