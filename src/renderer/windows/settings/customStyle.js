// import path from 'path';
//
// const mainAppStyleInput = $('#style-main-app-file-i');
// const gpmStyleInput = $('#style-gpm-file-i');
// const mainAppStyleFileInput = $('#style-main-app-file');
// const gpmStyleFileInput = $('#style-gpm-file');
//
// mainAppStyleInput.val(path.basename(Settings.get('mainAppStyleFile', '')));
// gpmStyleInput.val(path.basename(Settings.get('gpmStyleFile', '')));
//
// mainAppStyleFileInput.on('change', () => {
//   let filePath = '/THIS/FILE/DOES/NOT/EXIST/IF/IT/DOES/THEN/...';
//   if (mainAppStyleFileInput.get(0) && mainAppStyleFileInput.get(0).files && mainAppStyleFileInput.get(0).files[0]) {
//     filePath = mainAppStyleFileInput.get(0).files[0].path;
//   }
//   Emitter.fire('settings:set', {
//     key: 'mainAppStyleFile',
//     value: filePath,
//   });
//   Emitter.fire('FetchMainAppCustomStyles');
// });
//
// gpmStyleFileInput.on('change', () => {
//   let filePath = '/THIS/FILE/DOES/NOT/EXIST/IF/IT/DOES/THEN/...';
//   if (gpmStyleFileInput.get(0) && gpmStyleFileInput.get(0).files && gpmStyleFileInput.get(0).files[0]) {
//     filePath = gpmStyleFileInput.get(0).files[0].path;
//   }
//   Emitter.fire('settings:set', {
//     key: 'gpmStyleFile',
//     value: filePath,
//   });
//   Emitter.fire('FetchGPMCustomStyles');
// });
//
// $('.style-refresh').click(() => {
//   Emitter.fire('FetchMainAppCustomStyles');
//   Emitter.fire('FetchGPMCustomStyles');
// });
