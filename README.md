# Aquarium Stats

[![Netlify Status](https://api.netlify.com/api/v1/badges/22455ce2-177c-4815-b907-99337042c6ea/deploy-status)](https://app.netlify.com/sites/frabjous-pony-fe07ea/deploys)


## Deploy

⚠️ The cron job is disabled in GitHub actions, since the Notion data isn't updated very frequently at this point, I might as well intentionally trigger a build.

A deploy can either be triggered in the mobile app, web UI, or via the CLI  with `gh workflow run Deploy-Netlify`

## Roadmap

### Features

- **alerts for water parameters**. Use data for each species to show alert when the parameters go outside of the acceptable range for that species.
- add **plants** and water parameters for plants warnings
- add **schedule of tasks** (when to clean filter, add fertilizer, etc.)

### Improvements

- @doing 👷 Add Eleventy image plugin
  - use with tailwind breakpoints?
  - what DPI to support 1x, 2x, 3x?
- Run the bundled JS through an **minifier**

  - [Add a transform](https://github.com/11ty/eleventy-plugin-bundle?tab=readme-ov-file#modify-the-bundle-output)
  - [Add a minifier](https://www.11ty.dev/docs/quicktips/inline-js/)

- Move keys for notion data to a centralized spot (one source of truth)
- Mark current date in calendars (add [aria-current](https://css-tricks.com/making-calendars-with-accessibility-and-internationalization-in-mind/#comment-1803217))

### Someday

- Should shoelace be served locally?
- Run lighthouse
- Create some webcomponents, based on every layout. I think nord health has some examples.
