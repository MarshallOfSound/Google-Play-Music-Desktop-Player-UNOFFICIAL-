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
            SetColorWheelToRgb(Properties.Settings.Default.CustomColor);

            themeHexTextBox.Text = ColorMath.RgbToHex(Properties.Settings.Default.CustomColor);

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

            lastFMUsername.Text = Properties.Settings.Default.LastFMUsername;
            lastFMUsername.GotFocus += (res, send) =>
            {
                focusDefaultInputField(lastFMUsername, "Username", true);
            };
            lastFMUsername.LostFocus += async (res, send) =>
            {
                focusDefaultInputField(lastFMUsername, "Username", false);
                Properties.Settings.Default.LastFMUsername = lastFMUsername.Text;
                lastFMAuth(-1);
                await new LastFM().init();
                lastFMAuth((LastFM.user_key != null ? 1 : 0));
            };
            lastFMUsername.KeyPress += (send, e) =>
            {
                if (e.KeyChar == (char)13)
                {
                    lastFMPassword.Focus();
                }
            };

            lastFMPassword.Text = Properties.Settings.Default.LastFMPassword;
            lastFMPassword.GotFocus += (res, send) =>
            {
                focusDefaultInputField(lastFMPassword, "1234567", true);
            };
            lastFMPassword.LostFocus += async (res, send) =>
            {
                focusDefaultInputField(lastFMPassword, "1234567", false);
                Properties.Settings.Default.LastFMPassword = lastFMPassword.Text;
                lastFMAuth(-1);
                await new LastFM().init();
                lastFMAuth((LastFM.user_key != null ? 1 : 0));
            };
            lastFMPassword.KeyPress += (send, e) =>
            {
                if (e.KeyChar == (char)13)
                {
                    lastFMUsername.Focus();
                }
            };
        }

        private void SetColorWheelToRgb(Color color)
        {
            HslColor set = ColorMath.RgbToHsl(color);
            colorWheel1.Hue = set.H;
            colorWheel1.Saturation = set.S;
            colorWheel1.Lightness = set.L;
        }

        private void focusDefaultInputField(MaterialSingleLineTextField field, string defaultText, bool focus)
        {
            if (field.Text == defaultText && focus)
            {
                field.Text = "";
            } else if (field.Text == "" && !focus)
            {
                field.Text = defaultText;
            }
        }

        private void Color_Changed(object sender, EventArgs e)
        {
            Color color = ColorMath.HslToRgb(new HslColor(colorWheel1.Hue, colorWheel1.Saturation, colorWheel1.Lightness));
            string hex = SetThemeToColor(color);

        }

        private string SetThemeToColor(Color color)
        {
            Properties.Settings.Default.CustomColor = color;
            string hex = ColorMath.RgbToHex(color);

            app.Invoke((MethodInvoker)delegate
                    {
                        app.GPMBrowser.EvaluateScriptAsync("(function() {window.CustomColor = '" + hex +"'; window.ReDrawTheme();})();");
                    });


            themeHexTextBox.Text = hex;

            return hex;
        }

        public DialogResult open(int X, int Y)
        {
            Activated += (res, send) =>
            {
                lastFMAuth((LastFM.user_key != null ? 1 : 0));
                Location = new Point(X - 300, Y - 200);
            };
            var result = ShowDialog();
            return result;
        }

        private void lastFMAuth(int isAuth)
        {
            // 1 = Auth Success
            // 0 = Auth Failure
            // -1 = Auth in Progress
            if (isAuth == 1)
            {
                lastFMAuthIndicator.ForeColor = Color.Green;
                lastFMAuthIndicator.Text = "Login Successful";
            } else if (isAuth == 0)
            {
                lastFMAuthIndicator.ForeColor = Color.Red;
                lastFMAuthIndicator.Text = "Login Failed";
            } else if (isAuth == -1)
            {
                lastFMAuthIndicator.ForeColor = Color.Yellow;
                lastFMAuthIndicator.Text = "Logging in...";
            }
        }

        private void setCusomHexBtn_Click(object sender, EventArgs e)
        {
            Color rgb = ColorMath.HexToRgb(themeHexTextBox.Text);
            SetColorWheelToRgb(rgb);
            SetThemeToColor(rgb);
        }
    }
}
