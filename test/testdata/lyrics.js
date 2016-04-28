let validSongArray = [
  {
    title: 'Out of the Woods',
    artist: 'Taylor Swift',
    album: '1989',
  },
  {
    title: 'Never Gonna Give You Up',
    artist: 'Rick Astley',
    album: 'Whenever You Need Somebody',
  },
];

let invalidSongArray = [
  {
    title: 'Out of the Sticks',
    artist: 'Swiftlor Taytay',
    album: '1782',
  },
  {
    title: 'Always Gonna Let You Down',
    artist: 'Rolling Rick',
    album: 'I Always Need Nobody',
  },
];

validSongArray = validSongArray.map((song) => {
  song.description = `${song.title} : ${song.artist}`; // eslint-disable-line
  return song;
});

invalidSongArray = invalidSongArray.map((song) => {
  song.description = `${song.title} : ${song.artist}`; // eslint-disable-line
  return song;
});

export const validSongs = validSongArray;
export const invalidSongs = invalidSongArray;
