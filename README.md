# Cache Flush Toilet

<img src="Resources/Public/Icons/Extension.svg" alt="Extension icon: a toilet with a lightning bolt on the cistern" width="64" height="64" align="right">

A TYPO3 extension that plays a toilet flush whenever a backend user clears
the cache. That is all it does. It is a joke, built properly.

## What it does

The sound plays the moment you click one of these controls in the backend:

- **Toolbar "Clear cache" menu** (lightning bolt icon), every entry,
  including entries added by other extensions
- **Page tree context menu**, "Clear cache for this page"
- **"Clear cache" button** in the doc header of the Page and List modules

It works for every backend user who is allowed to use these controls, in
every application context. Clearing the cache itself is not touched: the
core does its job and shows its usual notification, the extension only
adds the sound.

## What it deliberately does not do

- No sound in Admin Tools > Maintenance ("Flush TYPO3 and PHP Cache") or
  the standalone Install Tool
- No sound for cache flushes on the command line, by the scheduler or
  during deployment
- Nothing in the frontend
- No settings, no off switch. Everyone hears it. Consider your colleagues
  in an open-plan office before installing.

## Requirements

- TYPO3 14.3
- PHP 8.2 or later

## Installation

```bash
composer require wwagner/cache-flush-toilet
```

No database changes, no configuration. Clear the caches once after
installation (you will hear whether it worked).

To get rid of it again:

```bash
composer remove wwagner/cache-flush-toilet
```

## How it works

A small JavaScript module is loaded into the main backend document. It
listens for clicks on the cache controls listed above, both in the main
document and in the module frame, and plays the sound straight from the
click. Because the sound starts from a user interaction, browsers do not
block it as autoplay. If a browser refuses to play it anyway, nothing
happens apart from the missing sound.

The controls are recognised by the markup the TYPO3 core renders. A future
core version that changes this markup may silence the extension until it
is updated.

## Sound

The flush sound was generated with Magnific AI (Pikaso AI sound effects).

## Licence

GPL-2.0-or-later, see [LICENSE](LICENSE).
