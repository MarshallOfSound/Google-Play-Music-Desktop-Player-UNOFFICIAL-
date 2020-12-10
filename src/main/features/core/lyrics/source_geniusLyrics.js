import GeniusFetcher from 'genius-lyrics-fetcher';
import { GENIUS_API_KEY } from '../../../constants';

const client = new GeniusFetcher.Client(GENIUS_API_KEY);

export default async function geniusLyricsSource(title, artist) {
  if (!GENIUS_API_KEY || GENIUS_API_KEY === 'undefined') throw new Error('ENOGENIUS_API_KEY');

  try {
    let data = await client.fetch(title, artist);
    if (data.lyrics) {
      return data.lyrics;
    }
    data = await client.fetch(title, artist);
    if (data.lyrics) {
      return data.lyrics;
    }
    data = await client.fetch(title, artist);
    if (data.lyrics) {
      return data.lyrics;
    }
    throw new Error('Failed after three attempts');
  } catch (e) {
    Logger.error(e);
    throw new Error('Failed to get lyrics from genius');
  }
}
