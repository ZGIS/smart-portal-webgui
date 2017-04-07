- this is the sphinx docs source folder
- from root dir execute:

sphinx-build -b html src/docs/source sphinx-build

- sphinx-build folder contains index.html and related static html for ReadTheDocs type manuals etc
- you can experiment with the makefile, but leave structure in place
- travis will auto-generate the docs for a GH pages deployment