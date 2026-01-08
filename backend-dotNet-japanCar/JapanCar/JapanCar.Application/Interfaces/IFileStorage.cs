using JapanCar.Application.Models;
using JapanCar.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.Interfaces
{
    public interface IFileStorage
    {
        Task<List<string>> SaveFilesAsync(List<FileData> files, string folder);
        void DeleteFiles(string[] images);
    }

}
