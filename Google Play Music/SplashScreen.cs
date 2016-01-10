using System.Windows.Forms;

namespace Google_Play_Music
{
    public partial class SplashScreen : Form
    {
        public SplashScreen()
        {
            InitializeComponent();
            if (Properties.Settings.Default.CustomTheme) {
                splashImage.Image = Properties.Resources.SplashDark;
                BackColor = Properties.Settings.Default.CustomColor;
            }
        }
    }
}
