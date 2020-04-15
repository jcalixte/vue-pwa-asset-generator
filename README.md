# Vue PWA asset generator

![npm](https://img.shields.io/npm/v/vue-pwa-asset-generator?style=for-the-badge)
![npm](https://img.shields.io/npm/dm/vue-pwa-asset-generator?style=for-the-badge)

_TLDR_ :

```
npx vue-pwa-asset-generator -a {your_512x512_source_png} -o {your_output_folder}
```

This package creates for you all the default assets used in a VueJS app with PWA plugin as well as a manifest JSON with the `icons` attribute set.

## install

You can use npx as shown above or you can install it globally:

```
npm install --global vue-pwa-asset-generator
```

or

```
yarn global add vue-pwa-asset-generator
```

## Usage

VueJS PWA asset generator has a `vue-asset-generate` command with two parameters :

- `-a` is your input asset in PNG (FYI, the largest image is a 512x512 png image).
- `-o` output folder (created if it does not exist).

## Example

`vue-asset-generate -a logo.png -o img`

## I'm using the plugin for pwa where do I put my manifest json?

You can configurate your pwa from the `vue.config.js` file.

Here an example how you can merge the `manifest.json` created and your config file:

```js
module.exports = {
  // ... other configurations
  pwa: {
    themeColor: "#130f40",
    msTileColor: "#130f40",
    name: "My app",
    manifestOptions: {
      icons: [
        {
          src: "./img/icons/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "./img/icons/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "./img/icons/apple-touch-icon-60x60.png",
          sizes: "60x60",
          type: "image/png",
        },
        {
          src: "./img/icons/apple-touch-icon-76x76.png",
          sizes: "76x76",
          type: "image/png",
        },
        {
          src: "./img/icons/apple-touch-icon-120x120.png",
          sizes: "120x120",
          type: "image/png",
        },
        {
          src: "./img/icons/apple-touch-icon-152x152.png",
          sizes: "152x152",
          type: "image/png",
        },
        {
          src: "./img/icons/apple-touch-icon-180x180.png",
          sizes: "180x180",
          type: "image/png",
        },
        {
          src: "./img/icons/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
        {
          src: "./img/icons/favicon-16x16.png",
          sizes: "16x16",
          type: "image/png",
        },
        {
          src: "./img/icons/favicon-32x32.png",
          sizes: "32x32",
          type: "image/png",
        },
        {
          src: "./img/icons/msapplication-icon-144x144.png",
          sizes: "144x144",
          type: "image/png",
        },
        {
          src: "./img/icons/mstile-150x150.png",
          sizes: "150x150",
          type: "image/png",
        },
      ],
    },
  },
};
```
