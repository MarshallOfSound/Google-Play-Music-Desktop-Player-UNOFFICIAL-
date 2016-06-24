window.showToast = function (text, dismissable, buttonText, buttonColor, buttonEventFunction, postCreationFunction) { // eslint-disable-line
  const toast = document.createElement('paper-toast');
  toast.setAttribute('text', text);
  toast.duration = 0;
  toast.noCancelOnOutsideClick = dismissable;
  toast.style.marginBottom = '102px';
  const button = document.createElement('a');
  button.innerHTML = buttonText;
  button.style.color = buttonColor;
  button.style.margin = '0';
  button.style.padding = '0';
  button.style.marginLeft = '10px';
  button.style.cursor = 'pointer';
  button.addEventListener('click', (event) => {
    buttonEventFunction(event, toast, button);
  });
  toast.appendChild(button);
  document.body.appendChild(toast);
  toast.show();
  postCreationFunction(toast, button);
};

window.showBasicToast = function (text) { // eslint-disable-line
  const toast = document.createElement('paper-toast');
  toast.setAttribute('text', text);
  toast.duration = 5000;
  toast.noCancelOnOutsideClick = true;
  toast.style.marginBottom = '102px';
  document.body.appendChild(toast);
  toast.show();
};

Emitter.on('register_controller', (event, { name }) => {
  window.showBasicToast(`A device "${name}" is now controlling this player!`);
});
