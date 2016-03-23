export const LASTFM_API_KEY = process.env.GPMDP_LASTFM_API_KEY;
export const LASTFM_API_SECRET = process.env.GPMDP_LASTFM_API_SECRET;

if (!LASTFM_API_KEY || !LASTFM_API_SECRET ||
  LASTFM_API_KEY === 'undefined' || LASTFM_API_SECRET === 'undefined') {
  Logger.error('Last.fm API keys have not been set!');
}
