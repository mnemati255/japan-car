using Common.Exceptions;
using JapanCar.Application.DTOs;
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

        public async Task<IEnumerable<AuctionDto>> GetAllAuctions()
        {
            var languageId = await GetLanguageId(_requestContext.Locale);

            var auctions = await _unitOfWork.AuctionRepository.GetAll((int)languageId);

            return auctions.Select(x => new AuctionDto
            {
                AuctionId = x.AuctionId,
                AuctionName = x.AuctionName,
                AuctionDate = x.AuctionDate.ToString(),
                AuctionFee = x.AuctionFee,
                CreatedAt = x.CreatedDate
            });
        }

        public async Task<AuctionDto> GetAuctionById(int id, string locale)
        {
            var languageId = await GetLanguageId(locale);

            var auction = await _unitOfWork.AuctionRepository.GetById(languageId, id);

            if (auction == null)
                throw new AppException("Not found", HttpStatusCode.NotFound);

            return new AuctionDto
            {
                AuctionId = auction.AuctionId,
                AuctionName = auction.AuctionName,
                AuctionDate = auction.AuctionDate.ToString(),
                AuctionFee = auction.AuctionFee,
            };
        }

        public async Task CreateAuction(AuctionDto dto)
        {
            var languageId = await GetLanguageId(_requestContext.Locale);

            await _unitOfWork.AuctionRepository.Create((int)languageId, new AuctionEntity
            {
                AuctionName = dto.AuctionName,
                AuctionDate = DateOnly.Parse(dto.AuctionDate.Split("T")[0]),
                AuctionFee = dto.AuctionFee,
            });
        }

        public async Task UpdateAuction(string locale, int id, AuctionDto dto)
        {
            var languageId = await GetLanguageId(locale);

            var result = await _unitOfWork.AuctionRepository.Update(languageId, id, new AuctionEntity
            {
                AuctionName = dto.AuctionName,
                AuctionDate = DateOnly.Parse(dto.AuctionDate.Split("T")[0]),
                AuctionFee = dto.AuctionFee,
                ModifiedDate = DateTime.Now
            });

            if (!result)
                throw new AppException("Not found", HttpStatusCode.NotFound);
        }

        public async Task DeleteAuction(int id)
        {
            var result = await _unitOfWork.AuctionRepository.Delete(id);
            if (!result)
                throw new AppException("Not found", HttpStatusCode.NotFound);
        }
    }
}
