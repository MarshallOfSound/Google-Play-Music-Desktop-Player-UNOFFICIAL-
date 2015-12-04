// Copyright (c) 2012, Yves Goergen, http://unclassified.software/source/colormath
//
// Copying and distribution of this file, with or without modification, are permitted provided the
// copyright notice and this notice are preserved. This file is offered as-is, without any warranty.

using Google_Play_Music.Utilities;
using System;
using System.ComponentModel;
using System.Drawing;
using System.Windows.Forms;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

namespace Google_Play_Music
{
    public class ColorWheel : Control
    {
        private Bitmap wheelBitmap;
        private Bitmap slBitmap;
        private byte hue;
        private byte saturation;
        private byte lightness;
        private byte[] secondaryHues;
        private bool draggingHue;
        private bool draggingSL;

        public event EventHandler HueChanged;
        public event EventHandler SLChanged;

        public byte Hue
        {
            get
            {
                return hue;
            }
            set
            {
                if (value != hue)
                {
                    hue = value;
                    PrepareSLBitmap();
                    Invalidate();
                }
            }
        }

        public byte Saturation
        {
            get
            {
                return saturation;
            }
            set
            {
                if (value != saturation)
                {
                    saturation = value;
                    Invalidate();
                }
            }
        }

        public byte Lightness
        {
            get
            {
                return lightness;
            }
            set
            {
                if (value != lightness)
                {
                    lightness = value;
                    Invalidate();
                }
            }
        }

        public byte[] SecondaryHues
        {
            get
            {
                return secondaryHues;
            }
            set
            {
                if ((value == null) != (secondaryHues == null) ||
                    value == null ||
                    value != null && value.Length != secondaryHues.Length)   // implies: secondaryHues != null
                {
                    secondaryHues = value;
                    Invalidate();
                }
                else if (value != null)
                {
                    for (int i = 0; i < value.Length; i++)
                    {
                        if (value[i] != secondaryHues[i])
                        {
                            secondaryHues = value;
                            Invalidate();
                            break;
                        }
                    }
                }
            }
        }

        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public new bool TabStop
        {
            get { return base.TabStop; }
            set { base.TabStop = false; }
        }

        public ColorWheel()
        {
            SetStyle(ControlStyles.SupportsTransparentBackColor, true);

            DoubleBuffered = true;
            TabStop = false;

            PrepareWheelBitmap();
        }

        protected override void OnSizeChanged(EventArgs e)
        {
            PrepareWheelBitmap();
            PrepareSLBitmap();
            base.OnSizeChanged(e);
        }

        //protected override void OnPaintBackground(PaintEventArgs pevent)
        //{
        //    if (VisualStyleRenderer.IsSupported)
        //    {
        //        // The VisualStyleElement does not matter, we're only drawing the parent's background
        //        VisualStyleRenderer r = new VisualStyleRenderer(VisualStyleElement.Window.Dialog.Normal);
        //        r.DrawParentBackground(pevent.Graphics, ClientRectangle, this);
        //    }
        //    else
        //    {
        //        base.OnPaintBackground(pevent);
        //    }
        //}
        // NOTE: Other solution: http://dotnetrix.co.uk/custom.htm#tip3

