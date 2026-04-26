// ==UserScript==
// @id             iitc-plugin-dev-url-loader
// @name           IITC plugin: Dev URL Loader
// @category       Dev
// @version        0.1.0
// @description    Load another IITC plugin from a configurable URL for development
// @include        https://intel.ingress.com/*
// @include        https://intel-x.ingress.com/*
// @match          https://intel.ingress.com/*
// @match          https://intel-x.ingress.com/*
// @grant          none
// ==/UserScript==

function wrapper(plugin_info) {
  'use strict';

  const PLUGIN_ID = 'devUrlLoader';
  const STORAGE_KEY = 'iitc-dev-url-loader-url';

  window.plugin = window.plugin || {};
  window.plugin[PLUGIN_ID] = window.plugin[PLUGIN_ID] || {};

  const self = window.plugin[PLUGIN_ID];

  function getUrl() {
    return localStorage.getItem(STORAGE_KEY) || '';
  }

  function setUrl(url) {
    localStorage.setItem(STORAGE_KEY, url || '');
  }

  function withCacheBuster(url) {
    const sep = url.indexOf('?') === -1 ? '?' : '&';
    return url + sep + 'iitc_dev_ts=' + Date.now();
  }

  function loadUrl() {
    const url = getUrl().trim();

    if (!url) {
      console.log('[Dev URL Loader] no URL configured');
      return;
    }

    const script = document.createElement('script');
    script.src = withCacheBuster(url);
    script.async = false;

    script.onload = function () {
      console.log('[Dev URL Loader] loaded:', url);
    };

    script.onerror = function () {
      console.error('[Dev URL Loader] failed:', url);
      alert('Dev URL Loader failed to load:\n' + url);
    };

    document.body.appendChild(script);
  }

  function configure() {
    const current = getUrl();
    const next = prompt(
      'Dev plugin URL:',
      current || 'http://YOUR-FEDORA-IP:8000/driving-route.user.js'
    );

    if (next === null) return;

    setUrl(next.trim());
    alert('Saved dev plugin URL.\nReload IITC to load it.');
  }

  function clearUrl() {
    setUrl('');
    alert('Dev plugin URL cleared.\nReload IITC.');
  }

  function setup() {
    self.getUrl = getUrl;
    self.setUrl = setUrl;
    self.loadUrl = loadUrl;
    self.configure = configure;
    self.clearUrl = clearUrl;

    if (window.pluginCreateHook) {
      // no-op; just being polite if IITC has helper APIs
    }

    if (window.toolbox) {
      $('<a>')
        .text('Dev URL Loader')
        .attr('title', 'Configure dev plugin URL')
        .on('click', configure)
        .appendTo(window.toolbox);
    }

    loadUrl();
  }

  setup.info = plugin_info;

  if (!window.bootPlugins) window.bootPlugins = [];
  window.bootPlugins.push(setup);

  if (window.iitcLoaded) setup();
}

var script = document.createElement('script');
var info = {};

if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
  info.script = {
    version: GM_info.script.version,
    name: GM_info.script.name,
    description: GM_info.script.description
  };
}

script.appendChild(document.createTextNode(
  '(' + wrapper + ')(' + JSON.stringify(info) + ');'
));

(document.body || document.head || document.documentElement).appendChild(script);
