/* eslint-disable no-unused-expressions */
import _ from 'lodash';
import React from 'react';
import chai from 'chai';
import { mount } from 'enzyme';

import mockSettings, { getVars, mockEvent } from '../_mockSettings';
import materialUIContext from '../_materialUIContext';

chai.should();

export default (ModalClass, eventsToShow, eventsToHide, eventsOnButtons, setup = _.noop, bonusTests = _.noop) => {
  describe(`<${ModalClass.name} />`, () => {
    let component;
    let hooks;
    let unhooks;
    let fired;
    let hidden = true;
    const _c = { component };

    beforeEach(() => {
      hidden = !setup();
    });

    beforeEach(() => {
      mockSettings();
      hooks = getVars().hooks;
      unhooks = getVars().unhooks;
      fired = getVars().fired;
      materialUIContext.attachTo = document.createElement('div');
      component = mount(<ModalClass />, materialUIContext);
      _c.component = component;
      _c.hooks = hooks;
      _c.unhooks = unhooks;
      _c.fired = fired;
    });

    it('should render a dialog', () => {
      component.find('Dialog').length.should.be.equal(1);
    });

    it(`should be ${!setup() ? 'hidden' : 'visisble'} initially`, () => {
      component.find('Dialog').props().open.should.be.equal(!hidden);
    });

    it('should hook events on mount', () => {
      eventsToShow.concat(eventsToHide).forEach((eventName) => {
        hooks.should.have.property(eventName);
        hooks[eventName].should.be.ok;
      });
    });

    it('should unhook event on unmount', () => {
      component.unmount();
      eventsToShow.concat(eventsToHide).forEach((eventName) => {
        unhooks.should.have.property(eventName);
        unhooks[eventName].should.be.ok;
      });
    });

    it('should handle a request to close gracefully', () => {
      (component.instance().show || component.find('AlarmModal').get(0).show)({}, {});
      component.find('Dialog').props().open.should.be.equal(true);
      component.find('Dialog').props().onRequestClose();
      component.find('Dialog').props().open.should.be.equal(false);
    });

    it('should handle a request to close gracefully', () => {
      (component.instance().show || component.find('SleepModal').get(0).show)({}, {});
      component.find('Dialog').props().open.should.be.equal(true);
      component.find('Dialog').props().onRequestClose();
      component.find('Dialog').props().open.should.be.equal(false);
    });

    if (eventsToShow.length === 0) {
      it('should show when the show method is called', () => {
        component.find('Dialog').props().open.should.be.equal(!hidden);
        component.instance().show();
        component.find('Dialog').props().open.should.be.equal(true);
      });
    }

    eventsToShow.forEach((eventName) => {
      it(`should show when it recieves the "${eventName}" event`, () => {
        mockEvent(eventName, {}, {});
        component.find('Dialog').props().open.should.be.equal(true);
      });

      eventsToHide.forEach((hideEventName) => {
        it(`should show when it recieves the "${eventName}" event and then hide when it recieves the "${hideEventName}" evebt`, () => {
          mockEvent(eventName, {}, {});
          component.find('Dialog').props().open.should.be.equal(true);
          mockEvent(hideEventName, {}, {});
          component.find('Dialog').props().open.should.be.equal(false);
        });
      });
    });

    eventsOnButtons.forEach((buttonEvent) => {
      it(`should fire the "${buttonEvent.event}" event when the button "${buttonEvent.buttonIndex}" is clicked`, () => {
        component.find('Dialog').props().actions[buttonEvent.buttonIndex].props.onTouchTap();
        fired.should.have.property(buttonEvent.event);
        fired[buttonEvent.event].should.be.ok;
      });
    });

    bonusTests(_c);
  });
};
