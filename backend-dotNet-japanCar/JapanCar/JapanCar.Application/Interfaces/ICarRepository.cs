using JapanCar.Application.DTOs;
using JapanCar.Application.Models;
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
        Task<PagedResult<CarEntity>> GetCars(int languageId, CarFilterDto filterDto);
        Task<CarEntity?> GetById(int id, bool withAuctionDetails, bool withImages);
        Task<int> Create(int languageId, CarEntity car);
        Task<int?> Update(int id, CarEntity car);
        Task<bool> Delete(int id);
        Task<bool> ExistsCar(int carId);
        Task<int> GetSukuraNumber();

    }
}
