/* eslint-disable no-unused-expressions */
import chai from 'chai';

import AlarmModal from '../../../../build/renderer/ui/components/modals/SleepModal';

import createModalTest from './_createModalTest';

chai.should();

createModalTest(AlarmModal, ['sleep:show'], [], [], () => {}, (_c) => {
  it('should update the date when the time picker changes', () => {
    const { component } = _c;
    _c.fired.should.not.have.property('settings:set');
    component.find('SleepModal').get(0).onChange({}, 'NEW_VALUE');
    _c.fired.should.have.property('settings:set');
    _c.fired['settings:set'][0][0].should.be.deep.equal({
      key: 'sleep',
      value: 'NEW_VALUE',
    });
  });

  it('should reset the current value when the reset button is clicked', () => {
    const { component } = _c;
    _c.fired.should.not.have.property('settings:set');
    component.find('SleepModal').get(0).cancel();
    _c.fired.should.have.property('settings:set');
    _c.fired['settings:set'][0][0].should.be.deep.equal({
      key: 'sleep',
      value: null,
    });
  });
});
