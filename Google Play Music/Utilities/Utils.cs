using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;

namespace Google_Play_Music.Utilities
{
    public static class Utils
    {
        public static Color ColorFromUInt(uint color, bool opaque)
        {
            /*return System.Drawing.Color.FromArgb(
                (byte)(opaque ? 255 : color >> 24),
                (byte)color >> 16,
                (byte)color >> 8,
                (byte)color);*/

            return Color.FromArgb((int)color);
        }

        public static float Magnitude(this float[] arr)
        {
            float sum = 0;
            foreach(float x in arr)
            {
                sum += x * x;
            }

            return (float)Math.Sqrt(sum);
        }
    }
}
