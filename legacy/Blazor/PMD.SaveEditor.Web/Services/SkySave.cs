using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace PMD.SaveEditor.Web.Services
{
    public class SkySave
    {
        public class SkyOffsets
        {
            public virtual int BackupSaveStart => 0xC800;
            public virtual int ChecksumEnd => 0xB65A;
            public virtual int QuicksaveStart => 0x19000;
            public virtual int QuicksaveChecksumStart => 0x19004;
            public virtual int QuicksaveChecksumEnd => 0x1E7FF;

            public virtual int TeamNameStart => 0x994E * 8;
            public virtual int TeamNameLength => 10;
            public virtual int HeldMoney => 0x990C * 8 + 6;
            public virtual int SpEpisodeHeldMoney => 0x990F * 8 + 6;
            public virtual int StoredMoney => 0x9915 * 8 + 6;
            public virtual int NumberOfAdventures => 0x8B70 * 8;
            public virtual int ExplorerRank => 0x9958 * 8;

            public virtual int StoredItemOffset => 0x8E0C * 8 + 6;
            public virtual int HeldItemOffset => 0x8BA2 * 8;

            public virtual int StoredPokemonOffset => 0x464 * 8;
            public virtual int StoredPokemonLength => 362;
            public virtual int StoredPokemonCount => 720;

            public virtual int ActivePokemonOffset => 0x83D9 * 8 + 1;
            public virtual int SpActivePokemonOffset => 0x84F4 * 8 + 2;
            public virtual int ActivePokemonLength => 546;
            public virtual int ActivePokemonCount => 4;

            public virtual int QuicksavePokemonCount => 20;
            public virtual int QuicksavePokemonLength => 429 * 8;
            public virtual int QuicksavePokemonOffset => 0x19000 * 8 + (0x3170 * 8);

            public virtual int OriginalPlayerID => 0xBE * 8;
            public virtual int OriginalPartnerID => 0xC0 * 8;
            public virtual int OriginalPlayerName => 0x13F * 8;
            public virtual int OriginalPartnerName => 0x149 * 8;

            public virtual int WindowFrameType => 0x995F * 8 + 5;
        }

        public SkySave(byte[] data)
        {
            Bits = new BitBlock(data);
            Offsets = new SkyOffsets();
            Init();
        }

        public BitBlock Bits { get; set; }
        public SkyOffsets Offsets { get; set; }

        public uint PrimaryChecksum { get; set; }
        public uint SecondaryChecksum { get; set; }
        public uint QuicksaveChecksum { get; set; }

        public string TeamName { get; set; } = "";
        public int HeldMoney { get; set; }
        public int SpEpisodeHeldMoney { get; set; }
        public int StoredMoney { get; set; }
        public int NumberOfAdventures { get; set; }
        public int ExplorerRankPoints { get; set; }
        public byte WindowFrameType { get; set; }
        public string OriginalPlayerName { get; set; } = "";
        public string OriginalPartnerName { get; set; } = "";
        public ExplorersPokemonId OriginalPlayerPokemon { get; set; } = new ExplorersPokemonId();
        public ExplorersPokemonId OriginalPartnerPokemon { get; set; } = new ExplorersPokemonId();

        public List<ExplorersItem> StoredItems { get; set; } = new List<ExplorersItem>();
        public List<SkyHeldItem> HeldItems { get; set; } = new List<SkyHeldItem>();
        public List<SkyHeldItem> SpEpisodeHeldItems { get; set; } = new List<SkyHeldItem>();
        public List<SkyHeldItem> FriendRescueHeldItems { get; set; } = new List<SkyHeldItem>();
        public List<SkyStoredPokemon> StoredPokemon { get; set; } = new List<SkyStoredPokemon>();
        public List<SkyActivePokemon> ActivePokemon { get; set; } = new List<SkyActivePokemon>();
        public List<SkyActivePokemon> SpEpisodeActivePokemon { get; set; } = new List<SkyActivePokemon>();
        public List<SkyQuicksavePokemon> QuicksavePokemon { get; set; } = new List<SkyQuicksavePokemon>();

        public uint CalculatePrimaryChecksum() => Checksums.Calculate32BitChecksum(Bits.ToByteArray(), 4, Offsets.ChecksumEnd);
        
        public bool IsPrimaryChecksumValid() => PrimaryChecksum == CalculatePrimaryChecksum();

        private void Init()
        {
            PrimaryChecksum = Bits.GetUInt(0, 0, 32);
            SecondaryChecksum = Bits.GetUInt(Offsets.BackupSaveStart, 0, 32);
            QuicksaveChecksum = Bits.GetUInt(Offsets.QuicksaveStart, 0, 32);

            var baseOffset = 0;
            // Simplified logic for web: always use first slot unless we add a toggle
            LoadGeneral(baseOffset);
            LoadItems(baseOffset);
            LoadStoredPokemon(baseOffset);
            LoadActivePokemon(baseOffset);
            LoadQuicksavePokemon(baseOffset);
            LoadHistory(baseOffset);
            LoadSettings(baseOffset);
        }

        private void LoadGeneral(int baseOffset)
        {
            TeamName = Bits.GetStringPMD(baseOffset, Offsets.TeamNameStart, Offsets.TeamNameLength);
            HeldMoney = Bits.GetInt(baseOffset, Offsets.HeldMoney, 24);
            SpEpisodeHeldMoney = Bits.GetInt(baseOffset, Offsets.SpEpisodeHeldMoney, 24);
            StoredMoney = Bits.GetInt(baseOffset, Offsets.StoredMoney, 24);
            NumberOfAdventures = Bits.GetInt(baseOffset, Offsets.NumberOfAdventures, 32);
            ExplorerRankPoints = Bits.GetInt(baseOffset, Offsets.ExplorerRank, 32);
        }

        private void LoadItems(int baseOffset)
        {
            StoredItems = new List<ExplorersItem>();
            var ids = Bits.GetRange(baseOffset * 8 + Offsets.StoredItemOffset, 11 * 1000);
            var parameters = Bits.GetRange(baseOffset * 8 + Offsets.StoredItemOffset + (11 * 1000), 11 * 1000);
            for (int i = 0; i < 1000; i++)
            {
                var id = ids.GetNextInt(11);
                var param = parameters.GetNextInt(11);
                if (id > 0) StoredItems.Add(new ExplorersItem(id, param));
                else break;
            }

            HeldItems = new List<SkyHeldItem>();
            SpEpisodeHeldItems = new List<SkyHeldItem>();
            FriendRescueHeldItems = new List<SkyHeldItem>();

            for (int i = 0; i < 50; i++)
            {
                var item = new SkyHeldItem(Bits.GetRange(baseOffset * 8 + Offsets.HeldItemOffset + (i * 33), 33));
                if (item.IsValid) HeldItems.Add(item);
                else break;
            }
        }

        private void LoadStoredPokemon(int baseOffset)
        {
            Console.WriteLine("LoadStoredPokemon Start");
            StoredPokemon = new List<SkyStoredPokemon>();
            for (int i = 0; i < Offsets.StoredPokemonCount; i++)
            {
                var pkm = new SkyStoredPokemon(Bits.GetRange(baseOffset * 8 + Offsets.StoredPokemonOffset + i * Offsets.StoredPokemonLength, Offsets.StoredPokemonLength));
                if (pkm.IsValid) StoredPokemon.Add(pkm);
                else break;
            }
            Console.WriteLine("LoadStoredPokemon End");
        }

        private void LoadActivePokemon(int baseOffset)
        {
            Console.WriteLine("LoadActivePokemon Start");
            ActivePokemon = new List<SkyActivePokemon>();
            SpEpisodeActivePokemon = new List<SkyActivePokemon>();
            for (int i = 0; i < Offsets.ActivePokemonCount; i++)
            {
                var main = new SkyActivePokemon(Bits.GetRange(baseOffset * 8 + Offsets.ActivePokemonOffset + i * Offsets.ActivePokemonLength, Offsets.ActivePokemonLength));
                if (main.IsValid) ActivePokemon.Add(main);
            }
            Console.WriteLine("LoadActivePokemon End");
        }

        private void LoadQuicksavePokemon(int baseOffset)
        {
            QuicksavePokemon = new List<SkyQuicksavePokemon>();
            for (int i = 0; i < Offsets.QuicksavePokemonCount; i++)
            {
                QuicksavePokemon.Add(new SkyQuicksavePokemon(Bits.GetRange(baseOffset * 8 + Offsets.QuicksavePokemonOffset + i * Offsets.QuicksavePokemonLength, Offsets.QuicksavePokemonLength)));
            }
        }

        private void LoadHistory(int baseOffset)
        {
            Console.WriteLine("LoadHistory Start");
            OriginalPlayerPokemon = new ExplorersPokemonId(Bits.GetInt(baseOffset, Offsets.OriginalPlayerID, 16));
            OriginalPartnerPokemon = new ExplorersPokemonId(Bits.GetInt(baseOffset, Offsets.OriginalPartnerID, 16));
            OriginalPlayerName = Bits.GetStringPMD(baseOffset, Offsets.OriginalPlayerName, 10);
            OriginalPartnerName = Bits.GetStringPMD(baseOffset, Offsets.OriginalPartnerName, 10);
            Console.WriteLine("LoadHistory End");
        }

        private void LoadSettings(int baseOffset)
        {
            WindowFrameType = (byte)(Bits.GetInt(baseOffset, Offsets.WindowFrameType, 3) + 1);
        }

        public byte[] ToByteArray()
        {
            PreSave();
            return Bits.ToByteArray();
        }

        private void PreSave()
        {
            SaveGeneral();
            // Save logic for Items, Pokemon, etc. should be implemented here
            // For now, let's at least ensure General is saved
            
            // Recalculate checksums
            PrimaryChecksum = CalculatePrimaryChecksum();
            Bits.SetUInt(0, 0, 32, PrimaryChecksum);
            // Backup and Quicksave checksums would also be updated here
        }

        private void SaveGeneral()
        {
            Bits.SetStringPMD(0, Offsets.TeamNameStart, Offsets.TeamNameLength, TeamName);
            Bits.SetInt(0, Offsets.HeldMoney, 24, HeldMoney);
            Bits.SetInt(0, Offsets.SpEpisodeHeldMoney, 24, SpEpisodeHeldMoney);
            Bits.SetInt(0, Offsets.StoredMoney, 24, StoredMoney);
            Bits.SetInt(0, Offsets.NumberOfAdventures, 32, NumberOfAdventures);
            Bits.SetInt(0, Offsets.ExplorerRank, 32, ExplorerRankPoints);
        }
    }
}
