using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Web.Script.Serialization;

namespace Google_Play_Music
{
    class PlayStatus
    {
        private bool publish;
        private string filename;

        public PlaybackInformation information = new PlaybackInformation();

        internal class PlaybackInformation
        {
            public bool isPlaying = false;
            public string song = "";
            public string artist = "";
            public string album = "";
            public string imageURL = "";
        }


        PlayStatus()
        {
            this.UpdateSettings();
        }



        private string getStatusString()
        {
            return new JavaScriptSerializer().Serialize(information);
        }

        public void UpdateSettings()
        {
            this.publish = Properties.Settings.Default.PublishPlaybackInformation;
            this.filename = Properties.Settings.Default.PublishPlaybackInformationPath;
        }

        public void Update()
        {
            if (this.publish)
            {
                System.IO.File.WriteAllText(Environment.ExpandEnvironmentVariables(this.filename), getStatusString());
            }
        }



        private static PlayStatus instance;

        public static PlayStatus Instance
        {
            get
            {
                if (instance == null)
                {
                    instance = new PlayStatus();
                }
                return instance;
            }
        }

    }
}
