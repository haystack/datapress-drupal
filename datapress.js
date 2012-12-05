/** 
 * Exhibit Injector.
 *
 * Plugin to help load Exhibit from Javascript-land, after page load.  This is
 * useful in a number of scenarios, such as when loading from inside a hosted
 * environment without access to the head or full page, like Wordpress or
 * Drupal.
 *
 * Features Include:
 *   * Proper coordination with Exhibit events so timing issues don't need
 *     to be considered.
 *   * Ability to remap portions of the Exhibit from one part of the page
 *     (that the author controls) to another part of the page. For example,
 *     a facet might be remapped form inside the blog post body to the sidebar
 *     region of a blog.
 *
 * Dependencies:
 *   * jQuery
 *
 * Example Usage:
 *   * See example.html and example.js, included in the repository.
 *
 * @author Ted Benson (eob@csail.mit.edu)
 */
var ExhibitInjector = { _registryKey: "exhibitInjector" };

/**
 * Implementation for Exhibit Injector.
 */
var ExhibitInjectorImpl = function() {
  var self = this;
  self._type = "exhibitInjectorImpl";
  self._exhibit3url = "http://api.simile-widgets.org/exhibit/3.0.0/exhibit-api.js";

  /**
   * When the Exhibit Injector type is registered, add self as
   * the implementation.
   *
   * Also, we'll move any elements on the page that request to be moved
   * at this point.
   */
  jQuery(document).bind("registerExhibitInjector", function(evt, staticRegistry) {
    staticRegistry.register(ExhibitInjector._registryKey, self._type, self);
    self.MoveElements();
  });

  /**
   * Loads data into an Exhibit using two custom Javascript functions
   * to fetch and prepare. Ensures that the load will take place after
   * Exhibit is ready.
   *
   * @param getDataFunc Function which takes a callback as its argument;
   *                    fetches data, and provides it in JSON form to the
   *                    callback.
   * @param convertFunc Function which takes results from getDataFunc and
   *                    returns Exhibit-style JSON.
   */
  self.LoadData = function(getDataFunc, convertFunc)  {
    jQuery(document).bind("exhibitConfigured.exhibit", function(evt, staticRegistry) {
      getDataFunc(function(json) {
        var exhibitJSON = convertFunc(json);
        console.log("Adding to database", exhibitJSON);
        window.exhibit.getDatabase().loadData(exhibitJSON);
      });
    });
  };

  /**
   * Loads the Exhibit3 Javascript.
   *
   * @param startExhibit Boolean indicating whether to tell Exhibit to autoload or not.
   */
  self.LoadExhibit = function(startExhibit) {
    if (typeof startExhibit == "undefined") {
      startExhibit = true;
    }

    if (startExhibit) {
      self.ImportJavascript(self._exhibit3url);
    } else {
      self.ImportJavascript(self._exhibit3url + "?autoCreate=false");
    }
  };

  /**
   * Adds the provided URL to the HEAD as a script.
   * 
   * @param url The URL of the Javascript to load.
   */
  self.ImportJavascript = function(url) {
    var s = document.createElement('script');
    s.setAttribute('src', url);
    document.getElementsByTagName('body')[0].appendChild(s);
  };

  /**
   * Adds the provided URL to the HEAD as a stylesheet.
   *
   * @param url The URL of the Stylesheet to load.
   */
  self.ImportStylesheet = function(url) {
    var s = document.createElement('link');
    s.setAttribute('href', url);
    s.setAttribute('rel', 'stylesheet');
    s.setAttribute('type', 'text/css');
    document.getElementsByTagName('body')[0].appendChild(s);
  };

  /**
   * Adds the provided URL to the HEAD as an Exhibit JSON link.
   *
   * @param url The URL of the Stylesheet to load.
   */
  self.ImportExhibitJson = function(url) {
    var s = document.createElement('link');
    s.setAttribute('href', url);
    s.setAttribute('rel', 'exhibit/data');
    s.setAttribute('type', 'application/json');
    document.getElementsByTagName('body')[0].appendChild(s);
  }

  /**
   * Moves the source element to an offset of the destination.
   *
   * @param src The source element to move.
   * @param dest The destination element from which offset is specified.
   * @param offset The offset, relative to dest, to place src.
   *               Value should be one of: {replace, before, after,
   *               append, prepend}.
   */
  self.MoveElement = function(srcElem, destElem, offset) {
    if ((typeof srcElem != "undefined") &&
        (typeof destElem != "undefined")) {
      destElem = jQuery(destElem);
      srcElem = jQuery(srcElem);
      srcElem.remove();
      if (offset == "replace") {
        destElem.replaceWith(srcElem);
      } else if (offset == "before") {
        srcElem.insertBefore(destElem);
      } else if (offset == "after") {
        srcElem.insertAfter(destElem);
      } else if (offset == "append") {
        destElem.append(srcElem);
      } else if (offset == "prepend") {
        destElem.prepend(srcElem);
      } else {
        // ERROR
      }
    }
  };

  /**
   * Moves all elements with the data-remap attribute.
   */
  self.MoveElements = function() {
    jQuery.each(jQuery("[data-remap=true]"), function(idx, elem) {
      var dest = elem.getAttribute("data-destination");
      var offset = elem.getAttribute("data-offset");
      var error = false;
      if (typeof offset == "undefined") {
        offset = "after";
      }

      if (typeof dest != "undefined") {
        var destElem = jQuery(dest);
        if (destElem.length == 1) {
          self.MoveElement(elem, destElem[0], offset);
        } else {
          // Error case
          // Do nothing
        }
      } else {
        // Error case
        // Do nothing at present..
      }
    });
  };
};

/**
 * Bind registration of ExhibitInjector to Exhibit3's register static component phase.
 */
jQuery(document).bind("registerStaticComponents.exhibit", function(evt, staticRegistry) {
  if (!staticRegistry.hasRegistry(ExhibitInjector._registryKey)) {
    staticRegistry.createRegistry(ExhibitInjector._registryKey);
    jQuery(document).trigger("registerExhibitInjector", staticRegistry);
  }
});

/**
 * This is the beginning of the Drupal-specific code
 * -------------------------------------------------
 */
jQuery(function() {
  // On page load, look for any .insert-exhibit DIVs
  var foundSome = false;
  console.log("Running");
  jQuery.each(jQuery('.insert-exhibit'), function(idx, elem) {
    console.log("Found Exhibit");
    var e = jQuery(elem);
    // Move any links into the head
    e.find('link').remove().appendTo(jQuery('head'));
    foundSome = true;
  });
  if (foundSome) {
    console.log("Found some");
    // Now start up the Exhibit loader
    window.exhibitInjector = new ExhibitInjectorImpl();
    window.exhibitInjector.LoadExhibit();
  }
});
