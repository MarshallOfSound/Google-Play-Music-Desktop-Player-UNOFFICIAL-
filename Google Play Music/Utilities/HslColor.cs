using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Google_Play_Music.Utilities
{
    public struct HslColor
    {
        private byte h, s, l;

        public byte H { get { return h; } set { h = value; } }
        public byte S { get { return s; } set { s = value; } }
        public byte L { get { return l; } set { l = value; } }

        public HslColor(byte h, byte s, byte l)
        {
            this.h = h;
            this.s = s;
            this.l = l;
        }

        public override bool Equals(System.Object obj)
        {
            if (obj is HslColor)
            {
                HslColor c = (HslColor)obj;
                return (H == c.H) && (S == c.S) && (L == c.L);
            }

            return false;
        }

        public override int GetHashCode()
        {
            return (h + s + l).GetHashCode();
        }

        public bool Equals(HslColor c)
        {
            if ((object)c == null)
            {
                return false;
            }

            return (H == c.H) && (S == c.S) && (L == c.L);
        }

        public override string ToString()
        {
            return "HslColor(" + H.ToString() + ", " + S.ToString() + ", " + L.ToString() + ") ";
        }
    }
}
