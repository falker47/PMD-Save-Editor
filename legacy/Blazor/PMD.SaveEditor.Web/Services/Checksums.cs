using System;
using System.Collections.Generic;
using System.Text;

namespace PMD.SaveEditor.Web.Services
{
    /// <summary>
    /// Utility class to calculate checksums
    /// </summary>
    public class Checksums
    {
        public static uint Calculate32BitChecksum(BitBlock bits, int startIndex, int endIndex)
        {
            ulong sum = 0;
            for (int i = startIndex; i <= endIndex; i += 4)
            {
                sum += (ulong)bits.GetUInt(0, i * 8, 32);
            }
            return (uint)(sum & 0xFFFFFFFF);
        }

        public static uint Calculate32BitChecksum(byte[] file, int startIndex, int endIndex)
        {
            ulong sum = 0;
            for (int i = startIndex; i <= endIndex; i += 4)
            {
                // Explicitly little-endian
                uint val = (uint)(file[i] | (file[i + 1] << 8) | (file[i + 2] << 16) | (file[i + 3] << 24));
                sum += val;
            }
            return (uint)(sum & 0xFFFFFFFF);
        }
    }
}
