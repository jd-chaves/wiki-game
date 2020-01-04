import React, { Component } from "react";

export default class Sketch extends Component {
	componentDidMount() {
		let sketch = s => {
			let node = document.getElementById("sketch");
			s.setup = () => {
				s.createCanvas(node.parentNode.offsetWidth, 400);
				s.background("#fafafa");
			};

			s.draw = () => {
				s.fill(s.random(255), 10);
				s.noStroke();
				let scx = s.width/3;
				let scy = 150;
				s.ellipse(s.width/2, s.height/2, s.random(scx*2), s.random(scy*2));
				
				if (s.mouseX !== 0 && s.mouseY !== 0) {
					s.fill(s.random(150), 255);
					let scope = 20;
					s.ellipse(s.mouseX, s.mouseY, 2*s.random(scope), 2*s.random(scope))	;
					s.quad(s.mouseX + s.random(-scope, scope), s.mouseY + s.random(-scope, scope), s.mouseX + s.random(-scope, scope), s.mouseY + s.random(-scope, scope), s.mouseX + s.random(-scope, scope), s.mouseY + s.random(-scope, scope), s.mouseX + s.random(-scope, scope), s.mouseY + s.random(-scope, scope));
					s.triangle(s.mouseX + s.random(-scope, scope), s.mouseY + s.random(-scope, scope), s.mouseX + s.random(-scope, scope), s.mouseY + s.random(-scope, scope), s.mouseX + s.random(-scope, scope), s.mouseY + s.random(-scope, scope));
				}

				s.fill(0);
				s.textSize(150);
				s.textFont("Linux Libertine");
				s.textAlign(s.CENTER, s.CENTER);
				s.text("W", s.width/2, s.height/2);
			};
		};
		new p5(sketch, "sketch");	
	}

	render() {
		return <div id="sketch"></div>;
	}
}
