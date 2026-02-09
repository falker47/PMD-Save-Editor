namespace PMD.SaveEditor.Web.Services
{
    public class SkyStoredPokemon
    {
        public const int BitLength = 362;

        public SkyStoredPokemon()
        {
            IQMap = new BitBlock(69);
            ID = new ExplorersPokemonId();
            Attack1 = new ExplorersAttack();
            Attack2 = new ExplorersAttack();
            Attack3 = new ExplorersAttack();
            Attack4 = new ExplorersAttack();
            Name = "";
        }

        public SkyStoredPokemon(BitBlock bits)
        {
            IsValid = bits[0];
            Level = bits.GetInt(0, 1, 7);
            ID = new ExplorersPokemonId(bits.GetInt(0, 8, 11));
            MetAt = bits.GetInt(0, 19, 8);
            MetFloor = bits.GetInt(0, 27, 7);
            Unk1 = bits[34];
            EvolvedAtLevel1 = bits.GetInt(0, 35, 7);
            EvolvedAtLevel2 = bits.GetInt(0, 42, 7);
            IQ = bits.GetInt(0, 49, 10);
            HP = bits.GetInt(0, 59, 10);
            AttackValue = bits.GetInt(0, 69, 8);
            SpAttack = bits.GetInt(0, 77, 8);
            Defense = bits.GetInt(0, 85, 8);
            SpDefense = bits.GetInt(0, 93, 8);
            Exp = bits.GetInt(0, 101, 24);
            IQMap = bits.GetRange(125, 69);
            Tactic = bits.GetInt(0, 194, 4);
            Attack1 = new ExplorersAttack(bits.GetRange(198, ExplorersAttack.BitLength));
            Attack2 = new ExplorersAttack(bits.GetRange(219, ExplorersAttack.BitLength));
            Attack3 = new ExplorersAttack(bits.GetRange(240, ExplorersAttack.BitLength));
            Attack4 = new ExplorersAttack(bits.GetRange(261, ExplorersAttack.BitLength));
            Name = bits.GetStringPMD(0, 282, 10);
        }

        public BitBlock GetStoredPokemonBits()
        {
            var bits = new BitBlock(BitLength);
            bits[0] = IsValid;
            bits.SetInt(0, 1, 7, Level);
            bits.SetInt(0, 8, 11, ID.RawID);
            bits.SetInt(0, 19, 8, MetAt);
            bits.SetInt(0, 27, 7, MetFloor);
            bits[34] = Unk1;
            bits.SetInt(0, 35, 7, EvolvedAtLevel1);
            bits.SetInt(0, 42, 7, EvolvedAtLevel2);
            bits.SetInt(0, 49, 10, IQ);
            bits.SetInt(0, 59, 10, HP);
            bits.SetInt(0, 69, 8, AttackValue);
            bits.SetInt(0, 77, 8, SpAttack);
            bits.SetInt(0, 85, 8, Defense);
            bits.SetInt(0, 93, 8, SpDefense);
            bits.SetInt(0, 101, 24, Exp);
            bits.SetRange(125, 69, IQMap);
            bits.SetInt(0, 194, 4, Tactic);
            bits.SetRange(198, ExplorersAttack.BitLength, Attack1.ToBitBlock());
            bits.SetRange(219, ExplorersAttack.BitLength, Attack2.ToBitBlock());
            bits.SetRange(240, ExplorersAttack.BitLength, Attack3.ToBitBlock());
            bits.SetRange(261, ExplorersAttack.BitLength, Attack4.ToBitBlock());
            bits.SetStringPMD(0, 282, 10, Name);
            return bits;
        }

        public bool IsValid { get; set; }
        public int Level { get; set; }
        public ExplorersPokemonId ID { get; set; }
        public int MetAt { get; set; }
        public int MetFloor { get; set; }
        public bool Unk1 { get; set; }
        public int EvolvedAtLevel1 { get; set; }
        public int EvolvedAtLevel2 { get; set; }
        public int IQ { get; set; }
        public int HP { get; set; }
        public int AttackValue { get; set; }
        public int Defense { get; set; }
        public int SpAttack { get; set; }
        public int SpDefense { get; set; }
        public int Exp { get; set; }
        public BitBlock IQMap { get; set; }
        public int Tactic { get; set; }
        public ExplorersAttack Attack1 { get; set; }
        public ExplorersAttack Attack2 { get; set; }
        public ExplorersAttack Attack3 { get; set; }
        public ExplorersAttack Attack4 { get; set; }
        public string Name { get; set; }
    }
}
