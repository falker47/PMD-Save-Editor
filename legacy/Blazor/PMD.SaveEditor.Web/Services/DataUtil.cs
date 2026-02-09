using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading;

namespace PMD.SaveEditor.Web.Services
{
    public static class DataUtil
    {
        private static readonly Assembly thisAssembly = Assembly.GetExecutingAssembly();
        private static readonly Dictionary<string, string?> resourceCache = new Dictionary<string, string?>();

        public static string? GetStringResource(string name)
        {
            if (resourceCache.TryGetValue(name, out var cached)) return cached;

            var currentCulture = Thread.CurrentThread.CurrentCulture.TwoLetterISOLanguageName;
            if (string.IsNullOrEmpty(currentCulture)) currentCulture = "en";

            var resNames = thisAssembly.GetManifestResourceNames();
            
            // Try current culture
            var resname = resNames.FirstOrDefault(x => x.Contains($".Resources.{currentCulture}.") && x.EndsWith($"{name}.txt", StringComparison.OrdinalIgnoreCase));
            
            // Fallback to English
            if (resname == null && currentCulture != "en")
            {
                resname = resNames.FirstOrDefault(x => x.Contains(".Resources.en.") && x.EndsWith($"{name}.txt", StringComparison.OrdinalIgnoreCase));
            }

            // Fallback to any matching name
            if (resname == null)
            {
                resname = resNames.FirstOrDefault(x => x.EndsWith($"{name}.txt", StringComparison.OrdinalIgnoreCase));
            }

            if (resname != null)
            {
                using var resource = thisAssembly.GetManifestResourceStream(resname);
                if (resource != null)
                {
                    using var reader = new StreamReader(resource);
                    var content = reader.ReadToEnd();
                    resourceCache[name] = content;
                    return content;
                }
            }

            resourceCache[name] = null;
            return null;
        }
    }
}
