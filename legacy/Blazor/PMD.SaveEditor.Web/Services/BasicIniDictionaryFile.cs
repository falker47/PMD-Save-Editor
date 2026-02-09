using System;
using System.Collections.Generic;
using System.Text;

namespace PMD.SaveEditor.Web.Services
{
    public class BasicIniDictionaryFile
    {
        public static Dictionary<int, string> GetDictionary(string iniFileContents)
        {
            var entries = new Dictionary<int, string>();
            if (string.IsNullOrEmpty(iniFileContents)) return entries;

            foreach (var line in iniFileContents.Split('\n'))
            {
                if (!string.IsNullOrWhiteSpace(line))
                {
                    var parts = line.Trim().Split("=".ToCharArray(), 2);
                    if (parts.Length >= 2 && int.TryParse(parts[0], out int key))
                    {
                        if (!entries.ContainsKey(key))
                        {
                            entries.Add(key, parts[1]);
                        }
                    }
                }
            }
            return entries;
        }

        public BasicIniDictionaryFile(string fileContents)
        {
            Entries = GetDictionary(fileContents);
        }

        public Dictionary<int, string> Entries { get; set; }
    }
}
