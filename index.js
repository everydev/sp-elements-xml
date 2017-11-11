#! /usr/bin/env node

const FileSystem = require('fs');
const Path = require('path');
const rread = require('readdir-recursive');
const xml = require('xml');
const argv = require('minimist')(process.argv.slice(2));

const files = rread.fileSync(argv.folder).map(file => ({
    File: [{
        _attr: {
            Path: file,
            Url: file,
            ReplaceContent: 'TRUE',
        },
    }],
}));

const elements = [{
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

const result = xml(files, { declaration: true, indent: '\t' });
const elementsXml = xml(elements, { declaration: true, indent: '\t' });

console.log(elementsXml);