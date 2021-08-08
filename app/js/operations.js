function loadData(imageObj, img_src, resize_canvas, imageWidth = null, imageHeight = null) {
  //set the image target
  imageObj.src = imageData;
  img_src.src = imageObj.src;
  //resize the canvas
  $(img_src).bind("load", function () {
    if(imageWidth == null) {

      // Image width height controls, Default width: 6in height: 4in => For this example scaled to 15x10in
      if (this.width / this.height >= 1.5) {
        $(imageObj).css({
          width: "auto",
          height: "4in",
        });
      } else {
        $(imageObj).css({
          width: "6in",
          height: "auto",
        });
      }
    } else {
      $(imageObj).css({
        width: imageWidth,
        height: imageHeight,
      });
      
    }
    
    resizeImageCanvas(
      $(imageObj).width(),
      $(imageObj).height(),
      resize_canvas,
      img_src,
      imageObj
    );
  });
}



$("#removeGallery").click(function (evt) {
  localStorage.removeItem("images");
  $("#gallery-item").empty();
  alert("All images removed from gallery!");
});

function saveImage(imageObj, img_src, imageData) {
  $container = $(".resize-container");
  if (localStorage.getItem("images")) {
    var galleryObj = JSON.parse(localStorage.getItem("images"));
    galleryObj.images.push({
      image: imageData,
      imageWidth: $(imageObj).width(),
      imageHeight: $(imageObj).height(),
      containerWidth: $container.width(),
      containerHeight: $container.height(),
      containerLeft: $container.offset().left,
      containerTop: $container.offset().top,
      tools: {
        grayscale: $("#grayscale").val(),
        blur: $("#blur").val(),
        exposure: $("#exposure").val(),
        contrast: $("#contrast").val(),
        hue: $("#hue").val(),
        opacity: $("#opacity").val(),
        invert: $("#invert").val(),
        saturate: $("#saturate").val(),
        rotate: $("#rotate").val(),
      },
    });
    localStorage.setItem("images", JSON.stringify(galleryObj));
    console.log("galleryObj 1", galleryObj);
  } else {
    var galleryObj = { images: [] };
    galleryObj.images.push({
      image: imageData,
      imageWidth: $(imageObj).width(),
      imageHeight: $(imageObj).height(),
      containerWidth: $container.width(),
      containerHeight: $container.height(),
      containerLeft: $container.offset().left,
      containerTop: $container.offset().top,
      tools: {
        grayscale: $("#grayscale").val(),
        blur: $("#blur").val(),
        exposure: $("#exposure").val(),
        contrast: $("#contrast").val(),
        hue: $("#hue").val(),
        opacity: $("#opacity").val(),
        invert: $("#invert").val(),
        saturate: $("#saturate").val(),
        rotate: $("#rotate").val(),
      },
    });
    localStorage.setItem("images", JSON.stringify(galleryObj));
    console.log("galleryObj 2", galleryObj);
  }
  alert("Image saved to gallery!");
}
