import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
 
export const Games = new Mongo.Collection("games");

if (Meteor.isServer) {
	Meteor.publish("games", function(gameId) {
		return Games.find({_id: gameId});
	});
}

Meteor.methods({
	"games.create"(language) {
		if (!Meteor.user()._id) {
			throw new Meteor.Error("not-authorized");
		}

		let gameId = "" + (Games.find().count() + 1);
		let host = Meteor.user().username;
		let newGame = {
			_id: gameId,
			language,
			host,
			players: [host],
			inLobby: true,
			playing: false,
			winner: null,
			startTime: null,
			endTime: null,

			startPage: null,
			endPage: null,
			graph: {
				nodes: [],
				links: []
			}
		};
		Games.insert(newGame);
		return gameId;
	},
	"games.join"(gameId) {
		if (!Meteor.user()._id) {
			throw new Meteor.Error("not-authorized");
		}

		let game = Games.findOne(gameId);
		if (!game) {
			return {
				errorMessage: `The game with ID ${gameId} doesn't exist.`
			};
		}
		if (!game.inLobby) {
			return {
				errorMessage: "The game is not in lobby time."
			};
		}
		let players = game.players;
		let username = Meteor.user().username;
		let alreadyInGame = players.filter(p => p === username).length === 1;
		// if (alreadyInGame) {
		// 	return {
		// 		errorMessage: `You are already in the game with ID ${gameId}`
		// 	};
		// }
		if (!alreadyInGame) {
			Games.update(gameId, {$push: {players: username}});
		}
		return {ok: true};
	},
	"games.setStartEndPages"(gameId, startPage, endPage) {
		Games.update(gameId, {
			$set: {
				startPage,
				endPage
			}
		});
	},
	"games.startGame"(gameId) {
		let game = Games.findOne(gameId);
		let startPage = game.startPage;
		Games.update(gameId, {
			$set: {
				inLobby: false,
				playing: true,
				startTime: new Date()
			},
			$push: {
				"graph.nodes": {
					page: startPage
				}
			}
		});
	},
	"games.endGame"(gameId, winner) {
		Games.update(gameId, {
			$set: {
				playing: false,
				endTime: new Date(),
				winner
			}
		});
	},
	"games.navigate"(gameId, sourcePage, targetPage) {
		let game = Games.findOne(gameId);
		let startPage = game.startPage;
		let graph = game.graph;
		let nodes = graph.nodes;
		let links = graph.links;
		let node = null;
		for (let currentNode of nodes) {
			if (currentNode.page === targetPage) {
				node = currentNode;
				break;
			}
		}
		let now = new Date();
		if (node) {
			if (node.page !== startPage) {
				let discoveredByMe = node.discoveredBy === Meteor.user().username;
				let alreadyVisited = node.otherVisits
					.filter(v => v.visitedBy === Meteor.user().username)
					.length === 1;
				if (!discoveredByMe && !alreadyVisited) {	
					node.otherVisits
						.push({
							visitedBy: Meteor.user().username,
							visitedAt: now
						});
				}
			}
		} else {
			nodes.push({
				page: targetPage,
				discoveredBy: Meteor.user().username,
				discoveredAt: now,
				otherVisits: []
			});
		}

		let link = null;
		for (let currentLink of links) {
			let currentLinkSource = currentLink.source;
			let currentLinkTarget = currentLink.target;
			if (
				(currentLinkSource === sourcePage && currentLinkTarget === targetPage) ||
				(currentLinkSource === targetPage && currentLinkTarget === sourcePage)
			) {
				link = currentLink;
				break;
			}
		}
		if (!link) {
			link = {
				source: sourcePage,
				target: targetPage,
				createdBy: Meteor.user().username,
				createdAt: now,
				otherTravels: []
			};
			links.push(link);
		}
		let createdByMe = link.createdBy === Meteor.user().username;
		let alreadyTraveled = link.otherTravels
			.filter(travel => travel.traveledBy === Meteor.user().username)
			.length === 1;
		if (!createdByMe && !alreadyTraveled) {
			link.otherTravels
				.push({
					traveledBy: Meteor.user().username,
					traveledAt: now
				});
		}
		Games.update(gameId, {$set: {graph}});
	},
	"games.restart"(gameId) {
		Games.update(gameId, {$set: {
			inLobby: true,
			playing: false,
			winner: null,
			startTime: null,
			endTime: null,

			startPage: null,
			endPage: null,
			graph: {
				nodes: [],
				links: []
			}
		}});
	}
});