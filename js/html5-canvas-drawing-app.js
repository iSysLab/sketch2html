function ToSketch2HTML(){
	var url = document.location.href;
	location.href = url;
};

function drawEllipse(ctx, x, y, w, h) {
  var kappa = .5522848;
      ox = (w / 2) * kappa, // control point offset horizontal
      oy = (h / 2) * kappa, // control point offset vertical
      xe = x + w,           // x-end
      ye = y + h,           // y-end
      xm = x + w / 2,       // x-middle
      ym = y + h / 2;       // y-middle

  ctx.beginPath();
  ctx.moveTo(x, ym);
  ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
  ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
  ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
  ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
  ctx.closePath();
  ctx.stroke();
};

function listener(e){
	if(drawingApp.curTool == "crayon" || drawingApp.curTool == "eraser"){
		switch (e.type) {
			case "mousedown":
				drawingApp.crayon_init_Draw(e);
				break;
			case "mousemove":
				if(drawingApp.pos.drawable)
					drawingApp.crayon_move_Draw(e);
				break;
			case "mouseout":
			case "mouseup":
				drawingApp.finish_Draw();
				break;
		}
	}else if (drawingApp.curTool == "line"){
		switch (e.type) {
			case "mousedown":
				drawingApp.line_init_Draw(e);
				break;
			case "mousemove":
				if(drawingApp.pos.drawable)
					drawingApp.line_move_Draw(e);
				break;
			case "mouseout":
			case "mouseup":
				drawingApp.finish_Draw();
				break;
		}
	}else if(drawingApp.curTool == "rect"){
		switch (e.type) {
			case "mousedown":
				drawingApp.rectangle_init_Draw(e);
				break;
			case "mousemove":
				if(drawingApp.pos.drawable)
					drawingApp.rectangle_move_Draw(e);
				break;
			case "mouseout":
			case "mouseup":
				drawingApp.finish_Draw();
				break;
		}
	}else if(drawingApp.curTool == "circle"){
		switch (e.type) {
			case "mousedown":
				drawingApp.circle_init_Draw(e);
				break;
			case "mousemove":
				if(drawingApp.pos.drawable)
					drawingApp.circle_move_Draw(e);
				break;
			case "mouseout":
			case "mouseup":
				drawingApp.finish_Draw();
				break;
		}
	}
};

function keylistener(e) {
  var eventObject = window.event ? event : e
  switch (e.type) {
    case "keypress":
      //Do action on CTRL + Z
      if (eventObject.keyCode == 90 && eventObject.ctrlKey) {
				if (drawingApp.undo.length > 0){
					drawingApp.clearCanvas();
					var undoImage = drawingApp.undo.pop();
					// drawingApp.redo.push(undoImage);
					drawingApp.context.putImageData(undoImage, 0, 0);
					console.log("Undo : ctrl + z : keypress");
				}
      }
      break;
    case "keydown":
      //Do action on CTRL + Z
      if (eventObject.keyCode == 90 && eventObject.ctrlKey) {
        if (drawingApp.undo.length > 0){
					drawingApp.clearCanvas();
					var undoImage = drawingApp.undo.pop();
					// drawingApp.redo.push(undoImage);
					drawingApp.context.putImageData(undoImage, 0, 0);
					console.log("Undo : ctrl + z : keydown");
        }
      }
      break;
  }
};

function fileOpen(){
	console.log("aa");
	var img = new Image();
	drawingApp.file = drawingApp.fileloader.files[0];
	var url = window.URL || window.webkitURL;
	var src = url.createObjectURL(drawingApp.file);
	img.src = src;
	img.onload = function() {
			drawingApp.context.drawImage(img, 0, 0);
			url.revokeObjectURL(src);
	}
};

