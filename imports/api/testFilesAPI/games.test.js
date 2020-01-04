import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { assert } from "meteor/practicalmeteor:chai";
import { resetDatabase } from "meteor/xolvio:cleaner";
import { Factory } from "meteor/dburles:factory";
import { sinon } from "meteor/practicalmeteor:sinon";
import { Games } from "../games.js";
import faker  from "faker";

if (Meteor.isServer) {

	describe("Games", () => {
		const name = faker.name.findName();
		let currentUser;
		let gameId;

		beforeEach(() => {
		// Stud the user
			resetDatabase();
			Factory.define("user", Meteor.users, {
				username: name,
			});
			currentUser = Factory.create("user");
			sinon.stub(Meteor, "user");
			Meteor.user.returns(currentUser);

			gameId = faker.random.number()+"";
			let host = currentUser.username;
			let newGame = {
			_id: gameId,
			language: "es",
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
		});



		afterEach(() => {
			Meteor.user.restore();
			resetDatabase();
		});


		describe("create", () => {


			it("should create a game correctly", ()=>{

	
				Meteor.call("games.create", "es");

				let game = Games.findOne({_id:"2"});
				assert.equal(game.players[0], currentUser.username);	
				assert.equal(game.language, "es");
				assert.equal(game.inLobby, true);
				assert.equal(game.host, currentUser.username);
				assert.equal(game.playing, false);
				assert.equal(game.winner, null);
				assert.equal(game.startTime, null);
				assert.equal(game.endTime, null);
				assert.equal(game.startPage, null);
				assert.equal(game.endPage, null);
				assert.equal(game.graph.nodes.length, 0);
				assert.equal(game.graph.links.length, 0);
				
			

			});
		});

		describe("join", () => {


			it("should join to party correctly", ()=>{
				const newId = gameId+1;

				let other = {
					_id: newId,
					language: "es",
					host: "juancho01002",
					players: ["juancho01002"],
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
				Games.insert(other);  





				let game = Games.findOne({_id:newId});
			
				let players = game.players;	

				let agregado = players.filter((e)=>e===currentUser.username).length; 
				assert.equal(agregado, 0);

				agregado = players.filter((e)=>e==="juancho01002").length; 
				assert.equal(agregado, 1);

				Meteor.call("games.join", newId);

	
				game = Games.findOne({_id:newId});
				players = game.players;	


				
				agregado = players.filter((e)=>e===currentUser.username).length; 
				assert.equal(agregado, 1);

				agregado = players.filter((e)=>e==="juancho01002").length;
				assert.equal(agregado, 1);

			});
		});

		describe("set  start end pages", () => {
			it("should set start and end pages correctly", ()=>{

				const start = "Slipknot";
				const end = "Apple";
				Meteor.call("games.setStartEndPages", gameId, start, end);


				let game = Games.findOne({_id:gameId});

				assert.equal(game.startPage, start);
				assert.equal(game.endPage, end);
			});
		});

		describe("start game", () => {
			it("should start game", ()=>{

				Meteor.call("games.startGame", gameId);		
				let game = Games.findOne(gameId);
				let startPage = game.startPage;

				let node_start = game.graph.nodes[0].page;

				assert.equal(node_start, startPage);
				assert.equal(game.inLobby, false);
				assert.equal(game.playing, true);
				assert.notEqual(game.startTime, null);

			});
		});

		describe("end game", () => {
			it("should end game", ()=>{

				Meteor.call("games.endGame", gameId, currentUser.username);

				let game = Games.findOne(gameId);
				let winner = game.winner;

				assert.equal(winner, currentUser.username);
				assert.equal(game.playing, false);
				assert.notEqual(game.endTime, null);

			});
		});
	});
}