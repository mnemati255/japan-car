using JapanCar.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.Interfaces
{
    public interface ICarPartRepository
    {
        Task<IEnumerable<CarPartEntity>> GetPartsOfRepair(int repairId);
        Task CreateCarPart(CarPartEntity carPartEntity);
        Task<bool> DeleteCarPart(int id);
        Task DeleteCarPartsOfRepair(int repairId);
    }
}
