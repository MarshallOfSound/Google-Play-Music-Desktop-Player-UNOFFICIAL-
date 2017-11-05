/* eslint-disable no-unused-expressions */
import chai from 'chai';

import AlarmModal from '../../../../build/renderer/ui/components/modals/AlarmModal';

import createModalTest from './_createModalTest';

chai.should();

createModalTest(AlarmModal, ['alarm:show'], [], [], () => {}, (_c) => {
  it('should update the date when the time picker changes', () => {
    const { component } = _c;
    _c.fired.should.not.have.property('settings:set');
    component.find('AlarmModal').get(0).onTimeChange({}, 'NEW_VALUE');
    component.find('AlarmModal').get(0).save({});
    _c.fired.should.have.property('settings:set');
    _c.fired['settings:set'][0][0].should.be.deep.equal({
      key: 'alarmTime',
      value: 'NEW_VALUE',
    });
  });

  it('should update the duration when seconds changes', () => {
    const { component } = _c;
    _c.fired.should.not.have.property('settings:set');
    component.find('AlarmModal').get(0).onDurationSecondsChange({}, 5);
    component.find('AlarmModal').get(0).save({});
    _c.fired.should.have.property('settings:set');
    _c.fired['settings:set'][2][0].should.be.deep.equal({
      key: 'alarmDurationSeconds',
      value: 5,
    });
  });

  it('should reset all alarm options when reset button is clicked', () => {
    const { component } = _c;
    _c.fired.should.not.have.property('settings:set');
    component.find('AlarmModal').get(0).cancel();
    _c.fired.should.have.property('settings:set');
    _c.fired['settings:set'][0][0].should.be.deep.equal({
      key: 'alarmTime',
      value: null,
    });
    _c.fired['settings:set'][1][0].should.be.deep.equal({
      key: 'alarmOption',
      value: null,
    });
    _c.fired['settings:set'][2][0].should.be.deep.equal({
      key: 'alarmDurationSeconds',
      value: null,
    });
    _c.fired['settings:set'][3][0].should.be.deep.equal({
      key: 'alarmDurationMinutes',
      value: null,
    });
    _c.fired['settings:set'][4][0].should.be.deep.equal({
      key: 'alarmDurationHours',
      value: null,
    });
    _c.fired['settings:set'][5][0].should.be.deep.equal({
      key: 'alarmDuration',
      value: null,
    });
  });
});
