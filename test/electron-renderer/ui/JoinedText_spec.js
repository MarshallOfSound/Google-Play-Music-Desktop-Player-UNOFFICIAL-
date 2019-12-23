/* eslint-disable no-unused-expressions */

import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import JoinedText from '../../../build/renderer/ui/components/generic/JoinedText';

describe('<JoinedText />', () => {
  function getSpans(component) {
    return component.find('div > span');
  }
  it('should render the text separated by the separator text', () => {
    const component = mount(
      <JoinedText
        text={['foo', 'bar', 'meep']}
        separator=":"
      />
    );
    expect(getSpans(component).map(x => x.text())).to.deep.equal([
      'foo',
      ':',
      'bar',
      ':',
      'meep',
    ]);
  });

  it('should use &nbsp; as the default separator', () => {
    const component = mount(
      <JoinedText
        text={['foo', 'bar', 'meep']}
      />
    );
    expect(getSpans(component).map(x => x.text())).to.deep.equal([
      'foo',
      '\u00a0-\u00a0',
      'bar',
      '\u00a0-\u00a0',
      'meep',
    ]);
  });

  it('should apply the given class name to the root element', () => {
    const component = mount(
      <JoinedText
        text={['foo', 'bar', 'meep']}
        className="test"
      />
    );
    const div = component.find('div');
    expect(div.props().className).to.equal('test');
  });

  it('should apply the given class names to the text elements', () => {
    const component = mount(
      <JoinedText
        text={['foo', 'bar', 'meep']}
        textClassNames={['alpha', 'beta', 'gamma']}
      />
    );
    expect(getSpans(component).map(x => x.props().className)).to.deep.equal([
      'alpha',
      'separator',
      'beta',
      'separator',
      'gamma',
    ]);
  });
});
