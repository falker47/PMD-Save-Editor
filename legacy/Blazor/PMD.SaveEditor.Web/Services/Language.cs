using System;

namespace PMD.SaveEditor.Web.Services
{
    public static class Language
    {
        public static string BlankPokemon => "----------";
        public static string DeSmuMeSaveFile => "DeSmuMe Save File";
        public static string Error_CantChangeContainedItem => "The current item cannot contain another item.";
        public static string Error_CantChangeItemQuantity => "The current item does not support changing the quantity";
        public static string Error_UsedTMParameterIndexOutOfRange => "Parameter of a used TM must refer to a TM item.";
        public static string GameDataFile => "Mystery Dungeon game_data Files";
        public static string ItemToStringHeldBy => "Held by";
        public static string PluginAuthor => "evandixon";
        public static string PluginCredits => "Sky Editor's save editor for Pokémon Mystery Dungeon was made possible with help from the following researchers:\n\nevandixon - General Research\nmatix2267 - Pokemon Structure, code for interacting with bits\nGrovyle91 - Item Structure, IDs of Pokemon/Items/etc\nProf. 9 - Team Name character encoding\nDemonic722 - Misc RAM and save addresses.";
        public static string PluginName => "Pokémon Mystery Dungeon Save Editor Core";
        public static string RawSaveFile => "Raw Save File";
        public static string RB_Toolbox => "Toolbox";
        public static string RBPkmFile => "Red and Blue Rescue Team Stored Pokemon";
        public static string SkyPkmExFile => "Explorers of Sky Active Pokemon";
        public static string SkyPkmFile => "Explorers of Sky Stored Pokemon";
        public static string SkyPkmQFile => "Explorers of Sky Quicksave Pokemon";
        public static string SkyStoredPokemonToString => "{0} (Lvl. {1} {2})";
        public static string TDPkmExFile => "Explorers of Time and Darkness Active Pokemon";
        public static string TDPkmFile => "Explorers of Time and Darkness Stored Pokemon";
        public static string UnknownItem => "Item ID {0}";
    }
}
