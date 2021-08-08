function resetTools() {
  (grayscale = 0),
    (blur = 0),
    (exposure = 100),
    (contrast = 100),
    (hue = 0),
    (opacity = 100),
    (invert = 0),
    (saturate = 100),
    (rotate = 0);

  $("#grayscale").val(grayscale);
  $("#blur").val(blur);
  $("#exposure").val(exposure);
  $("#contrast").val(contrast);
  $("#hue").val(hue);
  $("#opacity").val(opacity);
  $("#invert").val(invert);
  $("#saturate").val(saturate);
  $("#rotate").val(rotate);

  $(".album-image").css(
    "filter",
    "grayscale(" +
      grayscale +
      "%) blur(" +
      blur +
      "px) brightness(" +
      exposure +
      "%) contrast(" +
      contrast +
      "%) hue-rotate(" +
      hue +
      "deg) opacity(" +
      opacity +
      "%) invert(" +
      invert +
      "%) saturate(" +
      saturate +
      "%)"
  );
  $(".album-image").css("transform", "rotate(" + rotate + "deg)");
}

function editTools() {
  grayscale = $("#grayscale").val();
  blur = $("#blur").val();
  exposure = $("#exposure").val();
  contrast = $("#contrast").val();
  hue = $("#hue").val();
  opacity = $("#opacity").val();
  invert = $("#invert").val();
  saturate = $("#saturate").val();
  rotate = $("#rotate").val();

  $(".album-image").css({
    filter:
      "grayscale(" +
      grayscale +
      "%) blur(" +
      blur +
      "px) brightness(" +
      exposure +
      "%) contrast(" +
      contrast +
      "%) hue-rotate(" +
      hue +
      "deg) opacity(" +
      opacity +
      "%) invert(" +
      invert +
      "%) saturate(" +
      saturate +
      "%)",
    transform: "rotate(" + rotate + "deg)",
  });
}

function editGalleryItem(item) {
  $("#grayscale").val(item.grayscale);
  $("#blur").val(item.blur);
  $("#exposure").val(item.exposure);
  $("#contrast").val(item.contrast);
  $("#hue").val(item.hue);
  $("#opacity").val(item.opacity);
  $("#invert").val(item.invert);
  $("#saturate").val(item.saturate);
  $("#rotate").val(item.rotate);

  $(".album-image").css({
    filter:
      "grayscale(" +
      item.grayscale +
      "%) blur(" +
      item.blur +
      "px) brightness(" +
      item.exposure +
      "%) contrast(" +
      item.contrast +
      "%) hue-rotate(" +
      item.hue +
      "deg) opacity(" +
      item.opacity +
      "%) invert(" +
      item.invert +
      "%) saturate(" +
      item.saturate +
      "%)",
    transform: "rotate(" + item.rotate + "deg)",
  });
}
