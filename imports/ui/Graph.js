import React, { Component } from "react";

import * as d3 from "d3";
import contrast from "contrast";

export default class Graph extends Component {
	constructor(props) {
		super(props);
		this.tick = this.tick.bind(this);
		this.drawNode = this.drawNode.bind(this);
		this.drawLink = this.drawLink.bind(this);
		this.dragStarted = this.dragStarted.bind(this);
		this.dragged = this.dragged.bind(this);
		this.dragEnded = this.dragEnded.bind(this);

		this.handleMouseOverCircle = this.handleMouseOverCircle.bind(this);
		this.handleMouseOutCircle = this.handleMouseOutCircle.bind(this);
		this.handleMouseOverLine = this.handleMouseOverLine.bind(this);
		this.handleMouseOutLine = this.handleMouseOutLine.bind(this);
	}

	componentDidMount() {
		this.svg = d3.select("#graph");
		let widthWithPx = d3.select(this.svg.node().parentNode)
			.style("width");

		this.width = +widthWithPx.slice(0, widthWithPx.length-2);
		this.height = 700;
		this.svg
			.style("border", "2px dotted black")
			.attr("width", this.width)
			.attr("height", this.height);

		this.width = +this.svg.attr("width");
		this.height = +this.svg.attr("height");

		this.dashArray = "6,1";
		this.initialCenterX = this.width / 2;
		this.initialCenterY = this.height / 3;
		this.circleGrowthFactor = 1.5;
		this.lineGrowthFactor = 2;
		
		this.baseRadius = 9;
		this.biggerRadius = this.baseRadius * 2;
		this.baseLineStrokeWidth = 8;
		this.baseCircleStrokeWidth = 1;
		this.circleStrokeWidthGrowthFactor = 6;

		this.color = d3.scaleOrdinal(d3.schemeCategory20);

		this.simulation = d3.forceSimulation()
			.force("center", d3.forceCenter(this.initialCenterX, this.initialCenterY))
			.force("collide", d3.forceCollide(this.baseRadius+15))
			.force("charge", d3.forceManyBody()
				.strength(-50))
			.force("link", d3.forceLink()
				.id(d => d.page));
				// .strength(0.7));
		this.update();
	}

	update() {
		let graph = this.props.graph;
		let startNode = null;
		for (let n of graph.nodes) {
			if (n.page === this.props.startPage) {
				startNode = n;
				break;
			}
		}
		startNode.fx = this.initialCenterX;
		startNode.fy = this.initialCenterY;

		let svg = this.svg;
		let simulation = this.simulation;

		simulation.nodes(graph.nodes)
			.on("tick", this.tick);
		simulation.force("link")
			.links(graph.links);

		this.link = svg.append("g")
			.attr("class", "links")
			.selectAll("line")
			.data(graph.links)
			.enter()
			.append("line")
				.attr("stroke", l => this.color(l.createdBy))
				.attr("stroke-width", this.baseLineStrokeWidth)
				.on("mouseover", this.handleMouseOverLine)
				.on("mouseout", this.handleMouseOutLine);

		this.link
			.filter(l => l.createdBy !== l.target.discoveredBy)
			.attr("stroke-dasharray", this.dashArray);

		this.node = svg.append("g")
			.attr("class", "nodes")
			.selectAll("g")
			.data(graph.nodes)
			.enter()
			.append("g")
			.on("mouseover", this.handleMouseOverCircle)
			.on("mouseout", this.handleMouseOutCircle)
			.call(d3.drag()
				.on("start", this.dragStarted)
				.on("drag", this.dragged)
				.on("end", this.dragEnded));
		let startPage = this.props.startPage;
		this.node
			.append("circle")
				.attr("r", d => {
					if (d.page === this.props.endPage) {
						return this.biggerRadius;
					}
					return this.baseRadius;
				})
			.attr("stroke", "black")
			.attr("fill", d => 
				d.page !== startPage ? this.color(d.discoveredBy) : "black"
			);
		let hasOtherVisits = this.node
			.filter(d => d.otherVisits && d.otherVisits.length !== 0);
		hasOtherVisits
			.select("circle")
				.attr("r", this.biggerRadius);
		hasOtherVisits
			.append("text")
				.attr("fill", d => {
					return contrast(this.color(d.discoveredBy)) === "light" ?
						"#000" :
						"#fff";
				})
				.attr("font-weight", "bold")
				.attr("text-anchor", "middle")
				.attr("alignment-baseline", "central")
				.text(d => d.otherVisits.length);
		let endPage = this.props.endPage;
		this.node
			.filter(d => d.page === endPage)
			.append("circle")
				.attr("r", this.biggerRadius / 2);
	}

handleMouseOverCircle(d) {
	d3.select(d3.event.target.parentNode)
		.select("circle")
			.transition()
			.attr("stroke-width", this.baseCircleStrokeWidth * this.circleStrokeWidthGrowthFactor);
	this.props.setSelectedNode(d);
}

handleMouseOutCircle(d) {
	let isText = d3.event.target.tagName === "text";
	if (isText) return;
	d3.select(d3.event.target)
			.transition()
			.attr("stroke-width", this.baseCircleStrokeWidth);
	this.props.setSelectedNode(null);
}

handleMouseOverLine(l) {
	let line = d3.select(d3.event.target);
	line
		.transition()
		.attr("stroke-width", this.baseLineStrokeWidth * this.lineGrowthFactor)
		.attr("stroke-dasharray", null);
	this.props.setSelectedLink({
		source: l.source.page,
		target: l.target.page,
		createdBy: l.createdBy,
		createdAt: l.createdAt,
		otherTravels: l.otherTravels
	});
}

handleMouseOutLine(l) {
	let line = d3.select(d3.event.target);
	line
		.transition()
		.attr("stroke-width", this.baseLineStrokeWidth)
		.attr("stroke-dasharray",  l => {
			return l.createdBy !== l.target.discoveredBy ? this.dashArray : null;
		});
	this.props.setSelectedLink(null);
}

	tick() {
		this.drawLink(this.link);
		this.drawNode(this.node);
	}

	drawNode(node) {
		node.selectAll("circle")
			.attr("cx", d => {
				return d.x;
			})
			.attr("cy", d => {
				return d.y;
			});
		node.select("text")
			.attr("x", d => d.x)
			.attr("y", d => d.y);

	}

	drawLink(link) {
		link
			.attr("x1", l => l.source.x)
			.attr("y1", l => l.source.y)
			.attr("x2", l => l.target.x)
			.attr("y2", l => l.target.y);
	}

	dragStarted(d) {
		let startPage = this.props.startPage;
		if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
		d.fx = d.x;
		d.fy = d.y;
		if (d.page === startPage) {
			this.simulation.force("center").x(d.x);
			this.simulation.force("center").y(d.y);
		}
	}

	dragged(d) {
		let startPage = this.props.startPage;
		if (d.page === startPage) {
			if (d3.event.x < 0
				|| d3.event.x > this.width
				|| d3.event.y < 0
				|| d3.event.y > this.height) {
				return;
			}
			d.fx = d3.event.x;
			d.fy = d3.event.y;
			this.simulation.force("center").x(d.x);
			this.simulation.force("center").y(d.y);
		} else {
			d.fx = d3.event.x;
			d.fy = d3.event.y;
		}
	}

	dragEnded(d) {
		let startPage = this.props.startPage;
		if (!d3.event.active) this.simulation.alphaTarget(0);
		if (d.page !== startPage) {
			d.fx = null;
			d.fy = null;
		}
	}

	render() {
		return <svg id="graph"></svg>;
	}
}
