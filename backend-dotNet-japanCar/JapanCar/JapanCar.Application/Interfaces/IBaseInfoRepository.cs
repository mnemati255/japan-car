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
        Task<IEnumerable<CarColorEntity>> GetColors(int? skip = null, int? take = null);
        Task<IEnumerable<CarBrandEntity>> GetBrands(int? skip = null, int? take = null);
        Task<IEnumerable<CarModelEntity>> GetModels(int? skip = null, int? take = null);
        Task<int> GetColorsCount();
        Task<int> GetBrandsCount();
        Task<int> GetModelsCount();
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
