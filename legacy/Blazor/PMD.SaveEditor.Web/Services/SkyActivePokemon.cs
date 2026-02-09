namespace PMD.SaveEditor.Web.Services
{
    public class SkyActivePokemon
    {
        public const int BitLength = 546;

        public SkyActivePokemon()
        {
            Unk1 = new BitBlock(4);
            Unk3 = new BitBlock(22);
            Unk4 = new BitBlock(105);
            Unk5 = new BitBlock(15);
            IQMap = new BitBlock(69);
            ID = new ExplorersPokemonId();
            Attack1 = new ExplorersActiveAttack();
            Attack2 = new ExplorersActiveAttack();
            Attack3 = new ExplorersActiveAttack();
            Attack4 = new ExplorersActiveAttack();
            Name = "";
        }

        public SkyActivePokemon(BitBlock bits)
        {
            IsValid = bits[0];
            Unk1 = bits.GetRange(1, 4);
            Level = bits.GetInt(0, 5, 7);
            MetAt = bits.GetInt(0, 12, 8);
            MetFloor = bits.GetInt(0, 20, 7);
            Unk2 = bits[27];
            IQ = bits.GetInt(0, 28, 10);
            RosterNumber = bits.GetInt(0, 38, 10);
            Unk3 = bits.GetRange(48, 22);
            ID = new ExplorersPokemonId(bits.GetInt(0, 70, 11));
            CurrentHP = bits.GetInt(0, 81, 10);
            MaxHP = bits.GetInt(0, 91, 10);
            AttackValue = bits.GetInt(0, 101, 8);
            SpAttack = bits.GetInt(0, 109, 8);
            Defense = bits.GetInt(0, 117, 8);
            SpDefense = bits.GetInt(0, 125, 8);
            Exp = bits.GetInt(0, 133, 24);
            Attack1 = new ExplorersActiveAttack(bits.GetRange(157, ExplorersActiveAttack.BitLength));
            Attack2 = new ExplorersActiveAttack(bits.GetRange(186, ExplorersActiveAttack.BitLength));
            Attack3 = new ExplorersActiveAttack(bits.GetRange(215, ExplorersActiveAttack.BitLength));
            Attack4 = new ExplorersActiveAttack(bits.GetRange(244, ExplorersActiveAttack.BitLength));
            Unk4 = bits.GetRange(273, 105);
            IQMap = bits.GetRange(378, 69);
            Tactic = bits.GetInt(0, 447, 4);
            Unk5 = bits.GetRange(451, 15);
            Name = bits.GetStringPMD(0, 466, 10);
        }

        public BitBlock GetActivePokemonBits()
        {
            var bits = new BitBlock(BitLength);
            bits[0] = IsValid;
            bits.SetRange(1, 4, Unk1);
            bits.SetInt(0, 5, 7, Level);
            bits.SetInt(0, 12, 8, MetAt);
            bits.SetInt(0, 20, 7, MetFloor);
            bits[27] = Unk2;
            bits.SetInt(0, 28, 10, IQ);
            bits.SetInt(0, 38, 10, RosterNumber);
            bits.SetRange(48, 22, Unk3);
            bits.SetInt(0, 70, 11, ID.RawID); // Note: Original used ID.ID which is the same as ID.RawID if < 600, but let's use RawID to be safe/consistent with Stored
            bits.SetInt(0, 81, 10, CurrentHP);
            bits.SetInt(0, 91, 10, MaxHP);
            bits.SetInt(0, 101, 8, AttackValue);
            bits.SetInt(0, 109, 8, SpAttack);
            bits.SetInt(0, 117, 8, Defense);
            bits.SetInt(0, 125, 8, SpDefense);
            bits.SetInt(0, 133, 24, Exp);
            bits.SetRange(157, ExplorersActiveAttack.BitLength, Attack1.ToBitBlock());
            bits.SetRange(186, ExplorersActiveAttack.BitLength, Attack2.ToBitBlock());
            bits.SetRange(215, ExplorersActiveAttack.BitLength, Attack3.ToBitBlock());
            bits.SetRange(244, ExplorersActiveAttack.BitLength, Attack4.ToBitBlock());
            bits.SetRange(273, 105, Unk4);
            bits.SetRange(378, 69, IQMap);
            bits.SetInt(0, 447, 4, Tactic);
            bits.SetRange(451, 15, Unk5);
            bits.SetStringPMD(0, 466, 10, Name);
            return bits;
        }

        public bool IsValid { get; set; }
        public int Level { get; set; }
        public ExplorersPokemonId ID { get; set; }
        public int RosterNumber { get; set; }
        public int MetAt { get; set; }
        public int MetFloor { get; set; }
        public int IQ { get; set; }
        public int CurrentHP { get; set; }
        public int MaxHP { get; set; }
        public int AttackValue { get; set; }
        public int Defense { get; set; }
        public int SpAttack { get; set; }
        public int SpDefense { get; set; }
        public int Exp { get; set; }
        public ExplorersActiveAttack Attack1 { get; set; }
        public ExplorersActiveAttack Attack2 { get; set; }
        public ExplorersActiveAttack Attack3 { get; set; }
        public ExplorersActiveAttack Attack4 { get; set; }
        public BitBlock IQMap { get; set; }
        public int Tactic { get; set; }
        public string Name { get; set; }
        public BitBlock Unk1 { get; set; }
        public bool Unk2 { get; set; }
        public BitBlock Unk3 { get; set; }
        public BitBlock Unk4 { get; set; }
        public BitBlock Unk5 { get; set; }
    }
}
