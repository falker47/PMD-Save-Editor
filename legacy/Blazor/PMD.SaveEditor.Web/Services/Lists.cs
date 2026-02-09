using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace PMD.SaveEditor.Web.Services
{
    public static class Lists
    {
        private static Dictionary<int, string>? _skyLocations;
        public static Dictionary<int, string> SkyLocations => _skyLocations ??= BasicIniDictionaryFile.GetDictionary(DataUtil.GetStringResource("SkyLocations") ?? "");

        private static Dictionary<int, string>? _tdLocations;
        public static Dictionary<int, string> TDLocations => _tdLocations ??= BasicIniDictionaryFile.GetDictionary(DataUtil.GetStringResource("TDLocations") ?? "");

        private static Dictionary<int, string>? _rbLocations;
        public static Dictionary<int, string> RBLocations => _rbLocations ??= BasicIniDictionaryFile.GetDictionary(DataUtil.GetStringResource("RBLocations") ?? "");

        private static Dictionary<int, string>? _explorersMoves;
        public static Dictionary<int, string> ExplorersMoves => _explorersMoves ??= BasicIniDictionaryFile.GetDictionary(DataUtil.GetStringResource("SkyMoves") ?? "");

        private static Dictionary<int, string>? _rbMoves;
        public static Dictionary<int, string> RBMoves => _rbMoves ??= BasicIniDictionaryFile.GetDictionary(DataUtil.GetStringResource("RBMoves") ?? "");

        private static Dictionary<int, string>? _skyItems;
        public static Dictionary<int, string> SkyItems => _skyItems ??= BasicIniDictionaryFile.GetDictionary(DataUtil.GetStringResource("SkyItems") ?? "");

        private static Dictionary<int, string>? _skyItemsMovesOnly;
        public static Dictionary<int, string> SkyItemsMovesOnly => _skyItemsMovesOnly ??= SkyItems.Where(x => x.Key >= 188 && x.Key < 364).ToDictionary(x => x.Key, x => x.Value);

        private static Dictionary<int, string>? _tdItems;
        public static Dictionary<int, string> TDItems => _tdItems ??= BasicIniDictionaryFile.GetDictionary(DataUtil.GetStringResource("TDItems") ?? "");

        private static Dictionary<int, string>? _tdItemsMovesOnly;
        public static Dictionary<int, string> TDItemsMovesOnly => _tdItemsMovesOnly ??= TDItems.Where(x => x.Key >= 188 && x.Key < 364).ToDictionary(x => x.Key, x => x.Value);

        private static Dictionary<int, string>? _rbItems;
        public static Dictionary<int, string> RBItems => _rbItems ??= BasicIniDictionaryFile.GetDictionary(DataUtil.GetStringResource("RBItems") ?? "");

        private static Dictionary<int, string>? _explorersPokemon;
        public static Dictionary<int, string> ExplorersPokemon => _explorersPokemon ??= BasicIniDictionaryFile.GetDictionary(DataUtil.GetStringResource("SkyPokemon") ?? "");

        private static Dictionary<int, string>? _rbPokemon;
        public static Dictionary<int, string> RBPokemon => _rbPokemon ??= BasicIniDictionaryFile.GetDictionary(DataUtil.GetStringResource("RBPokemon") ?? "");

        private static Dictionary<int, string>? _rbBaseTypes;
        public static Dictionary<int, string> RBBaseTypes => _rbBaseTypes ??= BasicIniDictionaryFile.GetDictionary(DataUtil.GetStringResource("RBBaseTypes") ?? "");
    }
}
