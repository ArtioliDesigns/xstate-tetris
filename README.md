# XStateWidgets

Projects to house multiple xstate widgets. Angular Elements built with standalone components. 

The base element comes out to around 41k! (Before images, service, forms, etc)

Clients will just need to include in their `<head>`

```html
<script src='https://xstate-tetris.pages.dev/dist/xstate-tetris.js'></script>
```

and then can use:

```html
<xstate-tetris></xstate-tetris>
```

## Quick Start

```bash
npm install
npm start
```

## Build

```bash
npm build
## test locally
npm serve
```

## Stats

```bash
npm run stats:checkout
```

## Web Components

<https://webcomponents.dev/blog/all-the-ways-to-make-a-web-component/>

## Add a new project

```bash
export NEW_NG_APP=checkout
ng generate application $NEW_NG_APP
ng generate component --standalone --project --view-encapsulation ShadowDom $NEW_NG_APP
```

Then:

- modify new tsconfig.app.json in `projects/NEW_NG_APP` to extend `tsconfig.base.json`
- Delete unnecesary files. (See checkout)
- Make any updates to angular.json
- Add in scripts for new project in package.json

## Midjourney

prompt: orlando florida tetris blocks logo without text vibrant colors

<https://discord.com/channels/662267976984297473/981697533858414652/1066387740813447259>

prompt: blocks in groups of 4 looking like tetrominoes used as a logo with vibrant colors in the theme of orlando florida

<https://discord.com/channels/662267976984297473/990816789246124032/1066389773989711913>

upscale: 
<https://discord.com/channels/662267976984297473/990816789246124032/1066390626347790377>
