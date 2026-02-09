using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components.Forms;

namespace PMD.SaveEditor.Web.Services
{
    public class SaveFileService
    {
        public RBSave? CurrentRBSave { get; private set; }
        public SkySave? CurrentSkySave { get; private set; }
        public string? FileName { get; private set; }
        public event Action? OnChange;

        public async Task LoadSaveFile(IBrowserFile file)
        {
            using var stream = new MemoryStream();
            await file.OpenReadStream(maxAllowedSize: 10 * 1024 * 1024).CopyToAsync(stream);
            var data = stream.ToArray();

            // Detect type
            var rbOffsets = new RBSave.RBOffsets();
            var skyOffsets = new SkySaveOffsets();
            var tdOffsets = new TDSaveOffsets();
            
            var storedChecksum = (uint)(data[0] | (data[1] << 8) | (data[2] << 16) | (data[3] << 24));
            
            Console.WriteLine($"File Name: {file.Name}, Size: {data.Length}");
            Console.WriteLine($"Header Hex: {BitConverter.ToString(data, 0, Math.Min(64, data.Length))}");
            Console.WriteLine($"Stored Checksum: {storedChecksum:X}");

            // Try RB
            var calcRB = Checksums.Calculate32BitChecksum(data, 4, rbOffsets.ChecksumEnd);
            Console.WriteLine($"RB Calculated: {calcRB:X} (EU: {(calcRB - 1):X})");
            
            if (storedChecksum == calcRB)
            {
                CurrentRBSave = new RBSave(data);
                CurrentSkySave = null;
                FileName = file.Name;
                NotifyStateChanged();
                return;
            }
            if (storedChecksum == calcRB - 1)
            {
                CurrentRBSave = new RBSaveEU(data);
                CurrentSkySave = null;
                FileName = file.Name;
                NotifyStateChanged();
                return;
            }

            // Try Sky
            var calcSky = Checksums.Calculate32BitChecksum(data, 4, skyOffsets.ChecksumEnd);
            Console.WriteLine($"Sky Calculated: {calcSky:X}");
            if (storedChecksum == calcSky)
            {
                try {
                    CurrentSkySave = new SkySave(data);
                    CurrentRBSave = null;
                    FileName = file.Name;
                    NotifyStateChanged();
                    return;
                } catch (Exception ex) {
                    Console.WriteLine($"SkySave Loading Error: {ex.Message}\n{ex.StackTrace}");
                    throw new Exception($"Error loading Explorer save: {ex.Message}", ex);
                }
            }

            // Try TD
            var calcTD = Checksums.Calculate32BitChecksum(data, 4, tdOffsets.ChecksumEnd);
            Console.WriteLine($"T/D Calculated: {calcTD:X}");
             if (storedChecksum == calcTD)
            {
                throw new Exception("Explorers of Time/Darkness save detected! Support is coming soon.");
            }

            throw new Exception($"Invalid save file or checksum.\nStored: {storedChecksum:X}\nCalculated RB: {calcRB:X}\nSize: {data.Length} bytes");
        }

        private class SkySaveOffsets { public int ChecksumEnd => 0xB65A; }
        private class TDSaveOffsets { public int ChecksumEnd => 0xDC7B; }


        public byte[]? DownloadSaveFile()
        {
            if (CurrentRBSave != null) return CurrentRBSave.ToByteArray();
            if (CurrentSkySave != null) return CurrentSkySave.ToByteArray();
            return null;
        }

        private void NotifyStateChanged() => OnChange?.Invoke();
    }
}
