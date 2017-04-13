.. _usecases:

Detailed descriptions of the functionality
==========================================

.. _#UserAuth:

#UserAuth
---------

#1 - Login Screen
  Summary: Anonymous user can login using a login screen providing username and password.

#2 - Log-off Button
  Summary: Authenticated user can log-off using a "logoff button".

#3 - Update profile
  Summary: Authenticated users can change / provide user information (profile)

#4 - Change password
  Summary: Authenticated users can change their password

#5 - Reset password
  Summary: Anonymous but registered users can reset their password by providing their username / email address

#6 - Register account
  Summary: Anonymous users can register an account

#7 - Anonymous users can register and login using Google OAuth2
  Summary: <short phrase/sentence>.

.. _#CSWIndexing:

#CSWIndexing
------------

#10 - Lucene/Angular Google type search and display underpinning all searches/discovery paths
  Summary: <short phrase/sentence>.

#11 - List of catalogues "configurable" (at least config file),  BBOX only in WGS84
  Summary: <short phrase/sentence>.

#12 - ingest MD_Metadata, keep track of originating catalog and the uuid
  Summary: <short phrase/sentence>.

#13 - Return search results as GeoJson feature collection
  Summary: <short phrase/sentence>.

#14 - index search with lucene text field query
  Summary: <short phrase/sentence>.

#15 - index search with spatial BBOX filter  (intersect? vs include?)
  Summary: <short phrase/sentence>.

#16 - index search with temporal from-to period filter (intersect? vs include?)
  Summary: <short phrase/sentence>.

#17 - All users can search the catalogues by using a search mask (simple, advanced) and retrieve lists of items (documents, datasets)
  Summary: <short phrase/sentence>.

.. _#OWCCollections:

#OWCCollections
---------------

#20 - need a OWC doc store, users are owning OWC docs
  Summary: <short phrase/sentence>.

#21 - all uploaded/created resources (datasets, models, case studies) should also trigger OWC documents
  Summary: <short phrase/sentence>.

#22 - editing OWC doc collections in webgui (user collections, case studies) and store them with user info
  Summary: <short phrase/sentence>.

#23 - JavaScript/TypeScript parser for OWC GeoJSON documents webgui (user collections, case studies)
  Summary: <short phrase/sentence>.

#24 - a java/scala parser OWC GeoJSON documents, for "framework" and API
  Summary: <short phrase/sentence>.

#25 - Authenticated Users can edit/update their case studies
  Summary: <short phrase/sentence>.

#26 - Users can find data on the portal; and in other New Zealand catalogues, and add dataset references to their collections
  Summary: <short phrase/sentence>.

.. _#AddEditMetadataRecord:

#AddEditMetadataRecord
----------------------

.. _publish-workflow-figure:

.. figure:: _static/publish-workflow.png
  :width: 80%

  A basic publish workflow, read from top, flow links are currently missing

#30 - Authenticated Users can add metadata records through the webgui,
  Summary: <short phrase/sentence>.

#31 - SMART data sets, models, case studies etc are tagged with a specific keyword list, aka The Groundwater Data Categories
  Summary: <short phrase/sentence>.

#32 - Authenticated Users can edit MD_Metadata record, only own (or member org)
  Summary: <short phrase/sentence>.

#33 - MD_Metadata records retrieve, add and update to CSW from backend
  Summary: <short phrase/sentence>.

.. _#ScienceDomainSearch:

#ScienceDomainSearch
--------------------

#40 - all users can "discover" data from the catalogues through the "visual ui categories"
  Summary: <short phrase/sentence>.

#41 - search results lists are presented as "cards", with or without spatial hint/map, ordered by (? category type, metadata record type)
  Summary: <short phrase/sentence>.

#42 - list of index fields to be defined, "category list" awareness (filter also based on keywords and related dictionary/list)
  Summary: <short phrase/sentence>.

#43 - support multiple keyword list and be able to filter distinctive if keywords from that particular list are documented in the metadata record
  Summary: <short phrase/sentence>.

.. _#FocusedDataPresi:

#FocusedDataPresi
-----------------

