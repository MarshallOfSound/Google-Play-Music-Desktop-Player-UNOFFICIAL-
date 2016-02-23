import { remote } from 'electron';

Emitter.on('error', (event, details) => {
  const toast = document.createElement('paper-toast');
  toast.setAttribute('text', `An uncaught error has occurred inside GPMDP.`);
  toast.duration = 0;
  const issueButton = document.createElement('a');
  issueButton.innerHTML = 'Click here to report this as an issue on GitHub';
  issueButton.style.color = '#E53935';
  issueButton.style.margin = '0';
  issueButton.style.padding = '0';
  issueButton.style.marginLeft = '10px';
  issueButton.style.cursor = 'pointer';
  issueButton.addEventListener('click', (e) => {
    const title = 'Uncaught Exception: ' + details.error.message;
    const body = `
An uncaught exception was reported.  %0A
%23%23%23%23 Info:%0A
**OS:** ${process.platform}%0A
**Arch:** ${process.arch}%0A
**GPMDP Version:** ${require('../../../../package.json').version}%0A
**Time:** ${new Date()}%0A
%0A
%23%23%23%23 Error:%0A
*${details.error.message}*%0A
\`\`\`js%0A
${details.error.stack.replace(/(?:\r\n|\r|\n)/g, '%0A')}%0A
\`\`\`
%0A
This issue was created automatically inside the \`uncaughtException\` handler`;
    remote.shell.openExternal(`https://github.com/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/issues/new?title=${title}&body=${body}`); // eslint-disable-line
    toast.hide();
    e.preventDefault();
    return false;
  });
  toast.appendChild(issueButton);
  document.body.appendChild(toast);
  toast.show();
});