        protected override void OnPaint(PaintEventArgs pe)
        {
            // Draw outer color wheel bitmap
            if (wheelBitmap != null)
                pe.Graphics.DrawImage(wheelBitmap, new Point());

            // Draw inner color bitmap
            if (slBitmap != null)
                pe.Graphics.DrawImage(slBitmap, new Point(slBitmap.Width / 2, slBitmap.Width / 2));

            pe.Graphics.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;

            // Draw hue marker
            double radAngle = (double)hue / 128 * Math.PI + Math.PI / 2;
            // sin(angle) = y / d
            // cos(angle) = x / d
            double d = 0.89 * wheelBitmap.Width / 2;
            int x = (int)Math.Round(d * Math.Cos(radAngle));
            int y = (int)-Math.Round(d * Math.Sin(radAngle));
            // Map center-relative coordinates to window coordinates
            x += wheelBitmap.Width / 2;
            y += wheelBitmap.Width / 2;
            Color c = ColorMath.ToGray(ColorMath.HslToRgb(new HslColor(hue, 255, 128))) > 128 ? Color.Black : Color.White;
            using (Pen p = new Pen(c))
            {
                pe.Graphics.DrawEllipse(p, x - 3, y - 3, 6, 6);
            }

            // Draw secondary hue markers
            if (secondaryHues != null)
            {
                foreach (byte sHue in secondaryHues)
                {
                    radAngle = (double)sHue / 128 * Math.PI + Math.PI / 2;
                    // sin(angle) = y / d
                    // cos(angle) = x / d
                    d = 0.89 * wheelBitmap.Width / 2;
                    x = (int)Math.Round(d * Math.Cos(radAngle));
                    y = (int)-Math.Round(d * Math.Sin(radAngle));
                    // Map center-relative coordinates to window coordinates
                    x += wheelBitmap.Width / 2;
                    y += wheelBitmap.Width / 2;
                    c = ColorMath.ToGray(ColorMath.HslToRgb(new HslColor(sHue, 255, 128))) > 128 ? Color.Black : Color.White;
                    //using (Pen p = new Pen(Color.FromArgb(128, c)))
                    //{
                    //    pe.Graphics.DrawRectangle(p, x - 2, y - 2, 4, 4);
                    //}
                    using (Brush b = new SolidBrush(Color.FromArgb(128, c)))
                    {
                        pe.Graphics.FillRectangle(b, x - 2, y - 2, 4, 4);
                    }
                }
            }

            // Draw inner color marker
            x = slBitmap.Width / 2 + saturation * (slBitmap.Width - 1) / 255;
            y = slBitmap.Width / 2 + lightness * (slBitmap.Width - 1) / 255;
            c = ColorMath.ToGray(ColorMath.HslToRgb(new HslColor(hue, saturation, lightness))) > 128 ? Color.Black : Color.White;
            using (Pen p = new Pen(c))
            {
                pe.Graphics.DrawEllipse(p, x - 3, y - 3, 6, 6);
            }
        }

        protected override void OnMouseDown(MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                int halfSLWidth = slBitmap.Width / 2;
                if (e.X >= halfSLWidth && e.X < halfSLWidth * 3 &&
                    e.Y >= halfSLWidth && e.Y < halfSLWidth * 3)
                {
                    draggingSL = true;
                    OnMouseMove(e);
                }
                else
                {
                    int halfWheelWidth = wheelBitmap.Width / 2;
                    Point center = new Point(halfWheelWidth, halfWheelWidth);
                    double dist = GetDistance(new Point(e.X, e.Y), center);
                    if (dist >= halfWheelWidth * 0.78 && dist < halfWheelWidth)
                    {
                        draggingHue = true;
                        OnMouseMove(e);
                    }
                }
            }

            base.OnMouseDown(e);
        }
        protected override void OnMouseUp(MouseEventArgs e)
        {
            draggingSL = false;
            draggingHue = false;

            base.OnMouseUp(e);
        }

        protected override void OnMouseMove(MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                if (draggingSL)
                {
                    int halfSLWidth = slBitmap.Width / 2;
                    Saturation = (byte)Math.Max(0, Math.Min(255, (e.X - halfSLWidth) * 255 / slBitmap.Width));
                    Lightness = (byte)Math.Max(0, Math.Min(255, (e.Y - halfSLWidth) * 255 / slBitmap.Width));
                    OnSLChanged();
                }
                else if (draggingHue)
                {
                    int halfWheelWidth = wheelBitmap.Width / 2;
                    Point center = new Point(halfWheelWidth, halfWheelWidth);
                    double radAngle = Math.Atan2(e.Y - center.Y, e.X - center.X);
                    double factor = 128.0 / Math.PI;   // map -pi...pi to 0...255 => map 0...pi to 0...128
                                                       // Calculation notes see PrepareWheelBitmap()
                    Hue = (byte)Mod((int)(-factor * radAngle + 192), 256);
                    OnHueChanged();
                }
            }

