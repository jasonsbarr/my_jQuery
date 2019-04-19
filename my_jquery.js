(function() {
  /**
   * Create $ object as a wrapper for DOM elements
   * 
   * @param {String|Array} selector CSS selector or array of Nodes
   * @return {Object}
   */
  $ = function(selector) {
    if (!(this instanceof $)) return new $(selector);

    /**
     * @constant
     * @type {NodeList|Array}
     */
    const elements = (typeof selector === 'string') ?
      document.querySelectorAll(selector) : selector;

    this.length = 0;
    Array.prototype.push.apply(this, elements);
    this.length = elements.length;

    return this;
  };

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
      if (typeof object[prop] !== 'object' && object.hasOwnProperty(prop)) {
        target[prop] = object[prop];
      } else if (Object.prototype.toString.call(object[prop]) === '[object Array]') {
        target[prop] = [...object[prop]];
      } else {
        return $.extend(target[prop], object[prop]);
      }
    }
    return target;
  };

  // Static methods
  /**
   * Check if object is array-like
   * 
   * @param {Object} obj object to check
   * @return {Boolean}
   */
  var isArrayLike = function(obj) {
    return typeof obj.length === 'number' && obj.length - 1 in obj;
  };

  $.extend($, {
    /**
     * Check if object is array
     * 
     * @param {Object} obj object to check if is array
     * @return {Boolean}
     */
    isArray: function(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    },
    /**
     * Iterate over an object or array and apply a function to transform each element
     * 
     * @param {Object|Array} collection object or array to iterate over
     * @param {Function} cb function to transform each element of collection
     * @return {Object|Array} transformed object or array
     */
    // TODO: operate on copy of object/array instead of mutating original
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

  const getText = function(el) {
    let txt = '';
    $.each(el.childNodes, (_, child) => {
      txt += (child.nodeType === Node.TEXT_NODE) ? child.nodeValue :
        (child.nodeType === Node.ELEMENT_NODE) ? getText(child) : '';
    });
    return txt;
  };

  $.extend($.prototype, {
    html: function(newHtml) {
      if (!arguments.length) return this[0] && this[0].innerHTML;

      return $.each(this, (_, el) => el.innerHTML = newHtml);
    },
    val: function(newVal) {
      if (!arguments.length) return this[0] && this[0].value;

      return $.each(this, (_, input) => input.value = newVal);
    },
    text: function(newText) {
      if(arguments.length) {
        this.html('');
        return $.each(this, (_, el) => {
          el.textContent = newText;
        });
      } else {
        return this[0] && getText(this[0]);
      }
    },
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
