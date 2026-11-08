/*
 * This file is part of the TYPO3 extension "cache_flush_toilet".
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 */

/**
 * Plays a toilet flush whenever a backend user clicks one of the
 * "clear cache" controls. Runs in the main backend document and also
 * watches the module iframe, which gets a new document on every navigation.
 */

// Every control that clears a cache, as rendered by the TYPO3 core.
const TRIGGERS = [
  // Toolbar "clear cache" menu (lightning bolt), incl. entries added by extensions
  '#typo3-cms-backend-backend-toolbaritems-clearcachetoolbaritem .t3js-toolbar-cache-flush-action',
  // Doc header button in the Page and List modules
  '.t3js-clear-page-cache',
  // Page tree context menu entry
  'typo3-backend-context-menu .context-menu-item[data-contextmenu-id$="clearCache"]',
].join(',');

const LISTENER_OPTIONS = { capture: true };

class FlushSound {
  #audio = null;
  #watchedDocuments = new WeakSet();

  initialize(soundUri) {
    if (this.#audio !== null || typeof Audio === 'undefined') {
      return;
    }
    this.#audio = new Audio(soundUri);
    this.#audio.preload = 'auto';

    this.#watch(document);
    this.#watchModuleFrames();
  }

  #watch(doc) {
    if (!doc || this.#watchedDocuments.has(doc)) {
      return;
    }
    this.#watchedDocuments.add(doc);
    doc.addEventListener('click', (event) => this.#handleClick(event), LISTENER_OPTIONS);
  }

  #watchModuleFrames() {
    // The module iframe is created once and reloaded on every module/page change.
    const attach = (frame) => {
      frame.addEventListener('load', () => this.#watchFrame(frame));
      this.#watchFrame(frame);
    };
    document.querySelectorAll('iframe').forEach(attach);
    new MutationObserver((mutations) => {
      mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLIFrameElement) {
          attach(node);
        } else if (node instanceof Element) {
          node.querySelectorAll('iframe').forEach(attach);
        }
      }));
    }).observe(document.body, { childList: true, subtree: true });
  }

  #watchFrame(frame) {
    try {
      this.#watch(frame.contentDocument);
    } catch {
      // Cross-origin frame: nothing to watch.
    }
  }

  #handleClick(event) {
    // No instanceof check: clicks from the module iframe come from another realm.
    const target = typeof event.target?.closest === 'function' ? event.target.closest(TRIGGERS) : null;
    if (!target ||target.matches(':disabled, .disabled, [aria-disabled="true"]')) {
      return;
    }
    this.#flush();
  }

  #flush() {
    this.#audio.currentTime = 0;
    // Autoplay restrictions or missing audio support must never get in the way.
    this.#audio.play()?.catch(() => {});
  }
}

export default new FlushSound();
