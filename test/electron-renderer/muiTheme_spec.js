import chai from 'chai';
import { darkBlack, white } from 'material-ui/styles/colors';

import generateTheme from '../../build/renderer/ui/utils/theme';

chai.should();

describe('muiTheme util', () => {
  describe('when the theme is disabled', () => {
    it('should set the primary color to the default', () => {
      const theme = generateTheme(false, 'red', 'FULL');
      theme.palette.primary1Color.should.be.equal('#FF5722');
    });

    it('should set the text color to be darkBlack', () => {
      const theme = generateTheme(false, 'red', 'FULL');
      theme.palette.textColor.should.be.equal(darkBlack);
    });
  });

  describe('when the theme is enabled', () => {
    it('should set the primary color to the theme color', () => {
      const theme = generateTheme(true, 'red', 'FULL');
      theme.palette.primary1Color.should.be.equal('red');
    });

    describe('and the themeType is FULL', () => {
      it('should set the text color to be white', () => {
        const theme = generateTheme(true, 'red', 'FULL');
        theme.palette.textColor.should.be.equal(white);
      });

      it('should update the tabs settings', () => {
        const theme = generateTheme(true, 'red', 'FULL');
        theme.tabs.backgroundColor.should.be.equal('#222326');
      });
    });

    describe('and the themeType is HIGHLIGHT_ONLY', () => {
      it('should not update the tabs settings', () => {
        const theme = generateTheme(true, 'red', 'HIGHLIGHT_ONLY');
        theme.tabs.backgroundColor.should.not.be.equal('#222326');
      });
    });
  });
});