            base.OnMouseMove(e);
        }

        private void PrepareWheelBitmap()
        {
            if (wheelBitmap != null)
                wheelBitmap.Dispose();

            int width = Math.Min(ClientSize.Width, ClientSize.Height);
            Point center = new Point(width / 2, width / 2);
            if (width < 10)
            {
                wheelBitmap = null;
                return;
            }

            // Prepare Bitmap
            wheelBitmap = new Bitmap(width, width);

            // Fill background
            Graphics g = Graphics.FromImage(wheelBitmap);
            using (Brush b = new SolidBrush(Color.Transparent))
            {
                g.FillRectangle(b, 0, 0, width, width);
            }

            // Paint outer color wheel
            double minDist = width / 2 * 0.78;
            double maxDist = width / 2 - 1;
            double factor = 128.0 / Math.PI;   // map -pi...pi to 0...255 => map 0...pi to 0...128

            BitmapData bmData;
            byte[] bytes;
            BitmapReadBytes(wheelBitmap, out bytes, out bmData);
            for (int y = 0; y < width; y++)
            {
                for (int x = 0; x < width; x++)
                {
                    double dist = GetDistance(new Point(x, y), center);
                    byte alpha;
                    if (dist < minDist - 0.5)
                        alpha = 0;
                    else if (dist < minDist + 0.5)
                        alpha = (byte)((0.5 - minDist + dist) * 255);
                    else if (dist < maxDist - 0.5)
                        alpha = 255;
                    else if (dist < maxDist + 0.5)
                        alpha = (byte)((0.5 + maxDist - dist) * 255);
                    else
                        alpha = 0;

                    if (alpha > 0)
                    {
                        double radAngle = Math.Atan2(y - center.Y, x - center.X);
                        // -pi   -> -180° -> 192
                        // -pi/2 ->  -90° -> 128
                        // 0     ->    0° ->  64
                        // pi/2  ->   90° ->   0
                        // pi    ->  180° -> 192
                        //
                        // y = a * x + t;
                        // a = -1
                        // t = 192
                        byte hue = (byte)Mod((int)(-factor * radAngle + 192), 256);
                        Color c = Color.FromArgb(alpha, ColorMath.HslToRgb(new HslColor(hue, 255, 128)));
                        BitmapSetPixel(bytes, bmData, x, y, c);
                    }
                }
            }
            BitmapWriteBytes(wheelBitmap, bytes, bmData);
        }

        private void PrepareSLBitmap()
        {
            if (slBitmap != null)
                slBitmap.Dispose();

            int width = Math.Min(ClientSize.Width, ClientSize.Height) / 2;
            if (width < 10)
            {
                slBitmap = null;
                return;
            }

            // Prepare Bitmap
            slBitmap = new Bitmap(width, width);

            BitmapData bmData;
            byte[] bytes;
            BitmapReadBytes(slBitmap, out bytes, out bmData);
            for (int y = 0; y < width; y++)
            {
                for (int x = 0; x < width; x++)
                {
                    Color c = ColorMath.HslToRgb(new HslColor(hue, (byte)(x * 255 / width), (byte)(y * 255 / width)));
                    BitmapSetPixel(bytes, bmData, x, y, c);
                }
            }
            BitmapWriteBytes(slBitmap, bytes, bmData);
        }

        private void BitmapReadBytes(Bitmap bmp, out byte[] bytes, out BitmapData bmData)
        {
            bmData = bmp.LockBits(
                new Rectangle(0, 0, bmp.Width, bmp.Height),
                ImageLockMode.ReadWrite,
                PixelFormat.Format32bppArgb);
            const int bpp = 4;
            bytes = new byte[bmp.Width * bmp.Height * bpp];
            Marshal.Copy(bmData.Scan0, bytes, 0, bytes.Length);
        }

        private void BitmapSetPixel(byte[] bytes, BitmapData bmData, int x, int y, Color c)
        {
            int i = y * bmData.Stride + x * 4;
            bytes[i] = c.B;
            bytes[i + 1] = c.G;
            bytes[i + 2] = c.R;
            bytes[i + 3] = c.A;
        }

        private void BitmapWriteBytes(Bitmap bmp, byte[] bytes, BitmapData bmData)
        {
            Marshal.Copy(bytes, 0, bmData.Scan0, bytes.Length);
            bmp.UnlockBits(bmData);
        }

        private double GetDistance(Point a, Point b)
        {
            return Math.Sqrt((a.X - b.X) * (a.X - b.X) + (a.Y - b.Y) * (a.Y - b.Y));
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

        protected void OnHueChanged()
        {
            if (HueChanged != null)
                HueChanged(this, EventArgs.Empty);
        }

        protected void OnSLChanged()
        {
            if (SLChanged != null)
                SLChanged(this, EventArgs.Empty);
        }
    }
}