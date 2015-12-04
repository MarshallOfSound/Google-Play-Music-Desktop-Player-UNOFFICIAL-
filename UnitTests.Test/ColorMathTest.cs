using Google_Play_Music.Utilities;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;


namespace UnitTests.Test
{
    using NUnit.Framework;

    [TestFixture]
    public class ColorMathTest
    {
        [Test]
        public void RGBtoHSL()
        {
            // Correctly converts RGB to HSL
            Assert.AreEqual(ColorMath.RgbToHsl(Color.FromArgb(255, 0, 0)), new HslColor(0, 255, 128));

            // Does not return True for no reason :)
            Assert.AreNotEqual(ColorMath.RgbToHsl(Color.FromArgb(42, 42, 42)), new HslColor(0, 255, 128));
        }

        [Test]
        public void SystemColorToHSL()
        {
            Assert.AreEqual(ColorMath.RgbToHsl(Color.Yellow), new HslColor(43, 255, 128));
        }
    }
}
