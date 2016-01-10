using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Google_Play_Music.Utilities
{
    class Version : IComparable, IComparable<Version>
    {
        public int Major;
        public int Minor;
        public int Patch;

        public Version(string versionString)
        {
            try {
                string[] parts = versionString.Split('.');
                Major = int.Parse(parts[0]);
                Minor = int.Parse(parts[1]);
                Patch = int.Parse(parts[2]);
            } catch (Exception)
            {
                Reset();
            }
        }

        public Version(int major, int minor, int patch)
        {
            Major = major;
            Minor = minor;
            Patch = patch;
        }

        private void Reset()
        {
            Major = 0;
            Minor = 0;
            Patch = 0;
        }

        public bool IsGreaterThan(Version other)
        {
            if (Major > other.Major)
            {
                return true;
            }
            if (Major == other.Major && Minor > other.Minor)
            {
                return true;
            }
            if (Major == other.Major && Minor == other.Minor && Patch > other.Patch)
            {
                return true;
            }
            return false;
        }

        public bool IsLessThan(Version other)
        {
            if (Major < other.Major)
            {
                return true;
            }
            if (Major == other.Major && Minor < other.Minor)
            {
                return true;
            }
            if (Major == other.Major && Minor == other.Minor && Patch < other.Patch)
            {
                return true;
            }
            return false;
        }

        public override bool Equals(object obj)
        {
            if (obj == null)
            {
                return false;
            }
            Version other = obj as Version;
            if ((Object)other == null)
            {
                return false;
            }
            return Major == other.Major && Minor == other.Minor && Patch == other.Patch;
        }

        public override int GetHashCode()
        {
            return base.GetHashCode();
        }

        public override string ToString()
        {
            return Major + "." + Minor + "." + Patch;
        }

        public int CompareTo(object obj)
        {
            if (obj == null)
            {
                return 0;
            }
            Version other = obj as Version;
            if ((Object)other == null)
            {
                return 0;
            }
            return CompareTo(other);
        }

        public int CompareTo(Version other)
        {
            if (other == null)
            {
                return 0;
            }
            if (IsLessThan(other))
            {
                return -1;
            }
            if (IsGreaterThan(other))
            {
                return 1;
            }
            return 0;
        }

        public static int Compare(Version left, Version right)
        {
            if (object.ReferenceEquals(left, right))
            {
                return 0;
            }
            if (object.ReferenceEquals(left, null))
            {
                return -1;
            }
            return left.CompareTo(right);
        }

        public static bool operator ==(Version left, Version right)
        {
            if (object.ReferenceEquals(left, null))
            {
                return object.ReferenceEquals(right, null);
            }
            return left.Equals(right);
        }
        public static bool operator !=(Version left, Version right)
        {
            return !(left == right);
        }
        public static bool operator <(Version left, Version right)
        {
            return (Compare(left, right) < 0);
        }
        public static bool operator >(Version left, Version right)
        {
            return (Compare(left, right) > 0);
        }
    }
}
