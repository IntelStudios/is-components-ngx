# IntelStudios NGX Components

Requires **Node 24 LTS** and **pnpm 11**. Install with `pnpm install`.

If Volta still runs `pnpm` on Node 22 (`Unsupported engine`), enable first-class pnpm support so it uses this project's pin:

```
export VOLTA_FEATURE_PNPM=1
```

Add that to your shell profile (e.g. `~/.bashrc`). Then `pnpm exec node -v` should print `v24.20.0`.

## Prelaunch step

Make sure to build Demo project's dependencies by running `pnpm run build.local` before launching it.

## Development server

Run `pnpm start` for a dev server. Navigate to `http://localhost:4201/`. The app will automatically reload if you change any of the source files.


## Build project / library

In order to create local NPM package for given project / library run (eg. is-core-ui, is-select etc..)

```
pnpm run build -- --project <project name>
```

## Publish project / library

Find appropriate script within root `package.json`. Make sure you have correct publish keys in your `.npmrc` 

```
pnpm run publish.select
```
