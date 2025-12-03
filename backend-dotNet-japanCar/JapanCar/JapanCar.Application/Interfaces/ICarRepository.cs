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
        Task<IEnumerable<CarEntity>> GetAll();
        Task<IEnumerable<CarEntity>> GetAllCarsOfAuction(int auctionId);
        Task<CarEntity?> GetById(int id, bool withAuctionDetails, bool withImages);
        Task Create(CarEntity car);
        Task Update(int id, CarEntity car);
        Task Delete(int id);
        Task<bool> ExistsCar(int carId);

    }
}
