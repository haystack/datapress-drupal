Datapress for Drupal
====================

Datapress for Drupal helps you use the Exhibit visualization framework from within Drupal.

Datapress has three main features:

*  Data feeds for your Drupal data
*  [Exhibit 3](http://www.simile-widgets.org/exhibit3/) Drupal integration.
*  An easy HTML syntax for repositioning Exhibit elements in your Drupal theme. 

Datapress for Drupal is different than [Datapress for
Wordpress](http://projects.csail.mit.edu/datapress) in that it takes a more
HTML-native approach, facilitating use of Exhibit's natural HTML syntax rather
than trying to wrap it with a Wizard.

Installing the Module
---------------------

In your `modules` directory, type the following command:

    git clone https://github.com/haystack/datapress-drupal.git datapress

Then in the *Modules* section of the Drupal Admin interface, enable
**Datapress**.

Data Feeds
----------

Datapress provides two different Exhibit-style data feeds for you to use: one for People and one for Nodes.

### People Data Feeds

The people data feeds are parameterized by the user **role** and accessed by the following URL, relative to your Drupal root URL:

    /datapress/user/role/ROLE/json

When a role has a space in it, use the URL encoded space character, **%20**. For example, if I wanted to get a data feed for all people with the role `principle investigator`, I would use the URL

    /datapress/user/role/principle%20investigator/json

The fields returned for each person by this request are:

Required Exhibit Fields:

*  `id`, the User ID
*  `type`, always equal to *User*
*  `label`, the user name

Fields for Display:

*  `uid`, the User ID
*  `name`, the user name
*  `picture-uri`, the Drupal URI for the user photo. Note: this is a weird data value, e.g.: `public://pictures/picture-2322.png`
*  `picture-filename`, just the filename portion of the `picture-uri`
*  `roles`, an array of the user's roles in the Drupal site

Custom Fields:

*  `custom-FIELD`, for each custom field, a property of this form is added.

### Node Data Feeds

The node data feeds are parameterized by the node **type** and accessed by the following URL, relative to your Drupal root URL:

    /datapress/node/type/TYPE/json

When a role has a space in it, **use an underscore**. *Note that this is different than the case for Users.* Blame Drupal. For example, if I wanted to get a data feed for all nodes with the type `research project`, I would use the URL

    /datapress/node/type/research_project/json

The fields returned for each node by this request are:

Required Exhibit Fields:

*  `id`, the node ID
*  `type`, e.g. *Research Project*
*  `label`, the name of the node, e.g. *Cold Fusion*

Fields for Display:

*  `creator_picture`, A photo of the item creator, if there is one
*  `created`, Unix timestamp of item creation date
*  `body`, The body (page content) of the node
*  `summary`, The summary content of the node

Custom Fields:

*  `custom-FIELD`, for each custom field, a property of this form is added.

Inserting an Exhibit
--------------------

Datapress adds the [Exhibit Injector](https://github.com/eob/exhibit-injector)
Javascript library to every page on your site. This is a small piece of code
that will help you bootstrap Exhibit entirely from within the `BODY` element.
It also provides helpful methods to help move elements around the page:
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
       <div ex:role="viewPanel">
          <div ex:role="view" ex:viewClass="Tile" ex:label="Projects">
          </div>
      </div>
    </div>

That's it. Notice that the datasource `link` element, which Exhibit wants in
the `HEAD`, will get moved there for you by the plugin.

### Drupal and HTML Writing Style

Many Exhibit examples on the web use line breaks *within* HTML elements to make
things look nice, like this: 


    <div ex:role="view"
         ex:viewClass="Tile"
         ex:label="Projects"
    ></div>

**Do not do this in Drupal.** It will confuse Drupal's HTML parser and result
in a page that displays HTML rather than an Exhibit.

Instead, do this:

    <div ex:role="view" ex:viewClass="Tile" ex:label="Projects">
    </div>


Example 2: Putting Facets in the Sidebar
----------------------------------------

Let's say we want a facet, but we don't want it in the narrow content region of
the body. The sidebar area would be much nicer. We need to do two things to
accomplish this.

The first, obviously, is to create a facet. Let's change the Exhibit from
Example 1 to include a text search facet:

    <div class="insert-exhibit">

      <div ex:role="facet" ex:facetClass="TextSearch" ex:facetLabel="Search">
      </div>

      <link href="/datapress/type/Research_Project/json" type="application/json" rel="exhibit/data" />
      <div ex:role="viewPanel">
        <div ex:role="view" ex:viewClass="Tile" ex:label="Projects">
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
        <div ex:role="facet" ex:facetClass="TextSearch" ex:facetLabel="Search">
        </div>
      </div>

      <link href="/datapress/type/Research_Project/json" type="application/json" rel="exhibit/data" />
      <div ex:role="viewPanel">
         <div ex:role="view" ex:viewClass="Tile" ex:label="Projects">
         </div>
      </div>
    </div>

When the Exhibit is created, the Facet will first be moved from its current
location and be appended to the `#sidebar-first` element.
