using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;

namespace Google_Play_Music.Utilities
{
    public static class ColorMath
    {
        /// <summary>
        /// Blends two colors in the specified ratio.
        /// </summary>
        /// <param name="color1">First color.</param>
        /// <param name="color2">Second color.</param>
        /// <param name="ratio">Ratio between both colors. 0 for first color, 1 for second color.</param>
        /// <returns></returns>
        public static Color Blend(Color color1, Color color2, double ratio)
        {
            int a = (int)Math.Round(color1.A * (1 - ratio) + color2.A * ratio);
            int r = (int)Math.Round(color1.R * (1 - ratio) + color2.R * ratio);
            int g = (int)Math.Round(color1.G * (1 - ratio) + color2.G * ratio);
            int b = (int)Math.Round(color1.B * (1 - ratio) + color2.B * ratio);
            return Color.FromArgb(a, r, g, b);
        }

        public static Color Darken(Color color, double ratio)
        {
            return Blend(color, Color.Black, ratio);
        }

        public static Color Lighten(Color color, double ratio)
        {
            return Blend(color, Color.White, ratio);
        }

        public static HslColor RgbToHsl(Color rgb)
        {
            // Translated from JavaScript, part of coati
            double h, s, l;
            double r = (double)rgb.R / 255;
            double g = (double)rgb.G / 255;
            double b = (double)rgb.B / 255;
            double min = Math.Min(Math.Min(r, g), b);
            double max = Math.Max(Math.Max(r, g), b);

            l = (max + min) / 2;

            if (max == min)
                h = 0;
            else if (max == r)
                h = (60 * (g - b) / (max - min)) % 360;
            else if (max == g)
                h = (60 * (b - r) / (max - min) + 120) % 360;
            else //if (max == b)
                h = (60 * (r - g) / (max - min) + 240) % 360;
            if (h < 0)
                h += 360;

            if (max == min)
                s = 0;
            else if (l <= 0.5)
                s = (max - min) / (2 * l);
            else
                s = (max - min) / (2 - 2 * l);

            return new HslColor((byte)Math.Round((h / 360 * 256) % 256), (byte)Math.Round(s * 255), (byte)Math.Round(l * 255));
        }

        public static Color HslToRgb(HslColor hsl)
        {
            // Translated from JavaScript, part of coati
            double h = (double)hsl.H / 256;
            double s = (double)hsl.S / 255;
            double l = (double)hsl.L / 255;
            double q;
            if (l < 0.5)
                q = l * (1 + s);
            else
                q = l + s - l * s;
            double p = 2 * l - q;
            double[] t = new double[] { h + 1.0 / 3, h, h - 1.0 / 3 };
            byte[] rgb = new byte[3];
            for (int i = 0; i < 3; i++)
            {
                if (t[i] < 0) t[i]++;
                if (t[i] > 1) t[i]--;
                if (t[i] < 1.0 / 6)
                    rgb[i] = (byte)Math.Round((p + ((q - p) * 6 * t[i])) * 255);
                else if (t[i] < 1.0 / 2)
                    rgb[i] = (byte)Math.Round(q * 255);
                else if (t[i] < 2.0 / 3)
                    rgb[i] = (byte)Math.Round((p + ((q - p) * 6 * (2.0 / 3 - t[i]))) * 255);
                else
                    rgb[i] = (byte)Math.Round(p * 255);
            }
            return Color.FromArgb(rgb[0], rgb[1], rgb[2]);
        }

        /// <summary>
        /// Computes the real modulus value, not the division remainder.
        /// This differs from the % operator only for negative numbers.
        /// </summary>
        /// <param name="dividend">Dividend.</param>
        /// <param name="divisor">Divisor.</param>
        /// <returns></returns>
        private static int Mod(int dividend, int divisor)
        {
            if (divisor <= 0) throw new ArgumentOutOfRangeException("divisor", "The divisor cannot be zero or negative.");
            int i = dividend % divisor;
            if (i < 0) i += divisor;
            return i;
        }

        /// <summary>
        /// Computes the grey value value of a color.
        /// </summary>
        /// <param name="c"></param>
        /// <returns></returns>
        public static byte ToGray(Color c)
        {
            return (byte)(c.R * 0.3 + c.G * 0.59 + c.B * 0.11);
        }

        /// <summary>
        /// Determines whether the color is dark or light.
        /// </summary>
        /// <param name="c"></param>
        /// <returns></returns>
        public static bool IsDarkColor(Color c)
        {
            return ToGray(c) < 0x90;
        }
    }
}
