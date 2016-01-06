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
    public class UtilsTest
    {
        [Test]
        public void FromUInt()
        {
            Assert.AreEqual(Color.FromArgb(240, 210, 45, 10), Utils.ColorFromUInt(4040305930, true)); // F0D22D0A
            Assert.AreEqual(Color.FromArgb(15, 50, 125), Utils.ColorFromUInt(995965, false)); // 0F327D
        }
    }
}
