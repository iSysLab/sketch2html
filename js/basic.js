function ToSketch2HTML(){
  var url = document.location.href;
  location.href = url;
};

document.addEventListener("DOMContentLoaded", function(){
    drawingApp.init('canvasDiv', null);
    $('.color-buttons a').click(function() {drawingApp.changeColor($(this).text());});
    $('.size-buttons a').click(function() {drawingApp.changeSize($(this).text());});
    $('.tool-buttons a').click(function() {drawingApp.changeTool($(this).text());});

    $('#sendtoserver').click(function() {
        canvas = document.getElementById('canvasDiv');
        var dataURL = canvas.toDataURL('image/jpeg');
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
