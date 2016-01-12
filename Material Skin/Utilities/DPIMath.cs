using System.Drawing;
using System.Windows.Forms;

namespace MaterialSkin.Utilities
{
    public class DPIMath
    {
        private const int defaultDPI = 96;

        public static int ratioX(Form anyForm)
        {
            Graphics graphics = anyForm.CreateGraphics();
            return (int)graphics.DpiX / defaultDPI;
        }

        public static int ratioY(Form anyForm)
        {
            Graphics graphics = anyForm.CreateGraphics();
            return (int)graphics.DpiY / defaultDPI;
        }
    }
}