var drawingApp = new function (){
	this.undo = [];
	// this.redo = [];
	this.pos = {
		drawable: false,
		x: -1,
		y: -1,
	};
	this.file;
	this.fileloader;
	this.canvas;
	this.context;
	this.curTool = "crayon";

	this.colorRed = "#ff0000";
  this.colorBlue = "#002299";
	this.colorPurple = "#cb3594";
	this.colorGreen = "#659b41";
	this.colorYellow = "#ffcf33";
	this.colorBrown = "#986928";
	this.colorBlack = "#000000";
	this.colorWhite = "#ffffff";
	this.curColor = this.colorBlack;

	this.sizeSmall = "2";
	this.sizeNormal = "5";
	this.sizeLarge = "10";
	this.sizeHuge = "20";
	this.curRadius = this.sizeNormal;
	this.backup;

	this.clearCanvas = function(){
		this.context.fillStyle = this.colorWhite;
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.fill();
	}

	this.crayon_init_Draw = function(e){
		this.undo.push(this.context.getImageData(0, 0, this.canvas.width, this.canvas.height));
		this.context.lineCap = "round";
		this.context.lineJoin = "round";
		this.context.lineWidth = this.curRadius;
		this.context.strokeStyle = this.curColor;
		this.context.beginPath();
		this.pos.drawable = true;
		if(this.curTool == "eraser"){
			this.context.strokeStyle = this.colorWhite;
		}
		var coors = this.getPosition(e);
		this.pos.X = coors.X;
		this.pos.Y = coors.Y;
		this.context.moveTo(this.pos.X, this.pos.Y);
	};

	this.crayon_move_Draw = function(e){
		var coors = this.getPosition(e);
		this.context.lineTo(coors.X, coors.Y);
		this.pos.X = coors.X;
		this.pos.Y = coors.Y;
		this.context.stroke();
	};

	this.line_init_Draw = function(e){
		this.undo.push(this.context.getImageData(0, 0, this.canvas.width, this.canvas.height));
		this.backup = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
		this.context.lineCap = "round";
		this.context.lineJoin = "round";
		this.context.lineWidth = this.curRadius;
		this.context.strokeStyle = this.curColor;
		this.pos.drawable = true;
		var coors = this.getPosition(e);
		this.pos.X = coors.X;
		this.pos.Y = coors.Y;
	};

	this.line_move_Draw = function(e){
		this.context.putImageData(this.backup, 0, 0);
    this.context.beginPath();
		this.context.moveTo(this.pos.X, this.pos.Y);
    var coors = this.getPosition(e);
		this.context.lineTo(coors.X, coors.Y);
		this.context.stroke();
	};

	this.rectangle_init_Draw = function(e){
		this.undo.push(this.context.getImageData(0, 0, this.canvas.width, this.canvas.height));
		this.backup = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
		this.context.lineCap = "round";
		this.context.lineJoin = "round";
		this.context.lineWidth = this.curRadius;
		this.context.strokeStyle = this.curColor;
		this.pos.drawable = true;
		var coors = this.getPosition(e);
		this.pos.X = coors.X;
		this.pos.Y = coors.Y;
	};

	this.rectangle_move_Draw = function(e){
	 	this.context.putImageData(this.backup, 0, 0);
    this.context.beginPath();
    var coors = this.getPosition(e);
		var Rect_width = coors.X - this.pos.X;
		var Rect_height = coors.Y - this.pos.Y;
		this.context.rect(this.pos.X, this.pos.Y, Rect_width, Rect_height);
		this.context.stroke();
	};

	this.circle_init_Draw = function(e){
		this.undo.push(this.context.getImageData(0, 0, this.canvas.width, this.canvas.height));
		this.backup = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
		this.context.lineCap = "round";
		this.context.lineJoin = "round";
		this.context.lineWidth = this.curRadius;
		this.context.strokeStyle = this.curColor;
		this.pos.drawable = true;
		var coors = this.getPosition(e);
		this.pos.X = coors.X;
		this.pos.Y = coors.Y;
	};

	this.circle_move_Draw = function(e){
		this.context.putImageData(this.backup, 0, 0);
    this.context.beginPath();
    var coors = this.getPosition(e);
		var width = coors.X - this.pos.X;
		var height = coors.Y - this.pos.Y;
		drawEllipse(this.context, this.pos.X, this.pos.Y, width, height);
		this.context.stroke();
	};

	this.finish_Draw = function(){
		this.pos.drawable = false;
		this.pos.X = -1;
		this.pos.Y = -1;
	};

	this.getPosition = function(e){
		var x = event.pageX - this.canvas.offsetLeft;
		var y = event.pageY - this.canvas.offsetTop;
		return {X: x, Y: y};
	};

	this.changeColor = function(color){
		var Color = color.toLowerCase();
		if (this.curTool == "eraser")
			return;
		switch (color) {
			case "red" : this.curColor = this.colorRed; break;
      case "blue" :this.curColor = this.colorBlue; break;
			case "purple": this.curColor = this.colorPurple; break;
			case "green": this.curColor = this.colorGreen; break;
			case "yellow": this.curColor = this.colorYellow; break;
			case "brown": this.curColor = this.colorBrown; break;
			case "black": this.curColor = this.colorblack; break;
			default:
				this.curColor = Color;
		}
	};

	this.changeSize = function(size){
		var Size = size.toLowerCase();
		switch (Size) {
			case "small":
				this.curRadius = this.sizeSmall;break;
			case "normal":
				this.curRadius = this.sizeNormal;break;
			case "large":
				this.curRadius = this.sizeLarge;break;
			case "huge":
				this.curRadius = this.sizeHuge;break;
			default:
				break;
			}
		};

	this.changeTool = function(tool){
		var Tool = tool.toLowerCase();
			if (Tool == "crayon" || Tool == "eraser" || Tool == "line" || Tool == "rect" || Tool == "circle")
				this.curTool = Tool;
	};

	this.clearDrawing = function() {
		this.clearCanvas();
		this.undo.length = 0;
		this.redo.length = 0;
	};

	this.Undo = function(){
		if (this.undo.length > 0){
			drawingApp.clearCanvas();
			var undoImage = drawingApp.undo.pop();
			// this.redo.push(undoImage);
			this.context.putImageData(undoImage, 0, 0);
			console.log("Undo");
		}
	};

	// this.Redo = function(){
	// 	if (this.redo.length > 0){
	// 		this.clearCanvas();
	// 		var redoImage = drawingApp.redo.pop();
	// 		this.undo.push(redoImage);
	// 		this.context.putImageData(redoImage, 0, 0);
	// 		console.log("Redo");
	// 	}
	// };
};

