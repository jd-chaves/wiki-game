import { Meteor } from "meteor/meteor";
import { assert } from "meteor/practicalmeteor:chai";
import { shallow } from "enzyme";
import  React  from "react";
import Summary from "../Summary.js";

describe("Summary", function () {
	it("should show an h1 and p", function (){

		const summary = shallow(<Summary
			language="es"
			page="Apple" />);

		assert.equal(summary.find("h1").length, 0);
		assert.equal(summary.find("p").length, 0);
	});
});