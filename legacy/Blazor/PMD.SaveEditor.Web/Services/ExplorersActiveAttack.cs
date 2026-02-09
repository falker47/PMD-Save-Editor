namespace PMD.SaveEditor.Web.Services
{
    public class ExplorersActiveAttack
    {
        public const int BitLength = 29;

        public ExplorersActiveAttack()
        {
        }

        public ExplorersActiveAttack(BitBlock bits)
        {
            IsValid = bits[0];
            IsLinked = bits[1];
            IsSwitched = bits[2];
            IsSet = bits[3];
            IsSealed = bits[4];
            ID = bits.GetInt(0, 5, 10);
            PP = bits.GetInt(0, 15, 7);
            PowerBoost = bits.GetInt(0, 22, 7);
        }

        public BitBlock ToBitBlock()
        {
            var bits = new BitBlock(BitLength);
            bits[0] = IsValid;
            bits[1] = IsLinked;
            bits[2] = IsSwitched;
            bits[3] = IsSet;
            bits[4] = IsSealed;
            bits.SetInt(0, 5, 10, ID);
            bits.SetInt(0, 15, 7, PP);
            bits.SetInt(0, 22, 7, PowerBoost);
            return bits;
        }

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
