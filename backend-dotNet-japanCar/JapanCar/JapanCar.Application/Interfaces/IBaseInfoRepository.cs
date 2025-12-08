using JapanCar.Application.Models;
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
        Task<PagedResult<CarColorEntity>> GetColors(string? keyword, int? skip = null, int? take = null);
        Task<PagedResult<CarBrandEntity>> GetBrands(string? keyword, int? skip = null, int? take = null);
        Task<PagedResult<CarModelEntity>> GetModels(string? keyword, int? skip = null, int? take = null);
        Task<IEnumerable<CarModelEntity>> GetModelsOfBrands(int brandId);
        Task CreateBrand(CarBrandEntity entity);
        Task CreateColor(CarColorEntity entity);
        Task CreateModel(CarModelEntity entity);
        Task UpdateBrand(int id, CarBrandEntity entity);
        Task UpdateColor(int id, CarColorEntity entity);
        Task UpdateModel(int id, CarModelEntity entity);
        Task DeleteBrand(int id);
        Task DeleteColor(int id);
        Task DeleteModel(int id);
    }
}
