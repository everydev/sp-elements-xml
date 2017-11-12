# sp-elements-xml
Generates Elements.xml and SharePointProjectItem.spdata files for use in SharePoint add-ins.

## Usage
`npm i -g sp-elements-xml`
`sp-elements-xml --folder ./build --module ModuleName`

The above will recursively find all files in the `./build` folder and generate Elements.xml and SharePointProjectItem.spdata files. This build folder will then be ready to be copied into a SharePoint module.