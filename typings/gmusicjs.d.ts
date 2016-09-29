declare namespace GMusic {
    interface Track {
        id: string;
        title: string;
        albumArt: string;
        artist: string;
        album: string;
        index: number;

        artistId: string;
        artistImage: string;
        albumArtist: string;
        albumId: string;

        duration: number;
        playCount: number;

        lyrics?: string;

        equals(other: Track): boolean;
    }
    
    interface Artist {
        id: string;
        name: string;
        image: string;
    }

    interface Album {
        id: string;
        name: string;
        artist: string;
        albumArt: string;
    }

    interface Library {
        tracks: Track[];
        artists: Artist[];
        albums: Album[];
    }

    interface BestMatch {
        type: string;
        value: Album | Artist | Track;
    }

    interface SearchResults extends Library {
        searchText: string;
        bestMatch: BestMatch;
    }

    interface Playlist {
        id: string;
        name: string;
        tracks: Track[];
    }

    namespace Namespaces {
        interface PlaybackStatus {
            STOPPED: 0;
            PAUSED: 1;
            PLAYING: 2;
        }

        interface RepeatStatus {
            LIST_REPEAT: 'LIST_REPEAT';
            SINGLE_REPEAT: 'SINGLE_REPEAT';
            NO_REPEAT: 'NO_REPEAT';
        }

        interface ShuffleStatus {
            ALL_SHUFFLE: 'ALL_SHUFFLE';
            NO_SHUFFLE: 'NO_SHUFFLE';
        }

        interface Extras {
            /**
             * Retrieve the URL of the current track for sharing
             */
            getTrackURL(): string;
        }

        interface Playback {
            /**
             * Retrieve the current progress in a track
             */
            getCurrentTime(): number;
            /**
             * Jump the current track to the given time
             */
            setCurrentTime(newTime: number): void;
            /**
             * Retrieve the length of the current track
             */
            getTotalTime(): number;
            /**
             * Determine if a track is current playing
             */
            isPlaying(): boolean;
            /**
             * Retrieve current track's metadata
             */
            getCurrentTrack(): GMusic.Track;
            /**
             * Toggle between play and pause for the current track
             */
            playPause(): void;
            /**
             * Determines the current playback state
             */
            getPlaybackState(): 0 | 1 | 2;
            /**
             * Skips to the next track
             */
            forward(): void;
            /**
             * SKips to the previous track
             */
            rewind(): void;
            /**
             * Determines the current shuffle state
             */
            getShuffle(): 'ALL_SHUFFLE' | 'NO_SHUFFLE';
            /**
             * Sets the current shuffle state
             */
            setShuffle(newShuffleMode: 'ALL_SHUFFLE' | 'NO_SHUFFLE'): void;
            /**
             * Toggle to between shuffle being active or inactive
             */
            toggleShuffle(): void;
            /**
             * Retrieve the current setting for repeat
             */
            getRepeat(): 'LIST_REPEAT' | 'SINGLE_REPEAT' | 'NO_REPEAT';
            /**
             * Change the current setting for repeat
             */
            setRepeat(newRepeatMode: 'LIST_REPEAT' | 'SINGLE_REPEAT' | 'NO_REPEAT'): void;
            /**
             * Toggle through the modes for repeat.
             * 
             * The order is NO_REPEAT, LIST_REPEAT, SINGLE_REPEAT
             */
            toggleRepeat(): void;
            /**
             * Trigger a visualization for the track. This is typically album art.
             */
            toggleVisualization(): void;
        }

        interface Rating {
            /**
             * Retrieve the rating for the current track.
             * 
             * 0 = No Rating
             * 1 - 5 is the standard rating scale
             * 1 = Thumbs Down
             * 5 = Thumbs Up
             * 2 - 4 are depreceated values
             */
            getRating(): '0' | '1' | '2' | '3' | '4' | '5' | number;
            /**
             * Switch between thumbs up and no thumbs up for the current track. If thumbs down was set, this will remove the thumbs down rating.
             */
            toggleThumbsUp(): void;
            /**
             * Switch between thumbs down and no thumbs down for the current track. If thumbs up was set, this will remove the thumbs up rating.
             */
            toggleThumbsDown(): void;
            /**
             * Sets the currents tracks rating
             */
            setRating(newRating: '0' | '1' | '2' | '3' | '4' | '5' | number): void;
            /**
             * Remove rating from current track
             */
            resetRating(): void;   
        }
        
        interface Volume {
            /**
             * Retrieve the current volume setting
             */
            getVolume(): number;
            /**
             * Sets the current volume
             */
            setVolume(/**
                       * Volume must be between 0 and 100 
                       */
                      newVolume: number): void;
            /**
             * Increase volume by `amount`
             */
            increaseVolume(amount?: number): void;
            /**
             * Decrease volume by `amount`
             */
            decreaseVolume(amount?: number): void;
        }

        interface Playlists {
            /**
             * Retrieves a list of all the playlists in the users GPM library
             */
            getAll(): GMusic.Playlist[];
            /**
             * Navigates to the given playlist and plays it immediately
             */
            play(playlist: GMusic.Playlist): Promise<null>;
            /**
             * Navigates to the given playlist and plays it immediately starting at the given track
             */
            playWithTrack(playlist: GMusic.Playlist, track: GMusic.Track): Promise<null>;
        }

        interface Queue {
            /**
             * Clears the current queue
             */
            clear(): void;
            /**
             * Retrieves a list of all the tracks in the users current queue
             */
            getTracks(): GMusic.Track[];
            /**
             * Attempts to play a given track in the queue. If this track is not in the queue an error will be thrown
             */
            playTrack(track: GMusic.Track): Promise<null>;
        }

        interface Search {
            /**
             * Retrieves a SearchResults object representing the current search results.
             * Will throw an error if the user is not currently searching
             */
            getCurrentResults(): GMusic.SearchResults;
            /**
             * Retrieves the current string that the user is searching for or the most recent string the user searched for.
             * Basically whatever is in the search input field at the moment.
             */
            getSearchText(): string;
            /**
             * Determines if the user is currently searching or not
             */
            isSearching(): boolean;
            /**
             * Immediately triggers a new search for the given text
             */
            performSearch(text: string): Promise<GMusic.SearchResults>;
            /**
             * Immediately attempts to play the given result. If we fail to play the given result an error will be thrown.
             */
            playResult(result: GMusic.Album | GMusic.Artist | GMusic.Track): void;
            /**
             * Immediately triggers a new search and attempts to play the given result. If we fail to play the given result an error will be thrown.
             */
            performSearchAndPlayResult(text: string, result: GMusic.Album | GMusic.Artist | GMusic.Track): Promise<null>;
        }

        interface Library {
            /**
             * Retreives an array of all tracks in the users library
             */
            getTracks(): GMusic.Track[];
            /**
             * Retreives an array of all albums in the users library
             */
            getAlbums(): GMusic.Album[];
            /**
             * Retreives an array of all artists in the users library
             */
            getArtists(): GMusic.Artist[];
            /**
             * Retreives a Library object consisting of all the users Albums, Artists and Tracks
             */
            getLibrary(): GMusic.Library;
            /**
             * Immediately attempts to play the given album
             */
            playAlbum(album: GMusic.Album): Promise<null>;
            /**
             * Immediately attempts to play the given track
             */
            playTrack(track: GMusic.Track): Promise<null>; 
        }

        interface Mini {
            /**
             * Immediately enables the mini player
             */
            enable(): void;
            /**
             * Immediately disables the mini player
             */
            disable(): void;
            /**
             * Set whether or not scrolling changes the volume
             */
            setScrollVolume(shouldScroll: boolean): void;
        }
    }

    class GMusic extends NodeJS.EventEmitter {
        /**
         * GMusic.js
         */
        playback: Namespaces.Playback;
        volume: Namespaces.Volume;
        rating: Namespaces.Rating;
        static PlaybackStatus: Namespaces.PlaybackStatus;
        static RepeatStatus: Namespaces.RepeatStatus;
        static ShuffleStatus: Namespaces.ShuffleStatus;

        on(event: string, listener: Function): this;
        on(event: 'change:track', listener: (track: GMusic.Track) => void): this;
        on(event: 'change:shuffle', listener: (shuffleMode: 'ALL_SHUFFLE' | 'NO_SHUFFLE') => void): this;
        on(event: 'change:repeat', listener: (repeatMode: 'LIST_REPEAT' | 'SINGLE_REPEAT' | 'NO_REPEAT') => void): this;
        on(event: 'change:playback', listener: (playbackMode: 0 | 1 | 2) => void): this;
        on(event: 'change:playback-time', listener: (playbackTime: GPMDP.TrackTime) => void): this;
        on(event: 'change:rating', listener: (rating: '0' | '1' | '2' | '3' | '4' | '5' | number) => void): this;

        /**
         * GMusic-UI.js
         */
        playlists: Namespaces.Playlists;
        library: Namespaces.Library;
        search: Namespaces.Search;
        queue: Namespaces.Queue;

        on(event: 'change:playlists', listener: (playlists: GMusic.Playlist[]) => void): this;
        on(event: 'change:library', listener: (library: GMusic.Library) => void): this;
        on(event: 'change:queue', listener: (queue: GMusic.Track[]) => void): this;
        on(event: 'change:search-results', listener: (results: GMusic.SearchResults) => void): this;

        /**
         * GMusic-Mini-Player.js
         */
        mini: Namespaces.Mini;
    }
}

declare namespace GMT {
    interface ThemeOptions {
        type?: 'FULL' | 'HIGHLIGHT_ONLY';
        backPrimary?: string;
        backSecondary?: string;
        backHighlight?: string;
        foreSecondary?: string;
        forePrimary?: string;
    }

    class GMusicTheme {
        updateTheme(options: ThemeOptions): void;
        substituteColors(styles: string): string;
        enable(): void;
        disable(): void;
    }
}

declare module 'gmusic.js' {
    class GMusicJS extends GMusic.GMusic {}
    module GMusicJS {}
    export = GMusicJS;
}

declare module 'gmusic-theme.js' {
    class GMusicTheme extends GMT.GMusicTheme {}
    module GMusicTheme {}
    export = GMusicTheme;
}

declare module 'gmusic-ui.js' {
    function GMusicUI (
        gmusic: typeof GMusic.GMusic
    ): void;
    module GMusicUI {}
    export = GMusicUI;
}

declare module 'gmusic-mini-player.js' {
    function GMusicMiniPlayer (
        gmusic: typeof GMusic.GMusic
    ): void;
    module GMusicMiniPlayer {}
    export = GMusicMiniPlayer;
}