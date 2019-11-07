# Vue PWA asset generator

This package creates for you all the default assets used in a VueJS app with PWA plugin as well as a manifest JSON with the `icons` attribute set.

## install

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
