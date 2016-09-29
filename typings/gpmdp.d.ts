declare namespace GPMDP {
    abstract class IWindowManager {
        add(window: Electron.BrowserWindow, name?: string): symbol;
        get(windowID: symbol): Electron.BrowserWindow;
        getByInternalID(windowID: number): Electron.BrowserWindow;
        getAll(name: string): Electron.BrowserWindow[];
        forceFocus(window: Electron.BrowserWindow): void;
        close(windowID: symbol): void;
        getWindowManagerName(): string;
        getWindowManagerGDMName(): string;

        public IDMap: any;
    }

    abstract class IMainEmitter {
        sendToWindow(windowID: symbol, event: string, ...details): void;
        sendToWindowsOfName(name: string, event: string, ...details): void;
        sendToAll(event: string, ...details): void;
        sendToGooglePlayMusic(event: string, ...details): void;
        executeOnWindow(windowID: symbol, fn: Function, ...args): void;
        on(what: string, fn: Function): void;
        once(what: string, fn: Function): void;
    }

    abstract class IRendererEmitter {
        fire(what: string, ...args): void;
        fireAtAll(what: string, ...args): void;
        fireAtGoogle(what: string, ...args): void;
        fireAtMain(what: string, ...args): void;
        fireSync(what: string, ...args): void;
        on(what: string, fn: Function): void;
        once(what: string, fn: Function): void;
        off(what: string, fn: Function): void;
        ready?: boolean;
    }

    abstract class ISettings {
        /**
         * Gets the given keys value and if it is not set returns the defaultValue
         */
        get(key: string, defaultValue?: any): any;
        /**
         * Sets the given key to the given value
         */
        set(key: string, value: any): void;
        /**
         * Uncouples the instance of Settings from the local file system
         * This will force the instance to read from the FS on each get call
         * and cause all set calls to be sent asyncronously through the main
         * process
         */
        uncouple(): void;
        /**
         * Will call `fn` whenever the settings key changes
         */
        onChange(key: string, fn: (newValue: any, key?: string) => void): void;
        /**
         * Instantly destroys the settings file on local FS
         */
        destroy(): void;

        /**
         * Indicates whether we are currently running in a test suite or not
         */
        __TEST__: boolean;
    }

    interface TrackRating {
        liked: boolean;
        disliked: boolean;
    }

    interface TrackTime {
        current: number;
        total: number;
    }

    abstract class IPlaybackAPI extends NodeJS.EventEmitter {
        on(event: string, listener: Function): this;

        on(event: 'change:library', listener: (newLibrary: GMusic.Library) => void): this;
        on(event: 'change:state', listener: (isPlaying: boolean) => void): this;
        on(event: 'change:track', listener: (newTrack: GMusic.Track) => void): this;
        on(event: 'change:lyrics', listener: (newLyrics: string) => void): this;
        on(event: 'change:playlists', listener: (newPlaylists: GMusic.Playlist[]) => void): this;
        on(event: 'change:queue', listener: (newQueue: GMusic.Track[]) => void): this;
        on(event: 'change:rating', listener: (newRating: TrackRating) => void): this;
        on(event: 'change:shuffle', listener: (newShuffle: 'ALL_SHUFFLE' | 'NO_SHUFFLE') => void): this;
        on(event: 'change:repeat', listener: (newRepeat: 'LIST_REPEAT' | 'SINGLE_REPEAT' | 'NO_REPEAT') => void): this;
        on(event: 'change:search-results', listener: (newResults: GMusic.SearchResults) => void): this;
        on(event: 'change:time', listener: (newTime: TrackTime) => void): this;

        reset(): void;
        currentSong(force?: boolean): GMusic.Track;
        isPlaying(): boolean;
        currentShuffle(): 'ALL_SHUFFLE' | 'NO_SHUFFLE';
        currentRepeat(): 'LIST_REPEAT' | 'SINGLE_REPEAT' | 'NO_REPEAT';
        getQueue(): GMusic.Track[];
        getResults(): GMusic.SearchResults;
        currentTime(): TrackTime;
        currentSongLyrics(force?: boolean): string;
        getPlaylists(): GMusic.Playlist[];
        getLibrary(): GMusic.Library;
        setPlaybackSongLyrics(lyrics: string): void;
    }

    abstract class ITranslationProvider {
        query(key: string): string;
    }

    interface GConsole extends Console {
        transports: any;
        verbose: Function;
    }

    interface AudioDevice {
        id: string;
        deviceId?: string;
        label: string;
        kind?: 'audiooutput' | 'audioinput';
    }

    interface KeyStore {
        accelerators: string[];
        modifiers: string[];
        actions: string[];
    }

    class Notification {
        _id: number;
        title: string;
        dir: string;
        lang: string;
        body: string;
        icon: string;
        tag: string;
        data: NotificationOptions;

        onclick: Function;
        onerror: Function;
        onclose: Function;
        onshow: Function;

        close(): void;
    }

    interface NotificationOptions {
        dir: string;
        lang: string;
        body: string;
        icon: string;
        tag: string;
    }

    interface PaperDialog extends HTMLElement {
      opened: boolean;
      alwaysOnTop: boolean;
      withBackdrop: boolean;
      toggle: Function;
      close: Function;
    }

    interface BooleanState {
        state: boolean;
    }

    namespace API {
        interface WebSocketServer {
            broadcast: (channel: string, data: Object) => void;
        }

        interface WebSocketClient {
            channel: (channel: string, data: Object) => void;
            json: (data: Object) => void;
            authorized: boolean;
        }
    }
}

declare namespace NodeJS {
    interface Global {
        Emitter: GPMDP.IMainEmitter & GPMDP.IRendererEmitter;
        Logger: any;
        PlaybackAPI: GPMDP.IPlaybackAPI;
        Settings: GPMDP.ISettings;
        WindowManager: GPMDP.IWindowManager;
        /**
         * The unique symbol associated with the main window
         */
        mainWindowID: symbol;
        /**
         * Indicates if the application is currently running in development mode
         */
        DEV_MODE: boolean;
        /**
         * Indicates if the application is allowed to or is in a quitting state
         */
        quitting: boolean;
        /**
         * The GPMDP tray icon in the global scope
         */
        appIcon: Electron.Tray;
        /**
         * Port to launch the WebSocketAPI (Used for testing)
         */
        API_PORT: number;
        /**
         * Translation provider to query key based string translation
         */
        TranslationProvider: GPMDP.ITranslationProvider;
        HTMLSpanElement: any;
        wasMaximized: boolean;
        lastFMSession: any;
    }
}

declare interface Array<T> {
    includes(thing: T): boolean;
}

declare interface Window {
    NOTIFY_DATA: any;
}

declare module 'username' {
    export default function username(): Promise<string>;
}

declare namespace request {
    
}