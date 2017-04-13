.. _overview:

Overview
========

The Groundwater Hub is a web portal to enable science staff and stakeholders alike to discover, visualize, explore
and publish groundwater-related data set and respective metadata for New Zealand. This portal for 3D and 4D groundwater
information builds upon existing New Zealand and European systems to meet the needs of stakeholders in terms of
open access, interoperability and ease of use.

Our direct stakeholders are: the New Zealand regional councils, Iwi and Maori Groups and in a broader sense
the "community" (community values) in New Zealand – these are the target audience for uptake and our measure,
it must be applied in New Zealand to be successful.

The main goal of this web platform is the dissemination of research outputs, which is
"The act of spreading something, especially information", for the delivery of datasets from other research
as well as corresponding metadata and uncertainties.

Iterative consultation with stakeholders will be undertaken to refine design of web portal and to scope
functionality for 3D data visualisation and transfer solutions. A user-friendly graphical user interface
and platform-independent processing tools will be made available.  It will become a gateway into 3D geological
models and foster consistency in geological mapping terms and interpretation.
If you have any questions, please don't hesitate to contact us via: :ref:`Enquiries: Contact Info <contactinfo>`

.. _scenarios:

Scenarios
---------

- Search, discover, explore, download research outputs and data
- Presentation and Visualisation of research outputs and data
- Publish research outputs and data

Decision maker wants an overview of information on groundwater resource management
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Scenario:
  Govt (MfE, Stats NZ), regional or district council staff looks for ... summary information,
  policy related information, water budgets, water quantity / quality summaries, "capture zones",
  well/groundwater risk areas ...

Related Use Case Packages:
  - :ref:`#ScienceDomainSearch`: THE developed CATEGORIES to guide users through the web interface to list datasets,
    models, reports and case studies as cards for the category search criteria
  - :ref:`#CSWIndexing`: in order to provide the fine-grained retrieval of records based on the categories
  - :ref:`#AccessCheckTracking`

Researcher wants to find groundwater-related information and download datasets
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Scenario:
  Science staff (CRI, University) in a publicly funded context looks for... A groundwater scientist/modeller
  looks for data to feed to his groundwater model tool. She can ...

Related Use Case Packages:
  - :ref:`#ScienceDomainSearch`: THE CATEGORIES, and with spatial and temporal constraints (map search with inline results) and manual choice of query string/keyword search
  - :ref:`#CSWIndexing`
  - :ref:`#AccessCheckTracking`

Consultant wants to find groundwater-related information and download research
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Scenario:
  Consultant looks for in a commercial context... A groundwater scientist/modeller looks for data to
  feed into his groundwater model tool. She can ...

Related Use Case Packages:
  - :ref:`#ScienceDomainSearch`
  - :ref:`#CSWIndexing`
  - :ref:`#AccessCheckTracking`

Full info and links for result items
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Scenario:
  When a user has received results for his/her search, be it in the expert search or domain categories search,
  the results are typically collated in  some form of list (cards, map with list..).
  The user now wishes to explore the single items by clicking on it, now a
  focused presentation of the item (be it a record to a single dataset, report, model or a case study)

Related Use Case Packages:
  - :ref:`#CSWIndexing`
  - :ref:`#AccessCheckTracking`
  - :ref:`#FocusedDataPresi`

Show a Single or multiple spatial Datasets or a Case Study on a map
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Scenario:
  Well, that is, to show a Single Dataset or a Case Study on a map

Related Use Case Packages:
  - :ref:`#CSWIndexing`
  - :ref:`#AccessCheckTracking`
  - :ref:`#FocusedDataPresi`
  - :ref:`#MapViewer`

Plot a Single (or multiple related/comparable) presumably time-series datasets as graphs
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Scenario:
  understand the data offering type in order to retrieve such data and plot graphs (SOS/WaterML2 -> charts viewer)

Related Use Case Packages:
  - :ref:`#CSWIndexing`
  - :ref:`#AccessCheckTracking`
  - :ref:`#FocusedDataPresi`
  - :ref:`#GraphsViewer`

View/visualise a 3D model/scene
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Scenario:
  i.e. understand the data offering as a 3D scene and load it into an appropriate viewer (X3D -> x3dom)

Related Use Case Packages:
  - :ref:`#CSWIndexing`
  - :ref:`#AccessCheckTracking`
  - :ref:`#FocusedDataPresi`
  - :ref:`#3DViewer`

Researcher or science staff wants to publish research outputs (a "dataset")
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Scenario:
  A researcher wants to publish ... the measured water quality data of their groundwater wells...
  They will upload their data files ... They will be supported to provide ISO metadata compliant information and minimal
  description ... also be supported to suggest keywords, ... add BBOX of data files for metadata ...

