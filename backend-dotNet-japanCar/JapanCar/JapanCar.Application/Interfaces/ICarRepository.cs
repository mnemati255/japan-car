using JapanCar.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.Interfaces
{
    public interface ICarRepository
    {
        Task<IEnumerable<Car>> GetAllCars();
    }
}
