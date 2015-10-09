using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace Google_Play_Music
{
    public class SongAlert : Form
    {
        public Timer timer = new Timer();
        public int currentStep;

        public SongAlert(string song, string artist, string album, string url)
        {
            BackColor = Color.White;
            FormBorderStyle = FormBorderStyle.None;
            TopMost = true;
            Size = new Size(370, 70);
            Opacity = 0;
            ShowInTaskbar = false;

            Rectangle workingArea = Screen.GetWorkingArea(this);
            Location = new Point(workingArea.Right - Size.Width - 16,
                                      workingArea.Bottom - Size.Height + 16);

            PictureBox albumArt = new PictureBox();
            albumArt.Load(url);
            albumArt.Size = new Size(70, 70);
            Controls.Add(albumArt);

            Label songTitle = new Label();
            songTitle.Text = song;
            songTitle.Location = new Point(78, 12);
            songTitle.Font = SystemFonts.GetFontByName("Arial");
            songTitle.Font = new Font("Arial", 12, FontStyle.Regular);
            songTitle.Width = 300;
            Controls.Add(songTitle);

            Label songInfo = new Label();
            songInfo.Text = artist + " - " + album;
            songInfo.Location = new Point(78, 44);
            songInfo.Font = SystemFonts.GetFontByName("Arial");
            songInfo.Font = new Font("Arial", 8, FontStyle.Regular);
            songInfo.Width = 300;
            Controls.Add(songInfo);

            timer.Interval = 10;

            currentStep = 0;
            int fadeSteps = 25;
            int totalSteps = 250;
            timer.Tick += (arg1, arg2) =>
            {
                currentStep++;
                if (currentStep <= fadeSteps)
                {
                    Opacity = ((double)currentStep) / fadeSteps;
                } else if (currentStep <= totalSteps - fadeSteps)
                {
                    // Do something
                } else if (currentStep <= totalSteps)
                {
                    Opacity = ((double)(totalSteps - currentStep) / fadeSteps);
                } else
                {
                    this.Close();
                    timer.Stop();
                    timer.Dispose();
                }
            };

            timer.Start();
        }
    }
}
