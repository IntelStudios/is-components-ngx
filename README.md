# IntelStudios NGX Components


## Prelaunch step

Make sure to build Demo project's dependencies by running `npm run build.local` before launching it.

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4201/`. The app will automatically reload if you change any of the source files.


## Build project / library

In order to create local NPM package for given project / library run (eg. is-core-ui, is-select etc..)

```
npm run build -- --project <project name>
```

## Publish project / library

Find appropriate script within root `package.json`. Make sure you have correct publish keys in your `.npmrc` 

```
npm run publish.select
```
