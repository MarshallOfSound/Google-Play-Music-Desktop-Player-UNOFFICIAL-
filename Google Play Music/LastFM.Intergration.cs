using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Diagnostics;
using LastFMAPI;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Text;

namespace Google_Play_Music
{
    internal class LastFM
    {
        private string user_key = null;
        private static LastFM instance;

        private const string API_KEY = "";
        private const string API_SECRET = "";
        private const string API_URL = "https://ws.audioscrobbler.com/2.0/?";

        public string UserName { get; set; }
        public string Password { get; set; }

        public static LastFM GetInstance()
        {
            if (instance == null)
            {
                instance = new LastFM();
                instance.UserName = Properties.Settings.Default.LastFMUsername;
                instance.Password = Properties.Settings.Default.LastFMPassword;
            }

            return instance;
        }

        public async Task<Boolean> AttemptLogIn()
        {
            return await AttemptLogIn(UserName, Password);
        }

        public async Task<Boolean> AttemptLogIn(string userName, string password)
        {
            if (userName == "Username" && password == "1234567")
            {
                Program.Logger.Info("Skipped logging with default credentials (Username or 1234567)");
                return false;
            }

            Dictionary<String, String> attrs = new Dictionary<string, string>();

            attrs["password"] = password;
            attrs["username"] = userName;

            string requestURL = GenerateAPIRequestURL("auth.getMobileSession", attrs);

            Program.Logger.InfoFormat("Attempting login for '{0}'", userName);

            string auth_response = await FetchURL(requestURL);

            if (auth_response == "")
            {
                Program.Logger.InfoFormat("Failed login for '{0}'", userName);
                user_key = null;
                return false;
            }

            Program.Logger.InfoFormat("Successful login for '{0}'", userName);

            AuthenticationResponse auth = new System.Runtime.Serialization.Json.DataContractJsonSerializer(typeof(AuthenticationResponse)).ReadObject(new System.IO.MemoryStream(System.Text.Encoding.Unicode.GetBytes(auth_response))) as AuthenticationResponse;
            user_key = auth.Session.Key;

            Properties.Settings.Default.LastFMUsername = userName;
            Properties.Settings.Default.LastFMPassword = password;

            return true;
        }

        private async Task<string> FetchURL(string URL)
        {
            using (var client = new HttpClient())
            {

                Dictionary<string, string> values = new Dictionary<string, string>();
                FormUrlEncodedContent content = new FormUrlEncodedContent(values);
                string responseString = string.Empty;

                try
                {

                    HttpResponseMessage response = await client.PostAsync(URL, content);

                    if (response.StatusCode == HttpStatusCode.OK)
                    {
                        responseString = await response.Content.ReadAsStringAsync();
                    }
                }
                catch (Exception e)
                {
                    // Todo: Move private information out of the query string before referencing the URL in the log since it will contain username, password, api_key, and the api_sig
                    // Todo: Scrub the exception message before passing into the log because the message may contain the URL
                    Program.Logger.Error("Error attempting to fetch url");
                }

                return responseString;
            }
        }

        private string GenerateAPIRequestURL(string method, Dictionary<string, string> attributes)
        {
            string api_sig = SignMethod(method, attributes);
            string api_params = GenerateMethodParams(attributes);
            string requestURL = API_URL + "method=" + method;
            requestURL += api_params;
            requestURL += "&api_key=" + API_KEY +
                            "&api_sig=" + api_sig +
                            "&format=json";

            return requestURL;
        }

        private string GenerateMethodParams(Dictionary<string, string> attributes)
        {
            string methodParams = "";
            List<string> keys = new List<string>(attributes.Keys);
            keys.Sort();
            foreach (string key in keys)
            {
                methodParams += "&" + key + "=" + System.Web.HttpUtility.UrlEncode(attributes[key]);
            }
            return methodParams;
        }

        private string SignMethod(string method, Dictionary<string, string> attributes)
        {
            string stringToSign = "";
            attributes["api_key"] = API_KEY;
            attributes["method"] = method;
            List<string> keys = new List<string>(attributes.Keys);
            keys.Sort();

            foreach (string key in keys)
            {
                stringToSign += key + attributes[key];
            }
            stringToSign += API_SECRET;
            return BitConverter.ToString(((HashAlgorithm)CryptoConfig.CreateFromName("MD5")).ComputeHash(new UTF8Encoding().GetBytes(stringToSign))).Replace("-", string.Empty).ToLower();
        }

        // Here begins the API wrappers
        public async Task UpdateNowPlaying(string artist, string track, string album)
        {
            if (user_key == null)
            {
                throw new Exception("The last.fm user is not authorized");
            }

            Dictionary<string, string> attributes = new Dictionary<string, string>();
            attributes["artist"] = artist;
            attributes["track"] = track;
            attributes["album"] = album;
            attributes["sk"] = user_key;

            Program.Logger.InfoFormat("Updating now playing to artist:'{0}' track:'{1}' and album:'{2}'", artist, track, album);

            string requestURL = GenerateAPIRequestURL("track.updateNowPlaying", attributes);

            await FetchURL(requestURL);
        }

        public async Task ScrobbleTrack(string artist, string track, string album, int timestamp)
        {
            if (user_key == null)
            {
                throw new Exception("The last.fm user is not authorized");
            }

            Dictionary<string, string> attributes = new Dictionary<string, string>();
            attributes["artist"] = artist;
            attributes["track"] = track;
            attributes["album"] = album;
            attributes["timestamp"] = timestamp.ToString();
            attributes["sk"] = user_key;

            Program.Logger.InfoFormat("Scrobbling artist:'{0}' track:'{1}', album:'{2}', timestamp:'{3}'", artist, track, album, timestamp);

            string requestURL = GenerateAPIRequestURL("track.scrobble", attributes);

            await FetchURL(requestURL);
        }

        /// <summary>
        /// Get a value indicating if the current user is authenticated with LastFM
        /// </summary>
        public bool IsAuthenticated()
        {
            return !string.IsNullOrEmpty(user_key);
        }
    }
}

namespace LastFMAPI
{
    [System.Runtime.Serialization.DataContract]
    public class AuthenticationResponse
    {
        [System.Runtime.Serialization.DataMember(Name = "session")]
        public AuthenticationSession Session { get; set; }
    }

    [System.Runtime.Serialization.DataContract]
    public class AuthenticationSession
    {
        [System.Runtime.Serialization.DataMember(Name = "subscriber")]
        public int Subscriber { get; set; }
        [System.Runtime.Serialization.DataMember(Name = "name")]
        public string Name { get; set; }
        [System.Runtime.Serialization.DataMember(Name = "key")]
        public string Key { get; set; }
    }
}
