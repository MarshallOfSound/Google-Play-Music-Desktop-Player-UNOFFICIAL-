using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Google_Play_Music.Utilities
{
    public class Utils
    {
        public static System.Drawing.Color FromUInt(uint color, bool opaque)
        {
            return System.Drawing.Color.FromArgb(
                (byte)(opaque ? 255 : color >> 24),
                (byte)color >> 16,
                (byte)color >> 8,
                (byte)color);
        }
    }
}
