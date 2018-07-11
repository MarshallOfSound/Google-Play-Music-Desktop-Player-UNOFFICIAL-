GPM.playlists = {
  getAll: () => [],
  play: () => Promise.resolve(),
  playWithTrack: () => Promise.resolve(),
};

GPM.queue = {
  clear: () => {},
  getTracks: () => [],
  playTrack: () => {},
};

GPM.search = {
  getCurrentResults: () => ({
    searchText: '',
    bestMatch: null,
    albums: [],
    artists: [],
    tracks: [],
  }),
  getSearchText: () => '',
  isSearching: () => false,
  performSearch: () => {},
  playResult: () => {},
};

GPM.library = {
  getTracks: () => [],
  getAlbums: () => [],
  getArtists: () => [],
  playAlbum: () => Promise.resolve(),
  playTrack: () => Promise.resolve(),
  getLibrary: () => ({
    tracks: [],
    artists: [],
    albums: [],
  }),
};
