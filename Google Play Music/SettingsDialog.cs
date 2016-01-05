﻿using Google_Play_Music.Utilities;
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

            materialCheckBox4.Checked = Properties.Settings.Default.MiniAlwaysOnTop;
            materialCheckBox4.CheckStateChanged += (res, send) =>
            {
                Properties.Settings.Default.MiniAlwaysOnTop = materialCheckBox4.Checked;
            };

            materialCheckBox5.Checked = Properties.Settings.Default.UseSystemColor;
            materialCheckBox5.CheckStateChanged += (res, send) =>
            {
                Properties.Settings.Default.UseSystemColor = materialCheckBox5.Checked;
                

                app.Invoke((MethodInvoker)delegate
                {
                    colorWheel1.Enabled = !materialCheckBox5.Checked;

                    if (materialCheckBox5.Checked)
                    {
                        uint col = 0;
                        bool opaque = false;
                        NativeMethods.DwmGetColorizationColor(out col, out opaque);
                        
                        Color c = Properties.Settings.Default.CustomColor = Utils.FromUInt(col, opaque);
                        set = ColorMath.RgbToHsl(c);
                        colorWheel1.Hue = set.H;
                        colorWheel1.Saturation = set.S;
                        colorWheel1.Lightness = set.L;
                        string RGB = "#" + c.R.ToString("X2") + c.G.ToString("X2") + c.B.ToString("X2");
                        app.Invoke((MethodInvoker)delegate
                        {
                            app.GPMBrowser.EvaluateScriptAsync("(function() {window.CustomColor = '" + RGB + "'; window.ReDrawTheme();})();");
                        });
                    }
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
    }
}
