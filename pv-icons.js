/* Utility glyph set — drawn for this portfolio (24×24 grid, currentColor). */
(() => {
  const G = {
    warn: '<path d="M12 2 23 21H1Z"/><path fill="var(--bg,#fff)" d="M11 9h2v6h-2zM11 16.5h2v2h-2z"/>',
    cross: '<path d="M11 0h2v7h-2zM11 17h2v7h-2zM0 11h7v2H0zM17 11h7v2h-7z"/><path d="M12 6a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/><circle cx="12" cy="12" r="1.4"/>',
    chev: '<path d="M2 5h4l6 7-6 7H2l6-7zM12 5h4l6 7-6 7h-4l6-7z"/>',
    ne: '<path d="M6 4h14v14h-3V9.1L5.1 21 3 18.9 14.9 7H6z"/>',
    star: '<path d="M12 0c.8 6.4 2.6 10.2 12 12-9.4 1.8-11.2 5.6-12 12-.8-6.4-2.6-10.2-12-12C9.4 10.2 11.2 6.4 12 0Z"/>',
    hex: '<path d="M12 1 21.5 6.5v11L12 23l-9.5-5.5v-11Zm0 3.5L5.5 8.2v7.6L12 19.5l6.5-3.7V8.2Z"/><path d="M12 9l2.6 1.5v3L12 15l-2.6-1.5v-3Z"/>',
    target: '<path d="M12 1a11 11 0 1 1 0 22 11 11 0 0 1 0-22Zm0 2a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 3a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/><circle cx="12" cy="12" r="2"/>',
    slashes: '<path d="M4 20 10 4h3L7 20zM10 20l6-16h3l-6 16zM16 20l6-16h2v1l-5.6 15z"/>',
    frame: '<path d="M1 1h7v2.5H3.5V8H1zM16 1h7v7h-2.5V3.5H16zM1 16h2.5v4.5H8V23H1zM20.5 16H23v7h-7v-2.5h4.5z"/><rect x="8" y="8" width="8" height="8"/>',
    globe: '<path d="M12 1a11 11 0 1 1 0 22 11 11 0 0 1 0-22Zm-1 2.1A9 9 0 0 0 3.1 11H7c.1-3.1.8-5.9 1.9-7.9Zm2 0c1.1 2 1.8 4.8 1.9 7.9h3.9A9 9 0 0 0 13 3.1ZM9 11h6c-.2-3.6-1.4-6.3-3-7.7-1.6 1.4-2.8 4.1-3 7.7Zm-5.9 2A9 9 0 0 0 11 20.9c-1.1-2-1.8-4.8-1.9-7.9Zm6 0c.2 3.6 1.4 6.3 3 7.7 1.6-1.4 2.8-4.1 3-7.7Zm7.9 0c-.1 3.1-.8 5.9-1.9 7.9a9 9 0 0 0 7.8-7.9Z"/>',
    orbit: '<path d="M12 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z"/><path d="M12 7C5.9 7 1 9.2 1 12s4.9 5 11 5 11-2.2 11-5-4.9-5-11-5Zm0 2c5 0 9 1.4 9 3s-4 3-9 3-9-1.4-9-3 4-3 9-3Z"/><path d="M6.3 2.8C3.2 4.6 4.2 11 8.5 16.4s9.9 7.9 13 6.1l-1-1.7c-2 1.1-6.6-.8-10.4-5.6S4.7 5.6 6.8 4.5Z"/>',
    diamonds: '<path d="M6 1l5 5-5 5-5-5zM18 1l5 5-5 5-5-5zM6 13l5 5-5 5-5-5zM18 13l5 5-5 5-5-5z"/>',
    bolt: '<path d="M14 0 3 14h7l-2 10 13-15h-7.5z"/>',
    eye: '<path d="M12 5C6 5 1.7 9.6 0 12c1.7 2.4 6 7 12 7s10.3-4.6 12-7c-1.7-2.4-6-7-12-7Zm0 2.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z"/><circle cx="12" cy="12" r="2"/>',
    play: '<path d="M5 2l17 10L5 22z"/>',
    film: '<path d="M2 2h20v20H2Zm2 2v2h2V4Zm14 0v2h2V4ZM4 9v2h2V9Zm14 0v2h2V9ZM4 14v2h2v-2Zm14 0v2h2v-2ZM4 18v2h2v-2Zm14 0v2h2v-2ZM8 4v16h8V4Z"/>',
    node: '<path d="M5 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm14 0a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM12 16a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z"/><path d="M7.4 6.5l4.6 9-1.8.9-4.6-9zM16.6 6.5l1.8.9-4.6 9-1.8-.9zM8 4h8v2H8z"/>',
    chip: '<path d="M6 6h12v12H6Zm3 3v6h6V9Z"/><path d="M8 1h2v4H8zM14 1h2v4h-2zM8 19h2v4H8zM14 19h2v4h-2zM1 8h4v2H1zM1 14h4v2H1zM19 8h4v2h-4zM19 14h4v2h-4z"/>',
    burst: '<path d="M12 0l2.2 6.7L20.5 3.5l-3.2 6.3L24 12l-6.7 2.2 3.2 6.3-6.3-3.2L12 24l-2.2-6.7-6.3 3.2 3.2-6.3L0 12l6.7-2.2-3.2-6.3 6.3 3.2Z"/>',
    disc: '<path d="M12 1a11 11 0 1 1 0 22 11 11 0 0 1 0-22Zm0 7.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"/><circle cx="12" cy="12" r="1.2" fill="var(--bg,#fff)"/>',
    xmark: '<path d="M2 2h5l5 6.5L17 2h5l-7.5 10L22 22h-5l-5-6.5L7 22H2l7.5-10z"/>',
    plus: '<path d="M10 2h4v8h8v4h-8v8h-4v-8H2v-4h8z"/>',
    bars: '<path d="M2 4h2v16H2zM6 4h1v16H6zM9 4h3v16H9zM14 4h1v16h-1zM17 4h2v16h-2zM21 4h1v16h-1z"/>',
    radar: '<path d="M12 2 21.5 8.9 17.9 20H6.1L2.5 8.9Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 6l5 4.6-2 5.4H9l-1.6-6Z"/>',
    stack: '<path d="M12 1 23 6.5 12 12 1 6.5Z"/><path d="M3.3 10.3 12 14.7l8.7-4.4L23 11.5 12 17 1 11.5Z"/><path d="M3.3 15.3 12 19.7l8.7-4.4L23 16.5 12 22 1 16.5Z"/>',
    pen: '<path d="M17 1 23 7 9 21H3v-6Zm0 3.4L5.5 15.9v2.6h2.6L19.6 7Z"/>',
    flow: '<path d="M1 4h7v6H1zM16 14h7v6h-7zM8 6h6v2H8zM12 7h2v10h-2zM12 16h4v2h-4z"/>'
  };
  const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">${Object.entries(G).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join('')}</svg>`;
  document.body.insertAdjacentHTML('afterbegin', sprite);
  window.ICON = (n, cls = '') => `<svg class="ico ${cls}" aria-hidden="true" focusable="false"><use href="#i-${n}"/></svg>`;
  window.ICON_NAMES = Object.keys(G);
})();
