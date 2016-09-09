import WelcomeNewVersionModal from '../../../../build/renderer/ui/components/modals/WelcomeNewVersionModal';

import createModalTest from './_createModalTest';

createModalTest(WelcomeNewVersionModal, [], [], [
  { buttonIndex: 0, event: 'settings:set' },
], () => true);
