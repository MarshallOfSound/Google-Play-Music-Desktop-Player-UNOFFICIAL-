import { remote } from 'electron';

Emitter.on('error', (event, details) => {
  window.showToast(TranslationProvider.query('message-uncaught-error'), false,
  TranslationProvider.query('message-uncaught-error-button'), '#E53935',
  (buttonEvent, toast) => {
    const title = `Uncaught Exception: ${details.error.message.split(/\n/g)[0].substring(0, 100)}`;
    const body = `
An uncaught exception was reported.  %0A
%23%23%23%23 Info:%0A
**OS:** ${process.platform}%0A
**Arch:** ${process.arch}%0A
**GPMDP Version:** ${require('../../../../package.json').version}%0A
**Time:** ${new Date()}%0A
%0A
%23%23%23%23 Error:%0A
*${details.error.message.split(/\n/g)[0].substring(0, 100)}*%0A
\`\`\`js%0A
${details.error.stack.replace(/(?:\r\n|\r|\n)/g, '%0A').substring(0, 1200)}
${details.error.stack.length > 1200 ? '%0A...Some of the stack is missing' : ''}%0A
\`\`\`
%0A
This issue was created automatically inside the \`uncaughtException\` handler`;

    remote.shell.openExternal(`https://github.com/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/issues/new?title=${title}&body=${body}`); // eslint-disable-line
    toast.hide();
    buttonEvent.preventDefault();
    return false;
  }, () => {});
});
