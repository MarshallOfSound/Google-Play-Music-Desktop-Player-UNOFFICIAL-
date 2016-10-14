import OpenPortModal from '../../../../build/renderer/ui/components/modals/OpenPortModal';

import createModalTest from './_createModalTest';

createModalTest(OpenPortModal, ['openport:request'], [], [
  { buttonIndex: 1, event: 'openport:confirm' },
]);
