using JapanCar.Application.DTOs;
using JapanCar.Application.Interfaces;
using JapanCar.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.Services
{
    public class BaseInfoService
    {
        private readonly IUnitOfWork _unitOfWork;


        public BaseInfoService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }


        public async Task<GridDto<ColorDto>> GetColors(string? keyword, int? skip = null, int? take = null)
        {
            var entities = await _unitOfWork.BaseInfoRepository.GetColors(keyword, skip, take);

            var colors = entities.Items.Select(x => new ColorDto
            {
                ColorId = x.ColorId,
                ColorName = x.ColorName,
                CreatedAt = x.CreatedDate
            });

            var totalPage = 0;

            if (take.HasValue)
            {
                var tp = int.Parse(Math.Floor(decimal.Divide(entities.TotalCount, Convert.ToDecimal(take))).ToString());
                totalPage = tp + 1;
            }

            return new GridDto<ColorDto>
            {
                Items = colors,
                TotalPage = totalPage
            };
        }


        public async Task<GridDto<BrandDto>> GetBrands(string? keyword, int? skip = null, int? take = null)
        {
            var entities = await _unitOfWork.BaseInfoRepository.GetBrands(keyword, skip, take);

            var brands = entities.Items.Select(x => new BrandDto
            {
                BrandId = x.BrandId,
                BrandName = x.BrandName,
                CreatedAt = x.CreatedDate
            });

            var totalPage = 0;

            if (take.HasValue)
            {
                var tp = int.Parse(Math.Floor(decimal.Divide(entities.TotalCount, Convert.ToDecimal(take))).ToString());
                totalPage = tp + 1;
            }

            return new GridDto<BrandDto>
            {
                Items = brands,
                TotalPage = totalPage
            };
        }


        public async Task<GridDto<ModelDto>> GetModels(string? keyword, int? skip = null, int? take = null)
        {
            var entities = await _unitOfWork.BaseInfoRepository.GetModels(keyword, skip, take);

            var models = entities.Items.Select(x => new ModelDto
            {
                ModelId = x.ModelId,
                BrandId = x.BrandId,
                ModelName = x.ModelName,
                BrandName = x.BrandName,
                CreatedAt = x.CreatedDate
            });

            var totalPage = 0;

            if (take.HasValue)
            {
                var tp = int.Parse(Math.Floor(decimal.Divide(entities.TotalCount, Convert.ToDecimal(take))).ToString());
                totalPage = tp + 1;
            }

            return new GridDto<ModelDto>
            {
                Items = models,
                TotalPage = totalPage
            };
        }


        public async Task<IEnumerable<ModelDto>> GetModelsOfBrands(int brandId)
        {
            var models = await _unitOfWork.BaseInfoRepository.GetModelsOfBrands(brandId);
            return models.Select(x => new ModelDto
            {
                ModelId = x.ModelId,
                BrandId = x.BrandId,
                ModelName = x.ModelName,
            });
        }


        public async Task CreateBrand(BrandDto dto)
        {
            var entity = new CarBrandEntity
            {
                BrandName = dto.BrandName
            };

            await _unitOfWork.BaseInfoRepository.CreateBrand(entity);
        }


        public async Task UpdateBrand(int brandId, BrandDto dto)
        {
            var entity = new CarBrandEntity
            {
                BrandName = dto.BrandName
            };

            await _unitOfWork.BaseInfoRepository.UpdateBrand(brandId, entity);
        }


        public async Task DeleteBrand(int brandId)
        {
            await _unitOfWork.BaseInfoRepository.DeleteBrand(brandId);
        }


        public async Task CreateColor(ColorDto dto)
        {
            var entity = new CarColorEntity
            {
                ColorName = dto.ColorName
            };

            await _unitOfWork.BaseInfoRepository.CreateColor(entity);
        }


        public async Task UpdateColor(int colorId, ColorDto dto)
        {
            var entity = new CarColorEntity
            {
                ColorName = dto.ColorName
            };

            await _unitOfWork.BaseInfoRepository.UpdateColor(colorId, entity);
        }


        public async Task DeleteColor(int colorId)
        {
            await _unitOfWork.BaseInfoRepository.DeleteColor(colorId);
        }


        public async Task CreateModel(ModelDto dto)
        {
            var entity = new CarModelEntity
            {
                ModelName = dto.ModelName,
                BrandId = dto.BrandId,
            };

            await _unitOfWork.BaseInfoRepository.CreateModel(entity);
        }


        public async Task UpdateModel(int modelId, ModelDto dto)
        {
            var entity = new CarModelEntity
            {
                ModelName = dto.ModelName,
                BrandId = dto.BrandId,
            };

            await _unitOfWork.BaseInfoRepository.UpdateModel(modelId, entity);
        }


        public async Task DeleteModel(int modelId)
        {
            await _unitOfWork.BaseInfoRepository.DeleteModel(modelId);
        }
    }
}
