var albumPrinter = function (imageObj) {
  var $container,
    img_src = new Image(),
    imageObj = $(imageObj).get(0),
    event_state = {},
    constrain = false,
    min_width = 60,
    min_height = 60,
    max_width = 1800,
    max_height = 1900,
    init_height = 200,
    resize_canvas = document.createElement("canvas");
  imageData = null;

  init = function () {
    // Load an image with htlm5 file api when fileSelector changed!
    $("#fileSelector").change(function (evt) {
      // Hide image action and edit tool buttons
      $("#gallery").hide();
      $("#select-image-buttons").hide();
      $("#editing-region").show();
      $("#image-actions").show();
      $("#edit-tools").show();

      // Get files and result
      var files = evt.target.files;
      var reader = new FileReader();

      reader.onload = function (e) {
        imageData = reader.result;
        loadData(imageObj, img_src, resize_canvas);
      };
      reader.readAsDataURL(files[0]);
    });


    // Select image from gallery part!
    $("#fileSelectorGallery").click(function (evt) {
      $("#gallery").show();
      if (localStorage.getItem("images")) {
        var gallery = JSON.parse(localStorage.getItem("images"));
        $("#gallery-item").empty();
        gallery.images.forEach(function (item, index) {
          var itemImage = item.image;
          var code = item;
          code.image = "img_" + index;
          $("#gallery-item").append(
            '<div class="col-md-4" onclick="selectGalleryItem(' +
              index +
              ');"><img src="' +
              itemImage +
              '" style="transform: rotate(' +
              code.tools.rotate +
              "deg); filter: grayscale(" +
              code.tools.grayscale +
              "%) blur(" +
              code.tools.blur +
              "px) brightness(" +
              code.tools.exposure +
              "%) contrast(" +
              code.tools.contrast +
              "%) hue-rotate(" +
              code.tools.hue +
              "deg) opacity(" +
              code.tools.opacity +
              "%) invert(" +
              code.tools.invert +
              "%) saturate(" +
              code.tools.saturate +
              '%)" height="100" width="100" /><code>' +
              JSON.stringify(code) +
              "</code></div>"
          );
        });
      } else {
        alert("No images found in the gallery!");
      }
    });

    // reset image resizing, positioning and tools
    $(".image-reset").click(function () {
      if (imageData) {
        resetTools();
        loadData(imageObj, img_src, resize_canvas);
      }
    });

    // remove selected image
    $(".image-remove").click(function () {
      if (imageData) {
        removeData();
      }
    });

    function removeData() {
      $("#select-image-buttons").show();
      $("#editing-region").hide();
      $("#image-actions").hide();
      $("#edit-tools").hide();
      $("#fileSelector").prop("value", "");
      
      //set the image target
      (event_state = {}),
        (img_src = new Image()),
        (imageObj = $(imageObj).get(0)),
        (imageData = null);
      img_src.src = imageObj.src;

      $(".resize-container").css({ left: 0, top: 0 });

      $(".resize-container").offset({
        left: 0,
        top: 0,
      });

      resetTools();
      $(img_src).bind("load", function () {
        resizeImageCanvas(0, 0);
      });
    }

    // Save image to gallery as a JSON object to local storage!
    $(".save-image").click(function () {
      if (imageData) {
        saveImage(imageObj, img_src, imageData);
      }
    });

    img_src.src = imageObj.src;

    $(imageObj)
      .height(init_height)
      .wrap('<div class="resize-container"></div>')
      .before('<span class="resize-handle resize-handle-nw"></span>')
      .before('<span class="resize-handle resize-handle-ne"></span>')
      .after('<span class="resize-handle resize-handle-se"></span>')
      .after('<span class="resize-handle resize-handle-sw"></span>');

    $container = $(".resize-container");

    $container.prepend('<div class="resize-container-ontop"></div>');

    // Add events
    $container.on("mousedown touchstart", ".resize-handle", startResize);
    $container.on(
      "mousedown touchstart",
      ".resize-container-ontop",
      startMoving
    );
  };

  // When user select an item from gallery, this function runs!
  selectGalleryItem = function (index) {
    var gallery = JSON.parse(localStorage.getItem("images"));
    var selectedGalleryItem = gallery.images[index];
    $("#gallery").hide();
    $("#select-image-buttons").hide();
    $("#editing-region").show();
    $("#image-actions").show();
    $("#edit-tools").show();

    imageData = selectedGalleryItem.image;
    loadData(
      imageObj,
      img_src,
      resize_canvas,
      selectedGalleryItem.imageWidth,
      selectedGalleryItem.imageHeight
    );
    editGalleryItem(selectedGalleryItem.tools);

    console.log(
      "selectedGalleryItem.containerLeft",
      selectedGalleryItem.containerLeft
    );
    console.log(
      "selectedGalleryItem.containerTop",
      selectedGalleryItem.containerTop
    );
    $container.offset({
      left: selectedGalleryItem.containerLeft,
      top: selectedGalleryItem.containerTop,
    });
  };

  startResize = function (e) {
    e.preventDefault();
    e.stopPropagation();
    saveEventState(e);
    $(document).on("mousemove touchmove", resizing);
    $(document).on("mouseup touchend", endResize);
  };

  endResize = function (e) {
    resizeImageCanvas($(imageObj).width(), $(imageObj).height());
    e.preventDefault();
    $(document).off("mouseup touchend", endResize);
    $(document).off("mousemove touchmove", resizing);
  };

  saveEventState = function (e) {
    // Save the initial event details and container state
    event_state.container_width = $container.width();
    event_state.container_height = $container.height();
    event_state.container_left = $container.offset().left;
    event_state.container_top = $container.offset().top;
    event_state.mouse_x =
      (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) +
      $(window).scrollLeft();
    event_state.mouse_y =
      (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) +
      $(window).scrollTop();

    if (typeof e.originalEvent.touches !== "undefined") {
      event_state.touches = [];
      $.each(e.originalEvent.touches, function (i, ob) {
        event_state.touches[i] = {};
        event_state.touches[i].clientX = 0 + ob.clientX;
        event_state.touches[i].clientY = 0 + ob.clientY;
      });
    }
    event_state.evnt = e;
  };

  resizing = function (e) {
    var mouse = {},
      width,
      height,
      left,
      top,
      offset = $container.offset();
    mouse.x =
      (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) +
      $(window).scrollLeft();
    mouse.y =
      (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) +
      $(window).scrollTop();

    if ($(event_state.evnt.target).hasClass("resize-handle-se")) {
      width = mouse.x - event_state.container_left;
      height = mouse.y - event_state.container_top;
      left = event_state.container_left;
      top = event_state.container_top;
    } else if ($(event_state.evnt.target).hasClass("resize-handle-sw")) {
      width =
        event_state.container_width - (mouse.x - event_state.container_left);
      height = mouse.y - event_state.container_top;
      left = mouse.x;
      top = event_state.container_top;
    } else if ($(event_state.evnt.target).hasClass("resize-handle-nw")) {
      width =
        event_state.container_width - (mouse.x - event_state.container_left);
      height =
        event_state.container_height - (mouse.y - event_state.container_top);
      left = mouse.x;
      top = mouse.y;
      if (constrain || e.shiftKey) {
        top = mouse.y - ((width / img_src.width) * img_src.height - height);
      }
    } else if ($(event_state.evnt.target).hasClass("resize-handle-ne")) {
      width = mouse.x - event_state.container_left;
      height =
        event_state.container_height - (mouse.y - event_state.container_top);
      left = event_state.container_left;
      top = mouse.y;
      if (constrain || e.shiftKey) {
        top = mouse.y - ((width / img_src.width) * img_src.height - height);
      }
    }

    if (constrain || e.shiftKey) {
      height = (width / img_src.width) * img_src.height;
    }

    if (
      width > min_width &&
      height > min_height &&
      width < max_width &&
      height < max_height
    ) {
      resizeImage(width, height);
      $container.offset({ left: left, top: top });
    }
  };

  resizeImage = function (width, height) {
    $(imageObj).width(width).height(height);
  };

  resizeImageCanvas = function (width, height) {
    resize_canvas.width = width;
    resize_canvas.height = height;
    resize_canvas.getContext("2d").drawImage(img_src, 0, 0, width, height);
    $(imageObj).attr("src", resize_canvas.toDataURL("image/png"));
  };

  startMoving = function (e) {
    e.preventDefault();
    e.stopPropagation();
    saveEventState(e);
    $(document).on("mousemove touchmove", moving);
    $(document).on("mouseup touchend", endMoving);
  };

  endMoving = function (e) {
    e.preventDefault();
    $(document).off("mouseup touchend", endMoving);
    $(document).off("mousemove touchmove", moving);
  };

  moving = function (e) {
    var mouse = {},
      touches;
    e.preventDefault();
    e.stopPropagation();

    touches = e.originalEvent.touches;

    mouse.x =
      (e.clientX || e.pageX || touches[0].clientX) + $(window).scrollLeft();
    mouse.y =
      (e.clientY || e.pageY || touches[0].clientY) + $(window).scrollTop();
    $container.offset({
      left: mouse.x - (event_state.mouse_x - event_state.container_left),
      top: mouse.y - (event_state.mouse_y - event_state.container_top),
    });

    if (
      event_state.touches &&
      event_state.touches.length > 1 &&
      touches.length > 1
    ) {
      var width = event_state.container_width,
        height = event_state.container_height;
      var a = event_state.touches[0].clientX - event_state.touches[1].clientX;
      a = a * a;
      var b = event_state.touches[0].clientY - event_state.touches[1].clientY;
      b = b * b;
      var dist1 = Math.sqrt(a + b);

      a = e.originalEvent.touches[0].clientX - touches[1].clientX;
      a = a * a;
      b = e.originalEvent.touches[0].clientY - touches[1].clientY;
      b = b * b;
      var dist2 = Math.sqrt(a + b);

      var ratio = dist2 / dist1;

      width = width * ratio;
      height = height * ratio;
      resizeImage(width, height);
    }
  };

  init();
};

// Run album printer
albumPrinter($(".album-image"));