Related Use Case Packages:
  - :ref:`#UserAuth`:  because they need to login to edit/upload data
  - :ref:`#AddEditMetadataRecord`: add/edit metadata (MD_Metadata)
  - :ref:`#UploadHandleFile`: upload/store/delete a file
  - :ref:`#OWCCollections`: store the references to metadata records and files in own collection list,
    to track ownership and subsequently enable to edit/delete 'own' data

Researcher or science staff wants to publish research outputs (a "report")
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Scenario:
  A researcher wants to publish a science oder consultancy report, best practice white paper,policy advice article,
  one pager/flyer... They will upload their data ...

  They will be supported to provide ISO metadata
  compliant information and minimal description ... also be supported to suggest keywords, ... find BBOX based on place names for metadata ...

Related Use Case Packages:
  - :ref:`#UserAuth`
  - :ref:`#AddEditMetadataRecord`: Type 'dataset', or 'nonGeographicDataset' (e.g. purely text report)
  - :ref:`#UploadHandleFile`
  - :ref:`#OWCCollections`

Researcher or science staff wants to publish research outputs (a "model")
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Scenario:
  Researcher wants to publish a groundwater/hydrological flow model, geological model, conceptual groundwater/geological
  model, rainfall recharge, water budget, ... They will upload their model data files...

  They will be supported to provide ISO metadata compliant information and minimal description ...
  also be supported to generate Process/Procedure/Algorithm metadata ... also be supported to suggest keywords, ...
  find BBOX based on data files  ...

Related Use Case Packages:
  - :ref:`#UserAuth`
  - :ref:`#AddEditMetadataRecord`: Type 'dataset' (3D layer files), 'model', or 'software', 'nonGeographicDataset' (e.g. purely numerical)
  - :ref:`#UploadHandleFile`
  - :ref:`#OWCCollections`

Researcher or science staff wants to publish research outputs (a "case study")
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Scenario:
  Researcher wants to publish a case study ...  they will have to provide a larger textual description/overview (one/two pager),
  preferably with image ... They will be supported to provide ISO metadata compliant information and minimal description ...
  also be supported to link data sets, reports and models into their case study ... also be supported to suggest
  keywords, ... find BBOX for metadata based on place names or data files ...

  They will be supported to generate a collection with all related data sets, reports and models

Related Use Case Packages:
  - :ref:`#UserAuth`
  - :ref:`#AddEditMetadataRecord`: to provide a distinct MD_Metadata record for the case study as a collection of data 'series'
  - :ref:`#UploadHandleFile`
  - :ref:`#OWCCollections`: to create, edit and 'publish specifically crafted collections as case studies

Lead researcher, science staff or manager wants to control who adds data to his case studies
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Scenario:
  As the developer should not be necessary to "administer" the portal once it is "active", users should be able to add
  themselves to the portal.

  However, only "power users", initially manually assigned users, can add other users to their project
  or case study or organisation so other users can add their uploaded data by linking (tagging) it to
  those project, case studies or organisations. The notion of project or case study or organisations as a
  distinct context of collected data and models etc needs to be fleshed out a bit better, but let's assume
  tagging and therefore linking data to such entities needs to be endorsed by some leader/manager/owner
  (initially at least).

  All users can then "apply" on projects, organisations, case studies to be added,
  which needs to be approved by the owning power users (maybe just the owning user actually)

Related Use Case Packages:
  - :ref:`#UserAuth`
  - :ref:`#OWCCollections`
  - :ref:`#DataUserAdmin`: uploaded data belongs always to the user who uploaded and only they can edit/update/delete their
    files and metadata records and case study collections, users can belong to organisations, and members of same
    organisations shall be allowed, too, and some (power) users can define organisation details and member users.
    Users can create organisations and therefore are the first power users of that organisation.

A data owner/publisher wants to know about the usage of his data
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Scenario:
  A user who has previously published groundwater-related data (dataset, reports, models, case studies, collections)
  wants to know, if and how of the data was accessed (viewed/downloaded), preferably by whom/where (geo/region ...)

Related Use Case Packages:
  - :ref:`#UserAuth`
  - :ref:`#OWCCollections`
  - :ref:`#DataUserAdmin`
  - :ref:`#AccessCheckTracking`: When data is searched for, results presented/requested as cards or on map search,
    and from those results download or visualisation or editing is requested from a (web) user then this info
    will be collected so the data/collection owner knows about impact, can be shown together with the s?
    (e.g. views/download). When data is requested for download a disclaimer/License agreement might be to be
    shown and need to be confirmed (by click), this information will also be collected as evidence that the
    user has confirmed the license terms and conditions for the download

.. out-of-scope

Out-of-Scope
------------

This software is developed with a focus on groundwater research and management. This portal will not ...

- Will not reproduce the LAWA website, its data or its functionalities
- No real-time modelling capabilities (it is not a modelling tool)

