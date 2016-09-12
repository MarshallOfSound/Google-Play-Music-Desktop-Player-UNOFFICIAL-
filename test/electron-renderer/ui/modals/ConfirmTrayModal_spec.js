import ConfirmTrayModal from '../../../../build/renderer/ui/components/modals/ConfirmTrayModal';

import createModalTest from './_createModalTest';

createModalTest(ConfirmTrayModal, [], [], [
  { buttonIndex: 0, event: 'window:close' },
  { buttonIndex: 1, event: 'window:close' },
  { buttonIndex: 1, event: 'settings:set' },
]);
