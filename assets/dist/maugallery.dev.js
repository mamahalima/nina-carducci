"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function ($) {
  $.fn.mauGallery = function (options) {
    var options = $.extend($.fn.mauGallery.defaults, options);
    var tagsCollection = [];
    return this.each(function () {
      $.fn.mauGallery.methods.createRowWrapper($(this));

      if (options.lightBox) {
        $.fn.mauGallery.methods.createLightBox($(this), options.lightboxId, options.navigation);
      }

      $.fn.mauGallery.listeners(options);
      $(this).children(".gallery-item").each(function (index) {
        $.fn.mauGallery.methods.responsiveImageItem($(this));
        $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
        $.fn.mauGallery.methods.wrapItemInColumn($(this), options.columns);
        var theTag = $(this).data("gallery-tag");

        if (options.showTags && theTag !== undefined && tagsCollection.indexOf(theTag) === -1) {
          tagsCollection.push(theTag);
        }
      });

      if (options.showTags) {
        $.fn.mauGallery.methods.showItemTags($(this), options.tagsPosition, tagsCollection);
      }

      $(this).fadeIn(500);
    });
  };

  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true
  };

  $.fn.mauGallery.listeners = function (options) {
    $(".gallery-item").on("click", function () {
      if (options.lightBox && $(this).prop("tagName") === "IMG") {
        $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
      } else {
        return;
      }
    });
    $(".gallery").on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);
    $(".gallery").on("click", ".mg-prev", function () {
      return $.fn.mauGallery.methods.prevImage(options.lightboxId);
    });
    $(".gallery").on("click", ".mg-next", function () {
      return $.fn.mauGallery.methods.nextImage(options.lightboxId);
    });
  };

  $.fn.mauGallery.methods = {
    createRowWrapper: function createRowWrapper(element) {
      if (!element.children().first().hasClass("row")) {
        element.append('<div class="gallery-items-row row"></div>');
      }
    },
    wrapItemInColumn: function wrapItemInColumn(element, columns) {
      if (columns.constructor === Number) {
        element.wrap("<div class='item-column mb-4 col-".concat(Math.ceil(12 / columns), "'></div>"));
      } else if (columns.constructor === Object) {
        var columnClasses = "";

        if (columns.xs) {
          columnClasses += " col-".concat(Math.ceil(12 / columns.xs));
        }

        if (columns.sm) {
          columnClasses += " col-sm-".concat(Math.ceil(12 / columns.sm));
        }

        if (columns.md) {
          columnClasses += " col-md-".concat(Math.ceil(12 / columns.md));
        }

        if (columns.lg) {
          columnClasses += " col-lg-".concat(Math.ceil(12 / columns.lg));
        }

        if (columns.xl) {
          columnClasses += " col-xl-".concat(Math.ceil(12 / columns.xl));
        }

        element.wrap("<div class='item-column mb-4".concat(columnClasses, "'></div>"));
      } else {
        console.error("Columns should be defined as numbers or objects. ".concat(_typeof(columns), " is not supported."));
      }
    },
    moveItemInRowWrapper: function moveItemInRowWrapper(element) {
      element.appendTo(".gallery-items-row");
    },
    responsiveImageItem: function responsiveImageItem(element) {
      if (element.prop("tagName") === "IMG") {
        element.addClass("img-fluid");
      }
    },
    openLightBox: function openLightBox(element, lightboxId) {
      $("#".concat(lightboxId)).find(".lightboxImage").attr("src", element.attr("src"));
      $("#".concat(lightboxId)).modal("toggle");
    },
    prevImage: function prevImage() {
      var activeImage = null;
      $("img.gallery-item").each(function () {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          activeImage = $(this);
        }
      });
      var activeTag = $(".tags-bar span.active-tag").data("images-toggle");
      var imagesCollection = [];

      if (activeTag === "all") {
        $(".item-column").each(function () {
          if ($(this).children("img").length) {
            imagesCollection.push($(this).children("img"));
          }
        });
      } else {
        $(".item-column").each(function () {
          if ($(this).children("img").data("gallery-tag") === activeTag) {
            imagesCollection.push($(this).children("img"));
          }
        });
      }

      var index = 0,
          next = null;
      $(imagesCollection).each(function (i) {
        if ($(activeImage).attr("src") === $(this).attr("src")) {
          index = i - 1;
        }
      });
      next = imagesCollection[index] || imagesCollection[imagesCollection.length - 1];
      $(".lightboxImage").attr("src", $(next).attr("src"));
    },
    nextImage: function nextImage() {
      var activeImage = null;
      $("img.gallery-item").each(function () {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          activeImage = $(this);
        }
      });
      var activeTag = $(".tags-bar span.active-tag").data("images-toggle");
      var imagesCollection = [];

      if (activeTag === "all") {
        $(".item-column").each(function () {
          if ($(this).children("img").length) {
            imagesCollection.push($(this).children("img"));
          }
        });
      } else {
        $(".item-column").each(function () {
          if ($(this).children("img").data("gallery-tag") === activeTag) {
            imagesCollection.push($(this).children("img"));
          }
        });
      }

      var index = 0,
          next = null;
      $(imagesCollection).each(function (i) {
        if ($(activeImage).attr("src") === $(this).attr("src")) {
          index = i + 1;
        }
      });
      next = imagesCollection[index] || imagesCollection[0];
      $(".lightboxImage").attr("src", $(next).attr("src"));
    },
    createLightBox: function createLightBox(gallery, lightboxId, navigation) {
      gallery.append("<div class=\"modal fade\" id=\"".concat(lightboxId ? lightboxId : "galleryLightbox", "\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n                <div class=\"modal-dialog\" role=\"document\">\n                    <div class=\"modal-content\">\n                        <div class=\"modal-body\">\n                            ").concat(navigation ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>' : '<span style="display:none;" />', "\n                            <img class=\"lightboxImage img-fluid\" alt=\"Contenu de l'image affich\xE9e dans la modale au clique\"/>\n                            ").concat(navigation ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>' : '<span style="display:none;" />', "\n                        </div>\n                    </div>\n                </div>\n            </div>"));
    },
    showItemTags: function showItemTags(gallery, position, tags) {
      var tagItems = '<li class="nav-item"><span class="nav-link active active-tag"  data-images-toggle="all">Tous</span></li>';
      $.each(tags, function (index, value) {
        tagItems += "<li class=\"nav-item active\">\n                <span class=\"nav-link\"  data-images-toggle=\"".concat(value, "\">").concat(value, "</span></li>");
      });
      var tagsRow = "<ul class=\"my-4 tags-bar nav nav-pills\">".concat(tagItems, "</ul>");

      if (position === "bottom") {
        gallery.append(tagsRow);
      } else if (position === "top") {
        gallery.prepend(tagsRow);
      } else {
        console.error("Unknown tags position: ".concat(position));
      }
    },
    filterByTag: function filterByTag() {
      if ($(this).hasClass("active-tag")) {
        return;
      }

      $(".active.active-tag").removeClass("active active-tag");
      $(this).addClass("active-tag active");
      var tag = $(this).data("images-toggle");
      $(".gallery-item").each(function () {
        $(this).parents(".item-column").hide();

        if (tag === "all") {
          $(this).parents(".item-column").show(300);
        } else if ($(this).data("gallery-tag") === tag) {
          $(this).parents(".item-column").show(300);
        }
      });
    }
  };
})(jQuery);