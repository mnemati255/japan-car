using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.Models
{
    public class FileData
    {
        public string FileName { get; set; } = null!;
        public byte[] Content { get; set; } = [];
    }

}
