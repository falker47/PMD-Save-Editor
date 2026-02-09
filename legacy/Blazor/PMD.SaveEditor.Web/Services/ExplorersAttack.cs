namespace PMD.SaveEditor.Web.Services
{
    public class ExplorersAttack
    {
        public const int BitLength = 21;

        public ExplorersAttack()
        {
        }

        public ExplorersAttack(BitBlock bits)
        {
            IsValid = bits[0];
            IsLinked = bits[1];
            IsSwitched = bits[2];
            IsSet = bits[3];
            ID = bits.GetInt(0, 4, 10);
            PowerBoost = bits.GetInt(0, 14, 7);
        }

        public BitBlock ToBitBlock()
        {
            var bits = new BitBlock(BitLength);
            bits[0] = IsValid;
            bits[1] = IsLinked;
            bits[2] = IsSwitched;
            bits[3] = IsSet;
            bits.SetInt(0, 4, 10, ID);
            bits.SetInt(0, 14, 7, PowerBoost);
            return bits;
        }

        public bool IsValid { get; set; }
        public bool IsLinked { get; set; }
        public bool IsSwitched { get; set; }
        public bool IsSet { get; set; }
        public int ID { get; set; }
        public int PowerBoost { get; set; }
    }
}
