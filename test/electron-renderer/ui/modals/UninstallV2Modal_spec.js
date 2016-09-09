import UninstallV2Modal from '../../../../build/renderer/ui/components/modals/UninstallV2Modal';

import createModalTest from './_createModalTest';

createModalTest(UninstallV2Modal, ['uninstall:request'], [], [
  { buttonIndex: 0, event: 'uninstall:confirm' },
]);
