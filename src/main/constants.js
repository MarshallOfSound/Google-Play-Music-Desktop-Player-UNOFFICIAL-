export const LASTFM_API_KEY = process.env.GPMDP_LASTFM_API_KEY;
export const LASTFM_API_SECRET = process.env.GPMDP_LASTFM_API_SECRET;
export const GENIUS_API_KEY = process.env.GENIUS_API_KEY;

if (!LASTFM_API_KEY || !LASTFM_API_SECRET ||
  LASTFM_API_KEY === 'undefined' || LASTFM_API_SECRET === 'undefined') {
  if (global.Logger) Logger.error('Last.fm API keys have not been set!');
}

if (!GENIUS_API_KEY || GENIUS_API_KEY === 'undefined') {
  if (global.Logger) Logger.error('Genius API keys have not been set!');
}
