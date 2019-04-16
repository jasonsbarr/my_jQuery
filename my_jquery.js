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
    const objectIsArray = Object.prototype.toString.call(object) === '[object Array]';
    for (var prop in object) {
      if (typeof object[prop] !== 'object' && object.hasOwnProperty(prop)) {
        target[prop] = object[prop];
      } else if (Object.prototype.toString.call(object[prop]) === '[object Array]') {
        target[prop] = [...object[prop]];
      } else {
        return $.extend(prop, object[prop]);
      }
    }
    return target;
  };

  // Static methods
  var isArrayLike = function(obj) {
    return typeof obj.length === 'number' && obj.length - 1 in obj;
  };

  $.extend($, {
    isArray: function(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    },
    each: function(collection, cb) {
      if (isArrayLike(collection)) {
        for (let i = 0; i < collection.length; i++) {
          let value = collection[i];
          cb.call(value, i, value);
        }
      } else {
        for (let prop in collection) {
          if (collection.hasOwnProperty(prop)) {
            let value = collection[prop]
            cb.call(value, prop, value);
          }
        }
      }
      return collection;
    },
    /**
     * Takes array-like object and returns an array with the same elements
     * 
     * @param {Object} arr  an array-like object
     * @return {Array} array
     */
    makeArray: function(arr) {
      return isArrayLike(arr) ? [...arr] : false;
    },
    /**
     * Bind context to function so it can be invoked in the context of another object
     * 
     * @param {Function} fn the function to proxy
     * @param {Object} context the object to apply as this
     */
    proxy: function(fn, context) {
      return function() {
        return fn.apply(context, [...arguments]);
      }
    }
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
