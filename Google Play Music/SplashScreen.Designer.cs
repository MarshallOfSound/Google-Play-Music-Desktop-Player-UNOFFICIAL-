namespace Google_Play_Music
{
    partial class SplashScreen
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.splashImage = new System.Windows.Forms.PictureBox();
            ((System.ComponentModel.ISupportInitialize)(this.splashImage)).BeginInit();
            this.SuspendLayout();
            // 
            // splashImage
            // 
            this.splashImage.BackColor = System.Drawing.Color.Transparent;
            this.splashImage.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.splashImage.Image = global::Google_Play_Music.Properties.Resources.Splash;
            this.splashImage.Location = new System.Drawing.Point(-7, -4);
            this.splashImage.Margin = new System.Windows.Forms.Padding(0);
            this.splashImage.Name = "splashImage";
            this.splashImage.Size = new System.Drawing.Size(815, 382);
            this.splashImage.SizeMode = System.Windows.Forms.PictureBoxSizeMode.StretchImage;
            this.splashImage.TabIndex = 0;
            this.splashImage.TabStop = false;
            // 
            // SplashScreen
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.Red;
            this.ClientSize = new System.Drawing.Size(800, 371);
            this.Controls.Add(this.splashImage);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.Name = "SplashScreen";
            this.ShowIcon = false;
            this.ShowInTaskbar = false;
            this.Text = "SplashScreen";
            this.TopMost = true;
            ((System.ComponentModel.ISupportInitialize)(this.splashImage)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.PictureBox splashImage;
    }
}