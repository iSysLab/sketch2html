// Copyright 2010 William Malone (www.williammalone.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/*jslint browser: true */
/*global G_vmlCanvasManager */

var drawingApp = (function () {

		"use strict";
		var canvas,
		context,
		outlineImage = new Image(),
		//color info
		colorRed = "#ff0000",
		colorPurple = "#cb3594",
		colorGreen = "#659b41",
		colorYellow = "#ffcf33",
		colorBrown = "#986928",
		colorBlack = "#000000",

		startclickX = [],
		startclickY = [],
		endclickX = [],
		endclickY = [],

		//etc info
		clickColor = [],
		clickTool = [],
		clickSize = [],
		clickDrag = [],
		paint = false,
		curColor = colorBlack,
		curTool = "crayon",
		curSize = "normal",
		totalLoadResources = 1,
		curLoadResNum = 0,

		// Clears the canvas.
		clearCanvas = function () {
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.fillStyle = "white";
			context.fillRect(0, 0, canvas.width, canvas.height);
			context.fill();
		},

		// Redraws the canvas.
		redraw = function () {
			var i, radius;
			// Make sure required resources are loaded before redrawing
			if (curLoadResNum < totalLoadResources) {
				return;
			}

			clearCanvas();
			context.drawImage(outlineImage, 0, 0, canvas.width, canvas.height);
			// Keep the drawing in the drawing area
			context.beginPath();
			context.save();
			context.rect(0, 0, canvas.width, canvas.height);
			context.clip();
			// For each point drawn
			for (i = 0; i < startclickX.length; i += 1) {

				// Set the drawing radius
				switch (clickSize[i]) {
				case "small":
					radius = 2;
					break;
				case "normal":
					radius = 5;
					break;
				case "large":
					radius = 10;
					break;
				case "huge":
					radius = 20;
					break;
				default:
					break;
				}

				// Set the drawing path
				context.beginPath();
				// If dragging then draw a line between the two points
				if (clickDrag[i] && i) {
					context.moveTo(startclickX[i - 1], startclickY[i - 1]);
				} else {
					// The x position is moved over one pixel so a circle even if not dragging
					context.moveTo(startclickX[i] - 1, startclickY[i]);
				}
				context.lineTo(startclickX[i], startclickY[i]);

				// Set the drawing color
				if (clickTool[i] === "eraser") {
					context.strokeStyle = 'white';
				} else {
					context.strokeStyle = clickColor[i];
				}
				context.lineCap = "round";
				context.lineJoin = "round";
				context.lineWidth = radius;
				context.stroke();
			}
			context.closePath();
			context.restore();

			//context.globalAlpha = 1;
			// Draw the outline image

		},

		// Adds a point to the drawing array.
		// @param x
		// @param y
		// @param dragging
		addClick = function (x, y, dragging) {
			startclickX.push(x);
			startclickY.push(y-100);
			clickTool.push(curTool);
			clickColor.push(curColor);
			clickSize.push(curSize);
			clickDrag.push(dragging);
		},

		addRelease = function (x, y, dragging) {
			endclickX.push(x);
			endclickY.push(y-100);
			clickTool.push(curTool);
			clickColor.push(curColor);
			clickSize.push(curSize);
			clickDrag.push(dragging);
		},

		// Add mouse and touch event listeners to the canvas
		createUserEvents = function () {

			var press = function (e) {
				// Mouse down location
				var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft,
					mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;
				paint = true;
				addClick(mouseX, mouseY, false);
				redraw();
			},

			drag = function (e) {
				var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft,
					mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;

				if (paint) {
					addClick(mouseX, mouseY, true);
					redraw();
				}
				// Prevent the whole page from dragging if on mobile
				e.preventDefault();
			},

			release = function () {
				if (curTool === "line"){
					paint = true;
					var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft,
						mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;
					redraw();
					paint = false;
				}else{
					paint = false;
					redraw();
				}
			},

			cancel = function () {
				paint = false;
			};

			// Add mouse event listeners to canvas element
			canvas.addEventListener("mousedown", press, false);
			canvas.addEventListener("mousemove", drag, false);
			canvas.addEventListener("mouseup", release);
			canvas.addEventListener("mouseout", cancel, false);

			// Add touch event listeners to canvas element
			canvas.addEventListener("touchstart", press, false);
			canvas.addEventListener("touchmove", drag, false);
			canvas.addEventListener("touchend", release, false);
			canvas.addEventListener("touchcancel", cancel, false);
		},

		// Calls the redraw function after all neccessary resources are loaded.
		resourceLoaded = function () {
			curLoadResNum += 1;
			if (curLoadResNum === totalLoadResources) {
				redraw();
				createUserEvents();
			}
		},

		// Creates a canvas element, loads images, adds events, and draws the canvas for the first time.
		init = function (canvas_id, background_url) {
			canvas = document.getElementById(canvas_id);
			context = canvas.getContext("2d"); // Grab the 2d canvas context

			if (background_url) {
				// Load images
				outlineImage.onload = resourceLoaded;
				outlineImage.src = background_url;
			} else {
				resourceLoaded();
			}
		},

		changeSize = function(size) {
			curSize = size.toLowerCase(); // small, normal, large, huge
		},

		changeTool = function(tool) {
			tool = tool.toLowerCase();
			if (tool == "crayon" || tool == "eraser" || tool == "line")
				curTool = tool
		},

		changeColor = function(color) {
			color = color.toLowerCase();
			// curTool = "crayon";
			switch (color) {
				case "red" : curColor = colorRed; break;
				case "purple": curColor = colorPurple; break;
				case "green": curColor = colorGreen; break;
				case "yellow": curColor = colorYellow; break;
				case "brown": curColor = colorBrown; break;
				case "black": curColor = colorblack; break;
				default:
					curColor = color;
			}
		},

		clearDrawing = function() {
			startclickX.length = 0;
			startclickY.length = 0;
			clickTool.length = 0;
			clickColor.length = 0;
			clickSize.length = 0;
			clickDrag.length = 0;
			clearCanvas();
		};

	return {
		init: init,
		clearDrawing: clearDrawing,
		changeSize: changeSize,
		changeColor: changeColor,
		changeTool: changeTool
	};
}());
