import { Meteor } from "meteor/meteor";
import { assert } from "meteor/practicalmeteor:chai";
import { shallow } from "enzyme";
import  React  from "react";
import LinkInfo from "../LinkInfo.js";

describe("LinkInfo", function () {
	it("should show an h1 and p", function (){

		const linkInfo = shallow(<LinkInfo
			startTime={new Date()}
			link={{
				source: "Apple",
				target: "Samsung",
				createdBy: "primero",
				createdAt: new Date(),
				otherTravels: [
					{
						traveledBy: "segundo",
						traveledAt: new Date()
					}
				]
			}}
			 />);
			
		assert.equal(linkInfo.find("h1").length, 2);

		assert.equal(linkInfo.find("h3").length, 3);

		assert.equal(linkInfo.find("h4").length, 1);

		assert.equal(linkInfo.find("p").length, 1);
	});
});