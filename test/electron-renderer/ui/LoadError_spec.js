/* eslint-disable no-unused-expressions */

import { remote } from 'electron';
import React from 'react';
import chai from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import LoadError from '../../../build/renderer/ui/components/generic/LoadError';
import materialUIContext from './_materialUIContext';
import mockSettings from './_mockSettings';

const expect = chai.use(sinonChai).expect;

describe('<LoadError />', () => {
  let sandbox;
  let clock;
  let window;

  beforeEach(() => {
    mockSettings();
    sandbox = sinon.sandbox.create();
    clock = sandbox.useFakeTimers();
    window = { reload: sinon.spy() };
    sandbox.stub(remote, 'getCurrentWindow').returns(window);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should render null when there is no failure reason', () => {
    const component = mount(<LoadError reason={null} />, materialUIContext);
    expect(component.children().length).to.equal(0);
  });

  it('should render the reason when a reason exists', () => {
    const component = mount(<LoadError reason="Foo" />, materialUIContext);
    expect(component.find('.reason').text()).to.equal('Foo');
  });

  it('should show a button to reload', () => {
    const component = mount(<LoadError reason="Foo" />, materialUIContext);
    const button = component.find('RaisedButton');
    expect(button).to.have.lengthOf(1);
    button.props().onClick();
    expect(window.reload).to.have.been.calledOnce;
  });

  it('should reload automatically after 15 seconds', () => {
    const component = mount(<LoadError />, materialUIContext);
    component.setProps({ reason: 'Foo' });
    clock.tick(14000);
    expect(window.reload).to.have.not.been.called;
    clock.tick(1000);
    expect(window.reload).to.have.been.calledOnce;
  });

  it('should show the countdown for automatic reloading', () => {
    global.TranslationProvider = {
      query: () => 'foo $1 bar',
    };

    const component = mount(<LoadError />, materialUIContext);
    const labels = [];

    component.setProps({ reason: 'Foo' });

    for (let i = 0; i < 15; i++) {
      labels.push(component.find('.countdown').text());
      clock.tick(1000);
    }

    expect(labels).to.deep.equal([
      'foo 15 bar',
      'foo 14 bar',
      'foo 13 bar',
      'foo 12 bar',
      'foo 11 bar',
      'foo 10 bar',
      'foo 9 bar',
      'foo 8 bar',
      'foo 7 bar',
      'foo 6 bar',
      'foo 5 bar',
      'foo 4 bar',
      'foo 3 bar',
      'foo 2 bar',
      'foo 1 bar',
    ]);
  });
});
