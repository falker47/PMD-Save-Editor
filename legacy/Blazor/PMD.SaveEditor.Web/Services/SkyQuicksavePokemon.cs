namespace PMD.SaveEditor.Web.Services
{
    public class SkyQuicksavePokemon
    {
        public const int ByteLength = 429;
        public const int BitLength = ByteLength * 8;

        public SkyQuicksavePokemon()
        {
            Unk1 = new BitBlock(80);
            Unk2 = new BitBlock(48);
            Unk3 = new BitBlock(48);
            Unk4 = new BitBlock(32);
            Unk5 = new BitBlock(2408);
            Unk6 = new BitBlock(592);
            ID = new ExplorersPokemonId();
            TransformedID = new ExplorersPokemonId();
            Attack1 = new SkyQuicksaveAttack();
            Attack2 = new SkyQuicksaveAttack();
            Attack3 = new SkyQuicksaveAttack();
            Attack4 = new SkyQuicksaveAttack();
        }

        public SkyQuicksavePokemon(BitBlock bits)
        {
            Unk1 = bits.GetRange(0, 80);
            TransformedID = new ExplorersPokemonId(bits.GetInt(0, 80, 16));
            ID = new ExplorersPokemonId(bits.GetInt(0, 96, 16));
            Unk2 = bits.GetRange(112, 48);
            Level = bits.GetInt(0, 144, 8);
            Unk3 = bits.GetRange(152, 48);
            CurrentHP = bits.GetInt(0, 192, 16);
            MaxHP = bits.GetInt(0, 208, 16);
            HPBoost = bits.GetInt(0, 224, 16);
            Unk4 = bits.GetRange(240, 32);
            AttackValue = bits.GetInt(0, 256, 8);
            Defense = bits.GetInt(0, 264, 8);
            SpAttack = bits.GetInt(0, 272, 8);
            SpDefense = bits.GetInt(0, 280, 8);
            Exp = bits.GetInt(0, 280, 32); // Legacy has 280 for both SpDefense (8) and Exp (32)? Overlap?
            Unk5 = bits.GetRange(320, 2408);
            Attack1 = new SkyQuicksaveAttack(bits.GetRange(2696 + 0 * SkyQuicksaveAttack.BitLength, SkyQuicksaveAttack.BitLength));
            Attack2 = new SkyQuicksaveAttack(bits.GetRange(2696 + 1 * SkyQuicksaveAttack.BitLength, SkyQuicksaveAttack.BitLength));
            Attack3 = new SkyQuicksaveAttack(bits.GetRange(2696 + 2 * SkyQuicksaveAttack.BitLength, SkyQuicksaveAttack.BitLength));
            Attack4 = new SkyQuicksaveAttack(bits.GetRange(2696 + 3 * SkyQuicksaveAttack.BitLength, SkyQuicksaveAttack.BitLength));
            Unk6 = bits.GetRange(2840, 592);
        }

        public BitBlock GetQuicksavePokemonBits()
        {
            var bits = new BitBlock(BitLength);
            bits.SetRange(0, 80, Unk1);
            bits.SetInt(0, 80, 16, TransformedID.RawID);
            bits.SetInt(0, 96, 16, ID.RawID);
            bits.SetRange(112, 48, Unk2);
            bits.SetInt(0, 144, 8, Level);
            bits.SetRange(152, 48, Unk3);
            bits.SetInt(0, 192, 16, CurrentHP);
            bits.SetInt(0, 208, 16, MaxHP);
            bits.SetInt(0, 224, 16, HPBoost);
            bits.SetRange(240, 32, Unk4);
            bits.SetInt(0, 256, 8, AttackValue);
            bits.SetInt(0, 264, 8, Defense);
            bits.SetInt(0, 272, 8, SpAttack);
            bits.SetInt(0, 280, 8, SpDefense);
            bits.SetInt(0, 288, 32, Exp); // 288 for Exp in Save, but 280 in Init? Init had 280 for SpDefense(8) and 280 for Exp(32).
            bits.SetRange(320, 2408, Unk5);
            bits.SetRange(2696 + 0 * SkyQuicksaveAttack.BitLength, SkyQuicksaveAttack.BitLength, Attack1.ToBitBlock());
            bits.SetRange(2696 + 1 * SkyQuicksaveAttack.BitLength, SkyQuicksaveAttack.BitLength, Attack2.ToBitBlock());
            bits.SetRange(2696 + 2 * SkyQuicksaveAttack.BitLength, SkyQuicksaveAttack.BitLength, Attack3.ToBitBlock());
            bits.SetRange(2696 + 3 * SkyQuicksaveAttack.BitLength, SkyQuicksaveAttack.BitLength, Attack4.ToBitBlock());
            bits.SetRange(2840, 592, Unk6);
            return bits;
        }

        public BitBlock Unk1 { get; set; }
        public BitBlock Unk2 { get; set; }
        public BitBlock Unk3 { get; set; }
        public BitBlock Unk4 { get; set; }
        public BitBlock Unk5 { get; set; }
        public BitBlock Unk6 { get; set; }
        public int Level { get; set; }
        public ExplorersPokemonId ID { get; set; }
        public ExplorersPokemonId TransformedID { get; set; }
        public int CurrentHP { get; set; }
        public int MaxHP { get; set; }
        public int HPBoost { get; set; }
        public int AttackValue { get; set; }
        public int Defense { get; set; }
        public int SpAttack { get; set; }
        public int SpDefense { get; set; }
        public int Exp { get; set; }
        public SkyQuicksaveAttack Attack1 { get; set; }
        public SkyQuicksaveAttack Attack2 { get; set; }
        public SkyQuicksaveAttack Attack3 { get; set; }
        public SkyQuicksaveAttack Attack4 { get; set; }
    }
}
