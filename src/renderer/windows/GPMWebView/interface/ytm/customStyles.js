const customStyle = document.createElement('style');
let customStyleString = '';

Emitter.on('LoadYTMCustomStyles', (event, styleString) => {
  customStyleString = styleString;
  customStyle.innerHTML = customStyleString;
});

Emitter.fire('FetchYTMCustomStyles');

// Attach the element after the DOM is ready.
window.wait(() => {
  document.head.appendChild(customStyle);
});

