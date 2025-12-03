using JapanCar.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.Interfaces
{
    public interface IBaseInfoRepository
    {
        Task<IEnumerable<CarColorEntity>> GetCarColors();
        Task<IEnumerable<CarModelEntity>> GetCarModels();
    }
}
