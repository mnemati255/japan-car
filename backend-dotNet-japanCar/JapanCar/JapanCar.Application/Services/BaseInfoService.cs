using Common.Exceptions;
using JapanCar.Application.DTOs;
using JapanCar.Application.Helpers;
using JapanCar.Application.Interfaces;
using JapanCar.Domain.Entities;

namespace JapanCar.Application.Services
{
    public class BaseInfoService : BaseService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRequestContext _requestContext;


        public BaseInfoService(IUnitOfWork unitOfWork, LanguageService languageService, IRequestContext requestContext) : base(languageService)
        {
            _unitOfWork = unitOfWork;
            _requestContext = requestContext;
        }


        public async Task<GridDto<ColorDto>> GetColors(string? keyword, int? skip = null, int? take = null)
        {
            var languageId = await GetLanguageId(_requestContext.Locale);

            var entities = await _unitOfWork.BaseInfoRepository.GetColors(languageId, keyword, skip, take);

            var colors = entities.Items.Select(x => new ColorDto
            {
                ColorId = x.ColorId,
                ColorName = x.ColorName,
                CreatedAt = x.CreatedDate
            }).ToList();

            var totalPage = take.HasValue ? PagingHelper.GetTotalPages(entities.TotalCount, take.Value) : 0;

            return new GridDto<ColorDto>
            {
                Items = colors,
                TotalPage = totalPage
            };
        }


        public async Task<GridDto<BrandDto>> GetBrands(string? keyword, int? skip = null, int? take = null)
        {
            var languageId = await GetLanguageId(_requestContext.Locale);

            var entities = await _unitOfWork.BaseInfoRepository.GetBrands(languageId, keyword, skip, take);

            var brands = entities.Items.Select(x => new BrandDto
            {
                BrandId = x.BrandId,
                BrandName = x.BrandName,
                CreatedAt = x.CreatedDate
            }).ToList();

            var totalPage = take.HasValue ? PagingHelper.GetTotalPages(entities.TotalCount, take.Value) : 0;

            return new GridDto<BrandDto>
            {
                Items = brands,
                TotalPage = totalPage
            };
        }


        public async Task<GridDto<ModelDto>> GetModels(string? keyword, int? skip = null, int? take = null)
        {
            var languageId = await GetLanguageId(_requestContext.Locale);

            var entities = await _unitOfWork.BaseInfoRepository.GetModels(languageId, keyword, skip, take);

            var models = entities.Items.Select(x => new ModelDto
            {
                ModelId = x.ModelId,
                BrandId = x.BrandId,
                ModelName = x.ModelName,
                BrandName = x.BrandName,
                CreatedAt = x.CreatedDate
            }).ToList();

            var totalPage = take.HasValue ? PagingHelper.GetTotalPages(entities.TotalCount, take.Value) : 0;

            return new GridDto<ModelDto>
            {
                Items = models,
                TotalPage = totalPage
            };
        }


        public async Task<IEnumerable<ModelDto>> GetModelsOfBrands(int brandId)
        {
            var languageId = await GetLanguageId(_requestContext.Locale);

            var models = await _unitOfWork.BaseInfoRepository.GetModelsOfBrands(languageId, brandId);

            return models.Select(x => new ModelDto
            {
                ModelId = x.ModelId,
                BrandId = x.BrandId,
                ModelName = x.ModelName,
            });
        }


        public async Task<ColorDto> GetColorById(string locale, int id)
        {
            var languageId = await GetLanguageId(locale);

            var entity = await _unitOfWork.BaseInfoRepository.GetColorById(languageId, id);

            if (entity == null)
                throw new AppException("Not found", System.Net.HttpStatusCode.NotFound);

            return new ColorDto
            {
                ColorId = id,
                ColorName = entity.ColorName
            };
        }


        public async Task<BrandDto> GetBrandById(string locale, int id)
        {
            var languageId = await GetLanguageId(locale);

            var entity = await _unitOfWork.BaseInfoRepository.GetBrandById(languageId, id);

            if (entity == null)
                throw new AppException("Not found", System.Net.HttpStatusCode.NotFound);

            return new BrandDto
            {
                BrandId = id,
                BrandName = entity.BrandName
            };
        }


        public async Task<ModelDto> GetModelById(string locale, int id)
        {
            var languageId = await GetLanguageId(locale);

            var entity = await _unitOfWork.BaseInfoRepository.GetModelById(languageId, id);

            if (entity == null)
                throw new AppException("Not found", System.Net.HttpStatusCode.NotFound);

            return new ModelDto
            {
                ModelId = id,
                BrandId = entity.BrandId,
                ModelName = entity.ModelName
            };
        }


        public async Task CreateBrand(BrandDto dto)
        {
            var languageId = await GetLanguageId(_requestContext.Locale);

            var entity = new CarBrandEntity
            {
                BrandName = dto.BrandName
            };

            await _unitOfWork.BaseInfoRepository.CreateBrand(languageId, entity);
        }


        public async Task UpdateBrand(string locale, int brandId, BrandDto dto)
        {
            var languageId = await GetLanguageId(locale);

            var entity = new CarBrandEntity
            {
                BrandName = dto.BrandName
            };

            await _unitOfWork.BaseInfoRepository.UpdateBrand(languageId, brandId, entity);
        }


        public async Task DeleteBrand(int brandId)
        {
            await _unitOfWork.BaseInfoRepository.DeleteBrand(brandId);
        }


        public async Task CreateColor(ColorDto dto)
        {
            var languageId = await GetLanguageId(_requestContext.Locale);

            var entity = new CarColorEntity
            {
                ColorName = dto.ColorName
            };

            await _unitOfWork.BaseInfoRepository.CreateColor(languageId, entity);
        }


        public async Task UpdateColor(string locale, int colorId, ColorDto dto)
        {
            var languageId = await GetLanguageId(locale);

            var entity = new CarColorEntity
            {
                ColorName = dto.ColorName
            };

            await _unitOfWork.BaseInfoRepository.UpdateColor(languageId, colorId, entity);
        }


        public async Task DeleteColor(int colorId)
        {
            await _unitOfWork.BaseInfoRepository.DeleteColor(colorId);
        }


        public async Task CreateModel(ModelDto dto)
        {
            var languageId = await GetLanguageId(_requestContext.Locale);

            var entity = new CarModelEntity
            {
                ModelName = dto.ModelName,
                BrandId = dto.BrandId,
            };

            await _unitOfWork.BaseInfoRepository.CreateModel(languageId, entity);
        }


        public async Task UpdateModel(string locale, int modelId, ModelDto dto)
        {
            var languageId = await GetLanguageId(locale);

            var entity = new CarModelEntity
            {
                ModelName = dto.ModelName,
                BrandId = dto.BrandId,
            };

            await _unitOfWork.BaseInfoRepository.UpdateModel(languageId, modelId, entity);
        }


        public async Task DeleteModel(int modelId)
        {
            await _unitOfWork.BaseInfoRepository.DeleteModel(modelId);
        }
    }
}
