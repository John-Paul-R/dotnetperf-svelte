
/**
 * @roxi/routify 2.18.4
 * File generated Sun Feb 13 2022 12:34:06 GMT-0500 (Eastern Standard Time)
 */

export const __version = "2.18.4"
export const __timestamp = "2022-02-13T17:34:06.987Z"

//buildRoutes
import { buildClientTree } from "@roxi/routify/runtime/buildRoutes"

//imports


//options
export const options = {}

//tree
export const _tree = {
    "name": "root",
    "filepath": "/",
    "root": true,
    "ownMeta": {},
    "absolutePath": "src/pages",
    "children": [
        {
            "isFile": true,
            "isDir": false,
            "file": "BenchTable.svelte",
            "filepath": "/BenchTable.svelte",
            "name": "BenchTable",
            "ext": "svelte",
            "badExt": false,
            "absolutePath": "S:/Workspaces/Projects/dotnetperf-svelte/src/pages/BenchTable.svelte",
            "importPath": "../src/pages/BenchTable.svelte",
            "isLayout": false,
            "isReset": false,
            "isIndex": false,
            "isFallback": false,
            "isPage": true,
            "ownMeta": {},
            "meta": {
                "recursive": true,
                "preload": false,
                "prerender": true
            },
            "path": "/BenchTable",
            "id": "_BenchTable",
            "component": () => import('../src/BenchTable.svelte').then(m => m.default)
        },
        {
            "isFile": true,
            "isDir": false,
            "file": "index.svelte",
            "filepath": "/index.svelte",
            "name": "index",
            "ext": "svelte",
            "badExt": false,
            "absolutePath": "S:/Workspaces/Projects/dotnetperf-svelte/src/pages/index.svelte",
            "importPath": "../src/pages/index.svelte",
            "isLayout": false,
            "isReset": false,
            "isIndex": true,
            "isFallback": false,
            "isPage": true,
            "ownMeta": {},
            "meta": {
                "recursive": true,
                "preload": false,
                "prerender": true
            },
            "path": "/index",
            "id": "_index",
            "component": () => import('../src/pages/index.svelte').then(m => m.default)
        }
    ],
    "isLayout": false,
    "isReset": false,
    "isIndex": false,
    "isFallback": false,
    "meta": {
        "recursive": true,
        "preload": false,
        "prerender": true
    },
    "path": "/"
}


export const { tree, routes } = buildClientTree(_tree)

