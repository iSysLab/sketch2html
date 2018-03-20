var stack = [];

function ToSketch2HTML(){
  var url = document.location.href;
  location.href = url;
};

function mouselistener(e){
	if (drawingApp.curTool == "line"){
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
	}else{
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
	}
};

function keylistener(e) {
  var eventObject = window.event ? event : e
  switch (e.type) {
    case "keypress":
      //Do action on CTRL + Z
      if (eventObject.keyCode == 90 && eventObject.ctrlKey) {
        if (this.stack.length > 0){
          console.log(this.stack.length);
          drawingApp.context.putImageData(this.stack.pop(), 0, 0);
        }
      }
      break;
    case "keydown":
      //Do action on CTRL + Z
      if (eventObject.keyCode == 90 && eventObject.ctrlKey) {
        if (this.stack.length > 0){
          console.log(this.stack.length);
          drawingApp.context.putImageData(this.stack.pop(), 0, 0);
        }
      }
      break;
  }
};

var drawingApp = new function (){
	this.pos = {
		drawable: false,
		x: -1,
		y: -1,
	};

	this.canvas;
	this.context;
	this.curTool = "crayon";

	this.colorRed = "#ff0000";
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

	this.finish_Draw = function(){
    this.stack.push(this.context.getImageData(0, 0, this.canvas.width, this.canvas.height));
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
			if (Tool == "crayon" || Tool == "eraser" || Tool == "line")
				this.curTool = Tool;
	};

	this.clearDrawing = function() {
			this.clearCanvas();
      this.stack.length
	};
};

//main
document.addEventListener("DOMContentLoaded", function(){
	drawingApp.canvas = document.getElementById("canvasDiv");
	drawingApp.context = drawingApp.canvas.getContext("2d");
	drawingApp.clearCanvas();
	drawingApp.canvas.addEventListener("mousedown", mouselistener);
	drawingApp.canvas.addEventListener("mousemove", mouselistener);
	drawingApp.canvas.addEventListener("mouseup", mouselistener);
	drawingApp.canvas.addEventListener("mouseout", mouselistener);
  window.addEventListener("keypress", keylistener, true);
  window.addEventListener("keydown", keylistener, true);

	$('.color-buttons a').click(function() {drawingApp.changeColor($(this).text());});
  $('.size-buttons a').click(function() {drawingApp.changeSize($(this).text());});
  $('.tool-buttons a').click(function() {drawingApp.changeTool($(this).text());});
  $('#sendtoserver').click(function() {
    var dataURL = drawingApp.canvas.toDataURL('image/jpeg');
    $.ajax({
        type: "POST",
        url: "/send_img",
        data: {
          imgBase64: dataURL
        }
    }).done(function(o) {
        // reload output iframe
        var ts = new Date().getTime();
        $("#out_frame").attr("src", "out?timestamp=" + ts);
    });
	});
});
