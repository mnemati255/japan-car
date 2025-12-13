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
        Task<PagedResult<CarColorEntity>> GetColors(int languageId, string? keyword, int? skip = null, int? take = null);
        Task<PagedResult<CarBrandEntity>> GetBrands(int languageId, string? keyword, int? skip = null, int? take = null);
        Task<PagedResult<CarModelEntity>> GetModels(int languageId, string? keyword, int? skip = null, int? take = null);
        Task<CarColorEntity?> GetColorById(int languageId, int id);
        Task<CarBrandEntity?> GetBrandById(int languageId, int id);
        Task<CarModelEntity?> GetModelById(int languageId, int id);
        Task<IEnumerable<CarModelEntity>> GetModelsOfBrands(int languageId, int brandId);
        Task CreateBrand(int languageId, CarBrandEntity entity);
        Task CreateColor(int languageId, CarColorEntity entity);
        Task CreateModel(int languageId, CarModelEntity entity);
        Task UpdateBrand(int languageId, int id, CarBrandEntity entity);
        Task UpdateColor(int languageId, int id, CarColorEntity entity);
        Task UpdateModel(int languageId, int id, CarModelEntity entity);
        Task DeleteBrand(int id);
        Task DeleteColor(int id);
        Task DeleteModel(int id);
    }
}
