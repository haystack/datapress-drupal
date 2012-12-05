Datapress for Drupal
====================

Installing the Module
---------------------

In your `modules` directory, type the following command:

    git clone https://github.com/haystack/datapress-drupal.git datapress

Then in the *Modules* section of the Drupal Admin interface, enable
**Datapress**.

Data Feeds
----------

When Datapress is enabled, you can access an Exhibit-style JSON data feed for
any item type by going to:

    /datapress/type/TYPE/json

Where `TYPE` should be replaced by the item type. For example, to see a list of
`Project` items, use the feed:

    /datapress/type/Project/json

When a type is multiple words, use an underscore to combine them. So to see a
list of `Research Project` items, use the feed:

    /datapress/type/Research_Project/json

This data feed will include the following information about each item in the
list:

*  `id`, the node ID
*  `type`, e.g. *Research Project*
*  `label`, e.g. *Cold Fusion*
*  `creator_picture`, A photo of the item creator, if there is one
*  `created`, Unix timestamp of item creation date
*  `body`, The body (page content) of the node
*  `summary`, The summary content of the node
*  `custom.FIELD`, Any custom fields you have defined on the item type

Inserting an Exhibit
--------------------

Datapress adds the [Exhibit Injector](https://github.com/eob/exhibit-injector)
Javascript library to every page on your site. This is a small piece of code
that will help you bootstrap Exhibit entirely from within the `BODY` element.
It also provides helpful methods to help move elements around the page: into
sidebars for example.

To create an Exhibit, first you need to choose **Full HTML** mode when editing
your page. This enables you to type arbitrary HTML into the post. Next, just
wrap the Exhibit you want to create in `<div class="insert-exhibit"></div>`.
Any `link` elements inside there will be moved to the head.

That's it. The examples below cover the finer-grained features.

Example 1: A Simple Exhibit of Drupal Items
-------------------------------------------

To create a simple default Exhibit, with no additional styling, of all
**Research Project** items managed by Drupal, create a page and place this in
its body:

    <div class="insert-exhibit">
       <link href="/datapress/type/Research_Project/json" type="application/json" rel="exhibit/data" />
       <div data-ex-role="viewPanel">
          <div data-ex-role="view" data-ex-viewClass="Tile" data-ex-label="Projects">
          </div>
      </div>
    </div>

That's it. Notice that the datasource `link` element, which Exhibit wants in
the `HEAD`, will get moved there for you by the plugin.

### Drupal and HTML Writing Style

Many Exhibit examples on the web use line breaks *within* HTML elements to make
things look nice, like this: 


    <div data-ex-role="view"
         data-ex-viewClass="Tile"
         data-ex-label="Projects"
    ></div>

**Do not do this in Drupal.** It will confuse Drupal's HTML parser and result
in a page that displays HTML rather than an Exhibit.

Instead, do this:

    <div data-ex-role="view" data-ex-viewClass="Tile" data-ex-label="Projects">
    </div>


Example 2: Putting Facets in the Sidebar
----------------------------------------

Let's say we want a facet, but we don't want it in the narrow content region of
the body. The sidebar area would be much nicer. We need to do two things to
accomplish this.

The first, obviously, is to create a facet. Let's change the Exhibit from
Example 1 to include a text search facet:

    <div class="insert-exhibit">

      <div data-ex-role="facet" data-ex-facet-class="TextSearch" data-ex-facet-label="Search">
      </div>

      <link href="/datapress/type/Research_Project/json" type="application/json" rel="exhibit/data" />
      <div data-ex-role="viewPanel">
        <div data-ex-role="view" data-ex-viewClass="Tile" data-ex-label="Projects">
        </div>
      </div>
    </div>

Blank lines surround the new content above.

The next step is to **move** the facet into the sidebar. I used **Firebug** to
inspect the HTML of my Drupal page and found out that the sidebar has the CSS
class `.sidebar` and the ID `#sidebar-first`.

The plugin wil move any element with special properties. I'll wrap the Facet in
a `DIV` with the following properties:

     <div data-remap="true" data-destination="#sidebar-first" data-offset="append">
     </div>

The final Exhibit HTML now reads:

    <div class="insert-exhibit">

      <div data-remap="true" data-destination="#sidebar-first" data-offset="append">
        <div data-ex-role="facet" data-ex-facet-class="TextSearch" data-ex-facet-label="Search">
        </div>
      </div>

      <link href="/datapress/type/Research_Project/json" type="application/json" rel="exhibit/data" />
      <div data-ex-role="viewPanel">
         <div data-ex-role="view" data-ex-viewClass="Tile" data-ex-label="Projects">
         </div>
      </div>
    </div>

When the Exhibit is created, the Facet will first be moved from its current
location and be appended to the `#sidebar-first` element.
