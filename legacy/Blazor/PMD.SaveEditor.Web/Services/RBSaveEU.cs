using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PMD.SaveEditor.Web.Services
{
    public class RBSaveEU : RBSave
    {
        public class RBEUOffsets : RBSave.RBOffsets
        {
            // General
            public override int TeamNameStart => 0x4ECC * 8;
            public override int HeldMoneyOffset => 0x4E70 * 8;
            public override int StoredMoneyOffset => 0x4E73 * 8;
            public override int RescuePointsOffset => 0x4ED7 * 8;

            // Stored Items
            public override int StoredItemOffset => 0x4D2F * 8 - 2;

            // Held Items
            public override int HeldItemOffset => 0x4CF4 * 8;

            // Stored Pokemon
            public override int StoredPokemonOffset => (0x5B7 * 8 + 3) - (323 * 9);
        }

        public RBSaveEU() : base()
        {
            Offsets = new RBEUOffsets();
        }

        public RBSaveEU(byte[] rawData) : base(rawData)
        {
            Offsets = new RBEUOffsets();
        }

        // Logic check for EU save type is slightly different: checkum - 1
        public static new bool IsOfType(byte[] file, int checksumEnd)
        {
            if (file.Length > checksumEnd)
            {
                var storedChecksum = BitConverter.ToUInt32(file, 0);
                var calculatedChecksum = Checksums.Calculate32BitChecksum(file, 4, checksumEnd);
                return storedChecksum == calculatedChecksum - 1;
            }
            return false;
        }

        public override uint CalculatePrimaryChecksum()
        {
            return base.CalculatePrimaryChecksum() - 1;
        }

        public override uint CalculateSecondaryChecksum()
        {
            return base.CalculateSecondaryChecksum() - 1;
        }

        protected override void RecalculateChecksums()
        {
            base.RecalculateChecksums();
            PrimaryChecksum -= 1;
            SecondaryChecksum -= 1;
        }
    }
}
