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
`Research Project` items, use the feed:

   /datapress/type/Research%20Project/json

Inserting an Exhibit
--------------------

Datapress adds the [Exhibit Injector](https://github.com/eob/exhibit-injector)
Javascript library to every page on your site. This is a small piece of code
that will help you bootstrap Exhibit entirely from within the `BODY` element.
It also provides helpful methods to help move elements around the page: into
sidebars for example.

Example 1: A Simple Exhibit
----------------------------

TODO
