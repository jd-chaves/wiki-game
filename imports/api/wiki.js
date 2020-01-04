import { Meteor } from "meteor/meteor";
import { HTTP } from "meteor/http";

Meteor.methods({
	"wiki.validate"(language, startPage, endPage) {
		let startPageQuery = startPage.replace(/\s/g, "%20");
		let endPageQuery = endPage.replace(/\s/g, "%20");
		let resStartPage = HTTP.get(`https://${language}.wikipedia.org/w/api.php?action=query&format=json&titles=${startPageQuery}`);
		let startPagesObject = resStartPage.data.query.pages;
		if ("-1" in startPagesObject) {
			return {
				errorMessage: `${startPage} page does not exist.`
			};
		}
		let resEndPage = HTTP.get(`https://${language}.wikipedia.org/w/api.php?action=query&format=json&titles=${endPageQuery}`);
		let endPagesObject= resEndPage.data.query.pages;
		if ("-1" in endPagesObject) {
			return {
				errorMessage: `${endPage} page does not exist.`
			};
		}
		let startPageNumber;
		for (let pageNumber in startPagesObject) {
			startPageNumber = pageNumber;
			break;
		}
		let endPageNumber;
		for (let pageNumber in endPagesObject) {
			endPageNumber = pageNumber;
			break;
		}

		let startPageNormalized = startPagesObject[startPageNumber].title;
		let endPageNormalized = endPagesObject[endPageNumber].title;
		if (startPageNormalized === endPageNormalized) {
			return {
				errorMessage: "The start page and end page must be different."
			};
		}
		return {
			startPage: startPageNormalized,
			endPage: endPageNormalized
		};
	},
	"wiki.getLinks"(language, page) {
		let res = HTTP.get(`https://${language}.wikipedia.org/w/api.php?action=query&format=json&generator=links&gpllimit=500&titles=${page}`);
		let linksObject = res.data.query.pages;
		let links = [];
		for (let page in linksObject) {
			if (page.includes("-")) continue;
			links.push(linksObject[page].title);
		}
		return links;
	},
	"wiki.getSummary"(language, page) {
		let res = HTTP.get(`https://${language}.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=${page}`);
		let pageNumber = null;
		for (let pn in res.data.query.pages) {
			pageNumber = pn;
			break;
		}
		return res.data.query.pages[pageNumber].extract;
	}
});