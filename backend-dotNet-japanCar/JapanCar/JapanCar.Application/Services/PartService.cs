using Common.Exceptions;
using JapanCar.Application.DTOs;
using JapanCar.Application.Helpers;
using JapanCar.Application.Interfaces;
using JapanCar.Domain.Entities;

namespace JapanCar.Application.Services
{
    public class PartService : BaseService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRequestContext _requestContext;


        public PartService(IUnitOfWork unitOfWork, IRequestContext requestContext, LanguageService languageService) : base(languageService)
        {
            _unitOfWork = unitOfWork;
            _requestContext = requestContext;
        }


        public async Task<GridDto<PartDto>> GetParts(string? keyword, int? skip = null, int? take = null)
        {
            var languageId = await GetLanguageId(_requestContext.Locale);

            var entities = await _unitOfWork.PartRepository.GetParts(languageId, keyword, skip, take);

            var colors = entities.Items.Select(x => new PartDto
            {
                PartId = x.PartId,
                PartPrice = x.PartPrice,
                PartName = x.PartName,
                PartDescription = x.PartDescription,
                CreatedAt = x.CreatedDate
            }).ToList();

            var totalPage = take.HasValue ? PagingHelper.GetTotalPages(entities.TotalCount, take.Value) : 0;

            return new GridDto<PartDto>
            {
                Items = colors,
                TotalPage = totalPage
            };
        }


        public async Task<PartDto> GetPartById(string locale, int id)
        {
            var languageId = await GetLanguageId(locale);

            var entity = await _unitOfWork.PartRepository.GetPartById(languageId, id);

            if (entity == null)
                throw new AppException("Not found", System.Net.HttpStatusCode.NotFound);

            return new PartDto
            {
                PartId = id,
                PartPrice = entity.PartPrice,
                PartName = entity.PartName,
                PartDescription = entity.PartDescription,
            };
        }


        public async Task CreatePart(PartDto dto)
        {
            var languageId = await GetLanguageId(_requestContext.Locale);

            var entity = new PartEntity
            {
                PartPrice = dto.PartPrice,
                PartName = dto.PartName,
                PartDescription = dto.PartDescription,
            };

            await _unitOfWork.PartRepository.CreatePart(languageId, entity);
        }


        public async Task UpdatePart(string locale, int partId, PartDto dto)
        {
            var languageId = await GetLanguageId(locale);

            var entity = new PartEntity
            {
                PartPrice = dto.PartPrice,
                PartName = dto.PartName,
                PartDescription = dto.PartDescription,
            };

            await _unitOfWork.PartRepository.UpdatePart(languageId, partId, entity);
        }


        public async Task DeletePart(int partId)
        {
            var deleted = await _unitOfWork.PartRepository.DeletePart(partId);
            if(!deleted)
                throw new AppException("Not found", System.Net.HttpStatusCode.NotFound);
        }
    }
}
