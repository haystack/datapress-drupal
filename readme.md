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

