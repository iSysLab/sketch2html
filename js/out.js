function getImage(){
  var ts = new Date().getTime();
  document.getElementById("out_img").innerHTML ="<img src='../images/origin.jpg?timestamp=" + ts + "'/>";
};

//main
document.addEventListener("DOMContentLoaded", function(){
  getImage();
});

// $(window).load(function() {
//     $('#load').hide();
// );
