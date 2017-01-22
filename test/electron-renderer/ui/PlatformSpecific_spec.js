/* eslint-disable no-unused-expressions */

import React from 'react';
import chai from 'chai';
import { mount } from 'enzyme';
import os from 'os';

import PlatformSpecific from '../../../build/renderer/ui/components/generic/PlatformSpecific';

chai.should();

const NullComponent = () =>
  (<span>NullComponent</span>);
NullComponent.displayName = 'NullComponent';

describe('<PlatformSpecific />', () => {
  const renderedNullComponent = <NullComponent />;

  it('should render the children on the correct platform', () => {
    const component = mount(<PlatformSpecific platform={process.platform}>{renderedNullComponent}</PlatformSpecific>);
    component.contains(renderedNullComponent).should.be.ok;
  });

  it('should render the children on the correct version', () => {
    const component = mount(
      <PlatformSpecific platform={process.platform} version={`${os.release().split('.')[0]}.`}>
        {renderedNullComponent}
      </PlatformSpecific>
    );
    component.contains(renderedNullComponent).should.be.ok;
  });

  it('should not render the children on the incorrect platform', () => {
    const component = mount(<PlatformSpecific platform={"bad-plat"}>{renderedNullComponent}</PlatformSpecific>);
    component.contains(renderedNullComponent).should.not.be.ok;
  });

  it('should not render the children on the incorrect version', () => {
    const component = mount(<PlatformSpecific platform={process.platform} version={"bad.version."}>{renderedNullComponent}</PlatformSpecific>);
    component.contains(renderedNullComponent).should.not.be.ok;
  });
});
