(function() {
  $ = function(selector) {};

  /**
   * Copy properties from object into target. Only works with primitives, arrays,
   * and objects. Recursive deep copy for objects, clone arrays. For objects
   * containing built-in JS objects use library method, e.g. _.deepCopy().
   * 
   * Merge object into target object with recursive deep copy.
   * 
   * @param {Object} target   Object to be merged into
   * @param {Object} object   Object to merge into target
   * @return {Object}   Target object with merged properties
   */
  $.extend = function(target, object) {
    for (var prop in object) {
      if (typeof object[prop] !== "object") {
        target[prop] = object[prop];
      } else if (typeof object[prop] === "object" && object[prop] instanceof Array) {
        target[prop] = [...object[prop]];
        target[prop].forEach(elem => {
          if (typeof elem === "object") return $.extend(elem);
        });
      } else {
        return $.extend(prop, object[prop]);
      }

      return target;
    }
  };

  // Static methods
  var isArrayLike = function(obj) {};

  $.extend($, {
    isArray: function(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    },
    each: function(collection, cb) {},
    makeArray: function(arr) {},
    proxy: function(fn, context) {}
  });

  $.extend($.prototype, {
    html: function(newHtml) {},
    val: function(newVal) {},
    text: function(newText) {},
    find: function(selector) {},
    next: function() {},
    prev: function() {},
    parent: function() {},
    children: function() {},
    attr: function(attrName, value) {},
    css: function(cssPropName, value) {},
    width: function() {},
    offset: function() {
      var offset = this[0].getBoundingClientRect();
      return {
        top: offset.top + window.pageYOffset,
        left: offset.left + window.pageXOffset
      };
    },
    hide: function() {},
    show: function() {},

    // Events
    bind: function(eventName, handler) {},
    unbind: function(eventName, handler) {},
    has: function(selector) {
      var elements = [];
	
      $.each(this, function(i, el) {
        if(el.matches(selector)) {
          elements.push(el);
        }
      });
    
      return $( elements );
    },
    on: function(eventType, selector, handler) {
      return this.bind(eventType, function(ev){
        var cur = ev.target;
        do {
          if ($([ cur ]).has(selector).length) {
            handler.call(cur, ev);
          }
          cur = cur.parentNode;
        } while (cur && cur !== ev.currentTarget);
      });
    },
    off: function(eventType, selector, handler) {},
    data: function(propName, data) {},

    // Extra
    addClass: function(className) {},
    removeClass: function(className) {},
    append: function(element) {}
  });

  $.buildFragment = function(html) {};
})();
