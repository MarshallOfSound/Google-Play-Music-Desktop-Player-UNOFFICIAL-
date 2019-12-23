/* eslint-disable no-unused-expressions */

import React from 'react';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';

import RatingButton from '../../../build/renderer/ui/components/generic/RatingButton';
import mockSettings from './_mockSettings';

chai.should();

describe('<RatingButton />', () => {
  beforeEach(() => {
    mockSettings();
  });

  it('should render a button', () => {
    const component = mount(
      <RatingButton
        type="like"
        translationKey="foo"
        checked
      />
    );
    component.find('button').length.should.be.equal(1);
  });

  [
    ['like', true, 'like-checked'],
    ['like', false, 'like-unchecked'],
    ['dislike', true, 'dislike-checked'],
    ['dislike', false, 'dislike-unchecked'],
  ].forEach(([type, checked, className]) => {
    it(`should render the correct icon when type is "${type}" and checked is ${checked}`, () => {
      const component = mount(
        <RatingButton
          type={type}
          translationKey="foo"
          checked={checked}
        />
      );
      component.find(`svg.${className}`).length.should.be.equal(1);
    });
  });

  [
    ['like', 'like-checked', 'like-unchecked'],
    ['dislike', 'dislike-checked', 'dislike-unchecked'],
  ].forEach(([type, checkedClassName, uncheckedClassName]) => {
    it(`should update the icon when type is "${type}" and checked changes`, () => {
      const component = mount(
        <RatingButton
          type={type}
          translationKey="foo"
          checked
        />
      );
      const button = component.find('svg');
      expect(button).to.exist;

      expect(button.props().className).to.equal(checkedClassName);

      component.setProps({ checked: false });

      expect(button.props().className).to.equal(uncheckedClassName);
    });
  });

  it('should disable the button when disabled', () => {
    const component = mount(
      <RatingButton
        type="like"
        translationKey="foo"
        checked
        disabled
      />
    );
    const button = component.find('button');
    expect(button).to.exist;
    expect(button.props().disabled).to.be.true;

    component.setProps({ disabled: false });

    expect(button.props().disabled).to.be.false;
  });

  ['like', 'dislike'].forEach(type => {
    it(`should set the class name to "${type}" when type is "${type}".`, () => {
      const component = mount(
        <RatingButton
          type={type}
          translationKey="foo"
          checked
        />
      );
      const button = component.find('button');
      expect(button).to.exist;
      expect(button.props().className).to.equal(type);
    });
  });

  it('should call the click handler when the button is clicked', () => {
    let called = false;
    const component = mount(
      <RatingButton
        type="like"
        translationKey="foo"
        checked
        onClick={() => (called = true)}
      />
    );
    expect(called).to.be.false;
    component.find('button').simulate('click');
    expect(called).to.be.true;
  });
});
