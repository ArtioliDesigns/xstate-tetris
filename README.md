# XStateWidgets

Projects to house multiple xstate widgets. Angular Elements built with standalone components. 

The base element comes out to around 41k! (Before images, service, forms, etc)

Clients will just need to include in their `<head>`

```html
<script src='https://domain/js/some-widget.js'></script>
```

and then can use:

```html
<some-widget input='12345'><some-widget>
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