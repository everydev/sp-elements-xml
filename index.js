#! /usr/bin/env node

const FileSystem = require('fs');
const Path = require('path');
const rread = require('readdir-recursive');
const xml = require('xml');
const argv = require('minimist')(process.argv.slice(2));
const shell = require('shelljs');

const getFileOnly = path => toNormalPath(path).split('/').slice(-1);
const getPathOnly = path => toNormalPath(path).split('/').slice(0, -1).join('/') + '/';
const dropTopFolder = path => toNormalPath(path).split('/').length ? toNormalPath(path).split('/').slice(1).join('/') : toNormalPath(path);
const toWindowsPath = path => toNormalPath(path).replace(/\//g, '\\');
const toNormalPath = path => path.replace(/\\/g, '/');

let files, elements, result;

//////////////////
// Elements.xml //
//////////////////

files = rread.fileSync(argv.folder).map(file => ({
    File: [{
        _attr: {
            Path: `${argv.module}\\${toWindowsPath(dropTopFolder(file))}`,
            Url: `${argv.module}/${dropTopFolder(file)}`,
            ReplaceContent: 'TRUE',
        },
    }],
}));

elements = [{
    Elements: [
        {
            _attr: {
                xmlns: 'http://schemas.microsoft.com/sharepoint/'
            }
        },
        {
            Module: files.concat({
                _attr: {
                    Name: argv.module 
                }
            })
        }
    ]
}];

result = xml(elements, { declaration: true });

shell.ShellString(result).to(argv.folder + '/Elements.xml');

//////////////////////////////////
// SharePointProjectItem.spdata //
//////////////////////////////////

files = rread.fileSync(argv.folder).map(file => ({
    ProjectItemFile: [{
        _attr: {
            Source: toWindowsPath(dropTopFolder(file)),
            Target: `${argv.module}\\${toWindowsPath(dropTopFolder(getPathOnly(file)))}`,
            Type: getPathOnly(file) === 'Elements.xml' ? 'ElementManifest' : 'ElementFile',
        },
    }],
}));

elements = [{
    ProjectItem: [
        {
            _attr: {
                xmlns: 'http://schemas.microsoft.com/VisualStudio/2010/SharePointTools/SharePointProjectItemModel',
                DefaultFile: 'Elements.xml',
                SupportedTrustLevels: 'All',
                SupportedDeploymentScopes: 'Web, Site',
                Type: 'Microsoft.VisualStudio.SharePoint.Module',
            }
        },
        {
            Files: files,
        }
    ]
}];

result = xml(elements, { declaration: true });

shell.ShellString(result).to(argv.folder + '/SharePointProjectItem.spdata');