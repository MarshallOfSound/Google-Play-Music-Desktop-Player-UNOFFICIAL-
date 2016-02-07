export const LASTFM_API_KEY = process.env.GPMDP_LASTFM_API_KEY;
export const LASTFM_API_SECRET = process.env.GPMDP_LASTFM_API_SECRET;

if (LASTFM_API_KEY === '' || LASTFM_API_SECRET === '') {
  console.error('####################################'); // eslint-disable-line
  console.error('############### ERROR ##############'); // eslint-disable-line
  console.error('######### LASTFM  API KEYS #########'); // eslint-disable-line
  console.error('######## HAVE NOT BEEN SET #########'); // eslint-disable-line
  console.error('#####################################'); // eslint-disable-line
}
