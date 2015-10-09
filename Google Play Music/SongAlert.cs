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
            Size = new Size(390, 70);
            Opacity = 0;
            ShowInTaskbar = false;
            Load += new EventHandler(Alert_Loaded);

            Rectangle workingArea = Screen.GetWorkingArea(this);
            Location = new Point(workingArea.Right - Size.Width - 16,
                                      workingArea.Bottom - Size.Height + 16);

            PictureBox albumArt = new PictureBox();
            albumArt.Load(url);
            albumArt.Size = new Size(70, 70);
            albumArt.SizeMode = PictureBoxSizeMode.StretchImage;
            Controls.Add(albumArt);

            int n = 12;
            Font titleFont = new Font("Arial", n, FontStyle.Regular);
            while (TextRenderer.MeasureText(song, titleFont).Width > 312)
            {
                if (n < 6)
                {
                    break;
                }
                titleFont = new Font("Arial", n--, FontStyle.Regular);
            }

            Label songTitle = new Label();
            songTitle.Text = song;
            songTitle.Location = new Point(78, 12);
            songTitle.Font = titleFont;
            songTitle.Width = 312;
            Controls.Add(songTitle);

            if (n > 10)
            {
                n = 10;
            }
            Font infoFont = new Font("Arial", n, FontStyle.Regular);
            while (TextRenderer.MeasureText(artist + " - " + album, infoFont).Width > 312)
            {
                if (n < 6)
                {
                    break;
                }
                infoFont = new Font("Arial", n--, FontStyle.Regular);
            }

            Label songInfo = new Label();
            songInfo.Text = artist + " - " + album;
            songInfo.Location = new Point(78, 44);
            songInfo.Font = SystemFonts.GetFontByName("Arial");
            songInfo.Font = infoFont;
            songInfo.Width = 312;
            Controls.Add(songInfo);
        }

        private void Alert_Loaded(object sender, EventArgs e)
        {
            timer.Interval = 10;

            currentStep = 0;
            int fadeSteps = 25;
            int totalSteps = 200;
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

            TopMost = true;
            TopLevel = true;
            BringToFront();
        }
    }
}
