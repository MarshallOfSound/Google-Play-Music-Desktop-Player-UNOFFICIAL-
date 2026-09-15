import { screen } from 'electron';

export const positionOnScreen = (position) => {
  let inBounds = false;
  if (position) {
    screen.getAllDisplays().forEach((display) => {
      if (position[0] >= display.workArea.x &&
          position[0] < display.workArea.x + display.workArea.width &&
          position[1] >= display.workArea.y &&
          position[1] < display.workArea.y + display.workArea.height) {
        inBounds = true;
      }
    });
  }
  return inBounds;
};
