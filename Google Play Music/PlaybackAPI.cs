using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web.Script.Serialization;

namespace Google_Play_Music
{

    class PlaybackAPI
    {
        private const string PLAYBACK_INFORMATION_FILE_PATH = "%APPDATA%\\GPMDP\\playback-information.json";

        public bool isActive { get; private set; } = true;
        public bool isPlaying { get; private set; } = false;
        public string song { get; private set; } = "";
        public string artist { get; private set; } = "";
        public string album { get; private set; } = "";
        public string imageURL { get; private set; } = "";


        private PlaybackAPI()
        {
            // Explicitly declare the constructor private
        }


        private static PlaybackAPI instance;
        public static PlaybackAPI Instance
        {
            get
            {
                if (instance == null)
                {
                    instance = new PlaybackAPI();
                }
                return instance;
            }
        }


        private string getInformationString()
        {
            return new JavaScriptSerializer().Serialize(this);
        }

        private void storeInformationInFile()
        {
            // Prepare path: (i.e. expand %APPDATA% to C:\Users\...)
            string path = Environment.ExpandEnvironmentVariables(PLAYBACK_INFORMATION_FILE_PATH);

            // Ensure path exists:
            string directory = Path.GetDirectoryName(path);
            Directory.CreateDirectory(directory);

            // Write playback information:
            File.WriteAllText(path, getInformationString());
        }


        public void UpdateApplicationStatus(bool isActive)
        {
            this.isActive = isActive;
            if (!isActive)
            {
                // Clean all data when application is stopped:
                this.isPlaying = false;
                this.song = "";
                this.artist = "";
                this.album = "";
                this.imageURL = "";
            }
            this.storeInformationInFile();
        }

        public void UpdatePlaybackStatus(bool isPlaying)
        {
            this.isPlaying = isPlaying;
            this.storeInformationInFile();
        }

        public void UpdateCurrentSong(string song, string artist, string album, string imageURL)
        {
            this.song = song;
            this.artist = artist;
            this.album = album;
            this.imageURL = imageURL;
            this.storeInformationInFile();
        }

    }
}
