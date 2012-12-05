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
*  `custom.FIELD` Any custom fields you have defined on the item type

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
