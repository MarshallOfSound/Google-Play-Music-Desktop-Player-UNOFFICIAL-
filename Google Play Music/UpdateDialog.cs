﻿using MaterialSkin;
using MaterialSkin.Controls;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Google_Play_Music
{
    class UpdateDialog : MaterialForm
    {
        private MaterialRaisedButton notNowButton;
        private MaterialRaisedButton updateButton;
        private MaterialLabel changeLogText;
        private MaterialSkinManager skin;

        public UpdateDialog(string changeLog, string oldVersion, string newVersion)
        {
            // Hide some controls
            MaximizeBox = false;
            MinimizeBox = false;
            
            // Theme it :D
            skin = MaterialSkinManager.Instance;
            // Small color change between the update dialog and the core app
            MaterialSkinManager.BACKGROUND_LIGHT = Color.FromArgb(255, 255, 255, 255);
            FormClosing += (send, res) =>
            {
                MaterialSkinManager.BACKGROUND_LIGHT = Color.FromArgb(255, 239, 108, 0);
            };
            // Material skin should manage this form
            skin.AddFormToManage(this);
            SetTopLevel(true);
            InitializeComponent();

            // Click hooks
            this.notNowButton.MouseClick += async (res, send) =>
            {
                await TaskEx.Delay(400);
                Close();
            };
            this.updateButton.MouseClick += async (res, send) =>
            {
                DialogResult = DialogResult.Yes;
                await TaskEx.Delay(400);
                Close();
            };

            // Calculate how big the change log is
            string[] lines = changeLog.Split(new string[] { "\n" }, StringSplitOptions.None);
            int drawnLines = 0;
            int lineHeight = 20;
            foreach(string line in lines) {
                drawnLines += (int)Math.Ceiling((double)((TextRenderer.MeasureText(line, changeLogText.Font).Width) / (double)(changeLogText.Width)));
            }
            // Put the changelog text into the label
            changeLogText.Text = changeLog;

            // Update the size and position of controls to accomodate the changelog
            changeLogText.Size = new Size(changeLogText.Size.Width, lineHeight * drawnLines);
            ClientSize = new Size(500, 140 + Math.Max(160, lineHeight * drawnLines));
            notNowButton.Location = new Point(notNowButton.Location.X, ClientSize.Height - 43);
            updateButton.Location = new Point(updateButton.Location.X, ClientSize.Height - 43);

            // Position the update notification in the center of the primary screen
            Rectangle area = Screen.PrimaryScreen.WorkingArea;
            StartPosition = FormStartPosition.Manual;
            Screen s = Screen.PrimaryScreen;
            Point loc = s.WorkingArea.Location;
            int X = (s.WorkingArea.Width / 2) - (Size.Width / 2) + loc.X;
            int Y = (s.WorkingArea.Height / 2) - (Size.Height / 2) + loc.Y;
            Location = new Point((X > 0 ? X : 0), (Y > 0 ? Y : 0));

            DialogResult = DialogResult.Cancel;
        }

        private void InitializeComponent()
        {
            this.notNowButton = new MaterialSkin.Controls.MaterialRaisedButton();
            this.updateButton = new MaterialSkin.Controls.MaterialRaisedButton();
            this.changeLogText = new MaterialSkin.Controls.MaterialLabel();
            this.SuspendLayout();
            // 
            // notNowButton
            // 
            this.notNowButton.Depth = 0;
            this.notNowButton.Location = new System.Drawing.Point(12, 257);
            this.notNowButton.MouseState = MaterialSkin.MouseState.HOVER;
            this.notNowButton.Name = "notNowButton";
            this.notNowButton.Primary = true;
            this.notNowButton.Size = new System.Drawing.Size(120, 31);
            this.notNowButton.TabIndex = 0;
            this.notNowButton.Text = "Not Now";
            this.notNowButton.UseVisualStyleBackColor = true;
            // 
            // updateButton
            // 
            this.updateButton.Depth = 0;
            this.updateButton.Location = new System.Drawing.Point(368, 257);
            this.updateButton.MouseState = MaterialSkin.MouseState.HOVER;
            this.updateButton.Name = "updateButton";
            this.updateButton.Primary = true;
            this.updateButton.Size = new System.Drawing.Size(120, 31);
            this.updateButton.TabIndex = 1;
            this.updateButton.Text = "Update";
            this.updateButton.UseVisualStyleBackColor = true;
            // 
            // changeLogText
            // 
            this.changeLogText.Depth = 0;
            this.changeLogText.Font = new System.Drawing.Font("Roboto", 11F);
            this.changeLogText.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(222)))), ((int)(((byte)(0)))), ((int)(((byte)(0)))), ((int)(((byte)(0)))));
            this.changeLogText.Location = new System.Drawing.Point(12, 75);
            this.changeLogText.MouseState = MaterialSkin.MouseState.HOVER;
            this.changeLogText.Name = "changeLogText";
            this.changeLogText.Size = new System.Drawing.Size(476, 160);
            this.changeLogText.TabIndex = 2;
            this.changeLogText.Text = "changeLogText";
            // 
            // UpdateDialog
            // 
            this.ClientSize = new System.Drawing.Size(500, 300);
            this.Controls.Add(this.changeLogText);
            this.Controls.Add(this.updateButton);
            this.Controls.Add(this.notNowButton);
            this.Icon = global::Google_Play_Music.Properties.Resources.MainIcon;
            this.Name = "UpdateDialog";
            this.Text = "An Update is Available";
            this.ResumeLayout(false);

        }
    }
}
