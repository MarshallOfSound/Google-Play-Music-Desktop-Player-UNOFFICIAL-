using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Google_Play_Music.Utilities
{
    public static class Utils
    {
        public static System.Drawing.Color ToColor(this int argb)
        {
            return System.Drawing.Color.FromArgb(
                (argb & 0xff0000) >> 16,
                (argb & 0xff00) >> 8,
                 argb & 0xff);
        }

        public static System.Drawing.Color ColorFromUInt(uint color, bool opaque)
        {
            /*return System.Drawing.Color.FromArgb(
                (byte)(opaque ? 255 : color >> 24),
                (byte)color >> 16,
                (byte)color >> 8,
                (byte)color);*/

            return System.Drawing.Color.FromArgb((int)color);
        }
    }
}
