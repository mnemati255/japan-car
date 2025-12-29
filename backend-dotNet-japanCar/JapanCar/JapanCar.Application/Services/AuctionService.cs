using Common.Exceptions;
using DocumentFormat.OpenXml.Spreadsheet;
using JapanCar.Application.DTOs;
using JapanCar.Application.Helpers;
using JapanCar.Application.Interfaces;
using JapanCar.Domain.Entities;
using System.Net;

namespace JapanCar.Application.Services
{
    public class AuctionService : BaseService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRequestContext _requestContext;

        public AuctionService(IUnitOfWork unitOfWork, LanguageService languageService, IRequestContext requestContext) : base(languageService)
        {
            _unitOfWork = unitOfWork;
            _requestContext = requestContext;
        }

        public async Task<GridDto<AuctionDto>> GetAuctions(string? keyword, int? skip = null, int? take = null)
        {
            var languageId = await GetLanguageId(_requestContext.Locale);

            var entities = await _unitOfWork.AuctionRepository.GetAuctions(languageId, keyword, skip, take);

            var auctions = entities.Items.Select(x => new AuctionDto
            {
                AuctionId = x.AuctionId,
                AuctionName = x.AuctionName,
                CreatedAt = x.CreatedDate
            }).ToList();

            var totalPage = take.HasValue ? PagingHelper.GetTotalPages(entities.TotalCount, take.Value) : 0;

            return new GridDto<AuctionDto>
            {
                Items = auctions,
                TotalPage = totalPage
            };
        }

        public async Task<AuctionDto> GetAuctionById(string locale, int id)
        {
            var languageId = await GetLanguageId(locale);

            var auction = await _unitOfWork.AuctionRepository.GetAuctionById(languageId, id);

            if (auction == null)
                throw new AppException("Not found", HttpStatusCode.NotFound);

            return new AuctionDto
            {
                AuctionId = auction.AuctionId,
                AuctionName = auction.AuctionName,
            };
        }

        public async Task CreateAuction(AuctionDto dto)
        {
            var languageId = await GetLanguageId(_requestContext.Locale);

            await _unitOfWork.AuctionRepository.CreateAuction(languageId, new AuctionEntity
            {
                AuctionName = dto.AuctionName,
                CreatedBy = _requestContext.UserId
            });
        }

        public async Task UpdateAuction(string locale, int id, AuctionDto dto)
        {
            var languageId = await GetLanguageId(locale);

            var result = await _unitOfWork.AuctionRepository.UpdateAuction(languageId, id, new AuctionEntity
            {
                AuctionName = dto.AuctionName,
                ModifiedDate = DateTime.Now,
                ModifiedBy = _requestContext.UserId
            });

            if (!result)
                throw new AppException("Not found", HttpStatusCode.NotFound);
        }

        public async Task DeleteAuction(int id)
        {
            var result = await _unitOfWork.AuctionRepository.DeleteAuction(id);
            if (!result)
                throw new AppException("Not found", HttpStatusCode.NotFound);
        }
    }
}