//main
document.addEventListener("DOMContentLoaded", function(){
	drawingApp.canvas = document.getElementById("canvasDiv");
	drawingApp.fileloader = document.getElementById("uploadBtn");
	drawingApp.context = drawingApp.canvas.getContext("2d");
	drawingApp.clearCanvas();
	drawingApp.canvas.addEventListener("mousedown", listener, false);
	drawingApp.canvas.addEventListener("mousemove", listener, false);
	drawingApp.canvas.addEventListener("mouseup", listener, false);
	drawingApp.canvas.addEventListener("mouseout", listener, false);
	drawingApp.fileloader.addEventListener("change", fileOpen, false);
  window.addEventListener("keypress", keylistener, false);
  window.addEventListener("keydown", keylistener, false);
	$('.color-buttons a').click(function() {drawingApp.changeColor($(this).text());});
  $('.size-buttons a').click(function() {drawingApp.changeSize($(this).text());});
  $('.tool-buttons a').click(function() {drawingApp.changeTool($(this).text());});
	$('#uploadBtn').change(function(){document.getElementById("uploadFile").value = this.value;});
	$('#sendtoserver').click(function() {
		var dataURL = drawingApp.canvas.toDataURL('image/jpeg');
		$.ajax({
			type: "POST",
			url: "/send_img",
			data: {
				 imgBase64: dataURL
			},
			success: function(o) {
				// reload output iframe
				var ts = new Date().getTime();
				$("#sendtoserver").attr('disabled',false);
				$("#out_frame").attr("src", "../html/sketch2html_result.html?timestamp=" + ts);
				$('.wrap-loading').addClass('display-none');
			},
			beforeSend: function(o) {
				// reload output iframe
				var ts = new Date().getTime();
				$("#sendtoserver").attr('disabled',true);
				$('.wrap-loading').removeClass('display-none');
			}
		});
	});
});
