/* eslint-disable no-unused-expressions */

import React from 'react';
import chai from 'chai';
import fs from 'fs';
import path from 'path';
import { mount } from 'enzyme';

import LocaleSelector from '../../../build/renderer/ui/components/settings/LocaleSelector';
import materialUIContext from './_materialUIContext';
import mockSettings, { getVars } from './_mockSettings';

chai.should();

describe('<LocaleSelector />', () => {
  let hooks;
  let unhooks;
  let fired;

  beforeEach(() => {
    mockSettings();
    hooks = getVars().hooks;
    unhooks = getVars().unhooks;
    fired = getVars().fired;
  });

  it('should render a selection menu', () => {
    const component = mount(<LocaleSelector />, materialUIContext);
    component.find('SelectField').length.should.be.equal(1);
  });

  it('should initialy render an enabled dropdown menu', () => {
    const component = mount(<LocaleSelector />, materialUIContext);
    component.find('SelectField').props().disabled.should.be.equal(false);
  });

  it('should hook into locale events when mounting', () => {
    mount(<LocaleSelector />, materialUIContext);
    hooks.should.have.property('settings:change:locale');
  });

  it('should unhook from locale events when unmounting', () => {
    mount(<LocaleSelector />, materialUIContext).unmount();
    unhooks.should.have.property('settings:change:locale');
  });

  it('should set the locale setting when the dropdown option changes', () => {
    const component = mount(<LocaleSelector />, materialUIContext);
    component.find('SelectField').props().onChange(null, null, 'magic_language');
    fired['settings:set'].should.be.ok;
    fired['settings:set'].length.should.be.equal(1);
    fired['settings:set'][0][0].should.be.deep.equal({
      key: 'locale',
      value: 'magic_language',
    });
  });

  it('should display all possible JSON languages in the dropdown', () => {
    const component = mount(<LocaleSelector />, materialUIContext);
    const JSONCount = fs.readdirSync(path.resolve(__dirname, '..', '..', '..', 'src', '_locales')).length - 1;
    component.find('SelectField').props().children.length.should.be.equal(JSONCount);
  });
});
