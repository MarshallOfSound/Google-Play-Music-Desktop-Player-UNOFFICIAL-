using System;
using System.Drawing;
using System.Windows.Forms;
using MaterialSkin;
using MaterialSkin.Controls;
using System.Diagnostics;
using CefSharp;

namespace Google_Play_Music
{
    public partial class SettingsDialog : MaterialForm
    {
        CoreMusicApp app;

        public SettingsDialog(CoreMusicApp main)
        {
            app = main;
            InitializeComponent();
            Resize_Enabled = false;

            var skin = MaterialSkinManager.Instance;
            skin.AddFormToManage(this);

            colorWheel1.MouseUp += Color_Changed;
            HslColor set = ColorMath.RgbToHsl(Properties.Settings.Default.CustomColor);
            colorWheel1.Hue = set.H;
            colorWheel1.Saturation = set.S;
            colorWheel1.Lightness = set.L;

            materialCheckBox1.Checked = Properties.Settings.Default.CustomTheme;
            materialCheckBox1.CheckStateChanged += (res, send) =>
            {
                string command;
                if (materialCheckBox1.Checked)
                {
                    command = "window.turnOnCustom()";
                    app.Invoke((MethodInvoker)delegate
                    {
                        app.darkTheme();
                    });
                } else
                {
                    command = "window.turnOffCustom()";
                    app.Invoke((MethodInvoker)delegate
                    {
                        app.lightTheme();
                    });
                }
                app.Invoke((MethodInvoker)delegate
                {
                    app.GPMBrowser.EvaluateScriptAsync("(function() {" + command + ";})();");
                });
            };

            materialCheckBox2.Checked = Properties.Settings.Default.DesktopNotifications;
            materialCheckBox2.CheckStateChanged += (res, send) =>
            {
                if (materialCheckBox2.Checked)
                {
                    Properties.Settings.Default.DesktopNotifications = true;
                } else
                {
                    Properties.Settings.Default.DesktopNotifications = false;
                }
                Properties.Settings.Default.Save();
            };

            materialCheckBox3.Checked = !Properties.Settings.Default.HoverControls;
            materialCheckBox3.CheckStateChanged += (res, send) =>
            {
                Properties.Settings.Default.HoverControls = !materialCheckBox3.Checked;
                app.Invoke((MethodInvoker)delegate
                {
                    app.GPMBrowser.EvaluateScriptAsync("(function() {window.hoverControls = " + (!materialCheckBox3.Checked).ToString().ToLower() + "})();");
                });
            };

            materialRaisedButton1.Click += (res, send) =>
            {
                Properties.Settings.Default.Reset();
                Properties.Settings.Default.Save();
                DialogResult = DialogResult.Abort;
                Close();
            };
        }

        private void Color_Changed(object sender, EventArgs e)
        {
            Properties.Settings.Default.CustomColor = ColorMath.HslToRgb(new HslColor(colorWheel1.Hue, colorWheel1.Saturation, colorWheel1.Lightness));
            Color c = Properties.Settings.Default.CustomColor;
            string RGB = "#" + c.R.ToString("X2") + c.G.ToString("X2") + c.B.ToString("X2");
            app.Invoke((MethodInvoker)delegate
            {
                app.GPMBrowser.EvaluateScriptAsync("(function() {window.CustomColor = '" + RGB + "'; window.ReDrawTheme();})();");
            });
        }

        public DialogResult open(int X, int Y)
        {
            Activated += (res, send) =>
            {
                Location = new Point(X - 300, Y - 125);
            };
            var result = ShowDialog();
            return result;
        }
    }
}
