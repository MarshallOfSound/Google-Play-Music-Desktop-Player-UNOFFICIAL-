using System;
using System.Drawing;
using System.Threading.Tasks;
using System.Windows.Forms;
using Google_Play_Music.Properties;
using MaterialSkin;
using MaterialSkin.Controls;

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
            notNowButton.MouseClick += async (res, send) =>
            {
                await TaskEx.Delay(400);
                Close();
            };
            updateButton.MouseClick += async (res, send) =>
            {
                DialogResult = DialogResult.Yes;
                await TaskEx.Delay(400);
                Close();
            };

            // Calculate how big the change log is
            string[] lines = changeLog.Split(new[] { "\n" }, StringSplitOptions.None);
            int drawnLines = 0;
            int lineHeight = 20;
            foreach(string line in lines) {
                drawnLines += (int)Math.Ceiling((TextRenderer.MeasureText(line, changeLogText.Font).Width) / (double)(changeLogText.Width));
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
            notNowButton = new MaterialRaisedButton();
            updateButton = new MaterialRaisedButton();
            changeLogText = new MaterialLabel();
            SuspendLayout();
            // 
            // notNowButton
            // 
            notNowButton.Depth = 0;
            notNowButton.Location = new Point(12, 257);
            notNowButton.MouseState = MouseState.HOVER;
            notNowButton.Name = "notNowButton";
            notNowButton.Primary = true;
            notNowButton.Size = new Size(120, 31);
            notNowButton.TabIndex = 0;
            notNowButton.Text = "Not Now";
            notNowButton.UseVisualStyleBackColor = true;
            // 
            // updateButton
            // 
            updateButton.Depth = 0;
            updateButton.Location = new Point(368, 257);
            updateButton.MouseState = MouseState.HOVER;
            updateButton.Name = "updateButton";
            updateButton.Primary = true;
            updateButton.Size = new Size(120, 31);
            updateButton.TabIndex = 1;
            updateButton.Text = "Update";
            updateButton.UseVisualStyleBackColor = true;
            // 
            // changeLogText
            // 
            changeLogText.Depth = 0;
            changeLogText.Font = new Font("Roboto", 11F);
            changeLogText.ForeColor = Color.FromArgb(222, 0, 0, 0);
            changeLogText.Location = new Point(12, 75);
            changeLogText.MouseState = MouseState.HOVER;
            changeLogText.Name = "changeLogText";
            changeLogText.Size = new Size(476, 160);
            changeLogText.TabIndex = 2;
            changeLogText.Text = "changeLogText";
            // 
            // UpdateDialog
            // 
            ClientSize = new Size(500, 300);
            Controls.Add(changeLogText);
            Controls.Add(updateButton);
            Controls.Add(notNowButton);
            Icon = Resources.MainIcon;
            Name = "UpdateDialog";
            Text = "An Update is Available";
            ResumeLayout(false);

        }
    }
}