#50 - frontend Angular(2), JSON Api, should be easily usable from mobile, too, thus, ideally no server-side view rendering from Play
  Summary: <short phrase/sentence>.

#51 - this single representation of datasets, models, reports, case studies, with contextual article text and images, like a blog/one-two pager thing
  Summary: <short phrase/sentence>.

#52 - this single representation has link for download of datasets and metadata in their respective formats
  Summary: <short phrase/sentence>.

#53 - single dataset, case study etc should be addressable with a permalink and have "nice and appropriate" html representation
  Summary: <short phrase/sentence>.

#54 - the "addressable resource" should possibly always a OWC document, aka the collections (GeoJSON or ATOM or both with content negotiation)
  Summary: <short phrase/sentence>.

#55 - single item by item or from OWC collections, like shopping carts delegating to mapviewer, graphs, 3D
  Summary: <short phrase/sentence>.

.. _#UploadHandleFile:

#UploadHandleFile
-----------------

#60 - Authenticated Users can upload files (datasets, reports ...) and keep reference in own collection
  Summary: <short phrase/sentence>.

#61 - where do file uploads go: Google buckets, app keeps uuid and filename in DB
  Summary: <short phrase/sentence>.

#62 - need upload wizard procedure that (small files) can derive supporting info to prefill the metadata editor
  Summary: <short phrase/sentence>.

#63 - Authenticated Users can edit/update their files
  Summary: <short phrase/sentence>.

.. _#AccessCheckTracking:

#AccessCheckTracking
--------------------

#70 - download need to confirm a "license terms" dialog
  Summary: <short phrase/sentence>.

#71 - records/datasets should be exposed to a sitemap so it can be found from google (open up data for "deep" search)
  Summary: <short phrase/sentence>.

#72 - Analytics/download tracking to be able report popularity of datasets (report impact of science)
  Summary: <short phrase/sentence>.

.. _#MapViewer:

#MapViewer
----------

#80 - Users can view data on maps, legends, attribute tables/featureinfo, sourced from OWC with link to MD_Metadata
  Summary: <short phrase/sentence>.

#81 - Cross-Origin Resource Sharing (CORS)
  Summary: CORS policy must work from mapviewer, from x3dviewer and from our sources from our servers

#82 - GetFeatureInfo Proxy for collecting FeatureInfo for multiple layers from multiple servers?
  Summary: <short phrase/sentence>.

#83 - WMS module (get WMS link out of MD_Metadata record and draw on OL3 map)
  Summary: <short phrase/sentence>.

#84 - WFS module (get WFS link out of MD_Metadata record and draw simple feature on OL3 map)
  Summary: <short phrase/sentence>.

.. _#GraphsViewer:

#GraphsViewer
-------------

#90 - Users can view data as graphs/charts, or as tables, sourced from OWC with link to MD_Metadata
  Summary: <short phrase/sentence>.

#91 - SOS module - basic
  Summary: <short phrase/sentence>.

#92 - SOS module - extended
  Summary: <short phrase/sentence>.

.. _#3DViewer:

#3DViewer
---------

#100 - Users can view data as 3D, or as tables, sourced from OWC with link to MD_Metadata
  Summary: <short phrase/sentence>.

#101 - this single representation provides 3D view, maybe inline and expandable to fullscreen or in new window
  Summary: <short phrase/sentence>.

.. _#DataUserAdmin:

#DataUserAdmin
--------------

#110 - Admin users can "add" users to their project, organisation, case study to add their upload data to these entities
  Summary: <short phrase/sentence>.

#111 - users can add case studies, thus own them and decide who can add data to them
  Summary: <short phrase/sentence>.

.. _#TemplateUseCase:

#Template Use Case
------------------

- Summary: <short phrase/sentence>.
- Rationale: <max. paragraph context, explanation>.
- <possibly sketch/dia/frame>
- Users: <users>
- Preconditions: <list of <short phrase/sentence>>.
- Basic Course of Events: <enumerated list of <short phrase/sentence>>.
- Alternative Paths: <enumerated list of <short phrase/sentence>>.
- Postconditions: <itemised list of <short phrase/sentence>>.
