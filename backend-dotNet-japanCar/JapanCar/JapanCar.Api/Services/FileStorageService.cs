using JapanCar.Application.Interfaces;
using JapanCar.Application.Models;
using JapanCar.Common.Models;

namespace JapanCar.Api.Services
{
    public class FileStorageService : IFileStorage
    {
        private readonly IWebHostEnvironment _env;

        public FileStorageService(IWebHostEnvironment env)
        {
            _env = env;
        }


        public async Task<List<string>> SaveFilesAsync(List<FileData> files, string folder)
        {
            var fileNames = new List<string>();

            var baseFolder = Path.Combine(_env.WebRootPath, folder);
            if(!Directory.Exists(baseFolder))
                Directory.CreateDirectory(baseFolder);

            foreach (var file in files)
            {
                var extension = Path.GetExtension(file.FileName);
                var savedName = $"{Guid.NewGuid():N}{extension}";

                var path = Path.Combine(baseFolder, savedName);

                await File.WriteAllBytesAsync(path, file.Content);

                fileNames.Add(savedName);
            }

            return fileNames;
        }


        public void DeleteFiles(string[] images)
        {
            foreach (var image in images)
            {
                var path = Path.Combine(_env.WebRootPath, "cars-images", image);
                if (File.Exists(path))
                    File.Delete(path);
            }
        }
    }
}
