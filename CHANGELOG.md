# Release notes

This project adheres to Semantic Versioning.

## 3.0.0

- This module is now designed for the upcoming concurrent mode of React. Avoid usin this version for a non concurrent mode React application.
- `setState` is now sync

## 2.0.3

- Fix second argument of `useUnstated` to skip update

## 2.0.2

- Compile to target `es2017` to support Microsoft Edge

## 2.0.1

- Performance improvement: Use a native JS `Set` for `listeners`

## 2.0.0

- `useUnstated` now only accept a single container and return its instance instead of an array.
- `useUnstated` accepts a callback method to skip update.
- `useContainers` has been replaced by `useContainer`

## 1.0.1

- Fix `types` field in `package.json`

## 1.0.0

Initial release 🚀

Differences with main `unstated`:

- Export hooks `useContainers` and `useUnstated`
- Support for react 16.8
- Rewrote to Typescript
