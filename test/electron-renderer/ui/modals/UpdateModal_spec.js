import UpdateModal from '../../../../build/renderer/ui/components/modals/UpdateModal';

import createModalTest from './_createModalTest';

createModalTest(UpdateModal, ['update:available'], [], [
  { buttonIndex: 0, event: 'update:wait' },
  { buttonIndex: 1, event: 'update:trigger' },
]);
