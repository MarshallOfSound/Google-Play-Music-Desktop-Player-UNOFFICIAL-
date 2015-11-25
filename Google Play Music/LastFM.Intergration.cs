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
    class LastFM
    {
        private string username;
        private string password;
        public static string user_key = null;

        private const string API_KEY = "";
        private const string API_SECRET = "";

        public LastFM()
        {
            this.username = Properties.Settings.Default.LastFMUsername;
            this.password = Properties.Settings.Default.LastFMPassword;
        }

        public LastFM(string username, string password)
        {
            this.username = username;
            this.password = password;
        }

        public async Task init()
        {
            await attemptLogIn();
        }

        public async Task attemptLogIn()
        {
            if (username == "Username" || password == "1234567")
            {
                return;
            }
            Dictionary<String, String> attrs = new Dictionary<string, string>();
            attrs["password"] = password;
            attrs["username"] = username;
            string api_sig = signMethod("auth.getMobileSession", attrs);
            string requestURL = "https://ws.audioscrobbler.com/2.0/?method=auth.getMobileSession&username=" + username +
                "&password=" + password +
                "&api_key=" + API_KEY + "&api_sig=" + api_sig +
                "&format=json";

            string auth_response = await fetchURL(requestURL);
            
            if (auth_response == "")
            {
                user_key = null;
                return;
            }

            AuthenticationResponse auth = new System.Web.Script.Serialization.JavaScriptSerializer().Deserialize<AuthenticationResponse>(auth_response);
            user_key = auth.session.key;
            return;
        }

        private async Task<string> fetchURL(string URL)
        {
            using (var client = new HttpClient())
            {
                Dictionary<string, string> values = new Dictionary<string, string>();
                FormUrlEncodedContent content = new FormUrlEncodedContent(values);

                try
                {
                    HttpResponseMessage response = await client.PostAsync(URL, content);
                    if (response.StatusCode != HttpStatusCode.OK)
                    {
                        return "";
                    }
                    string responseString = await response.Content.ReadAsStringAsync();

                    return responseString;
                }
                catch (Exception e)
                {
                    return "";
                }
            }
        }

        private string signMethod(string method, Dictionary<string, string> attributes)
        {
            string stringToSign = "api_key" + API_KEY + "method" + method;
            List<string> keys = new List<string>(attributes.Keys);
            keys.Sort();
            foreach (string key in keys)
            {
                stringToSign += key + attributes[key];
            }
            stringToSign += API_SECRET;
            return BitConverter.ToString(((HashAlgorithm)CryptoConfig.CreateFromName("MD5")).ComputeHash(new UTF8Encoding().GetBytes(stringToSign))).Replace("-", string.Empty).ToLower();
        }
    }
}

namespace LastFMAPI
{
    public class AuthenticationResponse
    {
        public AuthenticationSession session { get; set; }
    }

    public class AuthenticationSession
    {
        public int subscriber { get; set; }
        public string name { get; set; }
        public string key { get; set; }
    }
}
