namespace PMD.SaveEditor.Web.Services
{
    public class SkyQuicksaveAttack
    {
        public const int BitLength = 48;

        public SkyQuicksaveAttack()
        {
        }

        public SkyQuicksaveAttack(BitBlock bits)
        {
            IsValid = bits[0];
            IsLinked = bits[1];
            IsSwitched = bits[2];
            IsSet = bits[3];
            IsSealed = bits[4];
            Unknown = bits.GetRange(5, 11);
            ID = bits.GetInt(0, 16, 16);
            PP = bits.GetInt(0, 32, 8);
            PowerBoost = bits.GetInt(0, 40, 8);
        }

        public BitBlock ToBitBlock()
        {
            var bits = new BitBlock(BitLength);
            bits[0] = IsValid;
            bits[1] = IsLinked;
            bits[2] = IsSwitched;
            bits[3] = IsSet;
            bits[4] = IsSealed;
            bits.SetRange(5, 11, Unknown);
            bits.SetInt(0, 16, 16, ID);
            bits.SetInt(0, 32, 8, PP);
            bits.SetInt(0, 40, 8, PowerBoost);
            return bits;
        }

        private BitBlock Unknown { get; set; } = new BitBlock(11);
        public bool IsValid { get; set; }
        public bool IsLinked { get; set; }
        public bool IsSwitched { get; set; }
        public bool IsSet { get; set; }
        public int ID { get; set; }
        public int PowerBoost { get; set; }
        public bool IsSealed { get; set; }
        public int PP { get; set; }
    }
}
