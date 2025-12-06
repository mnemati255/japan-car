using Common.Exceptions;
using JapanCar.Application.DTOs;
using JapanCar.Application.Interfaces;
using JapanCar.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.Services
{
    public class AuctionService
    {
        private readonly IUnitOfWork _unitOfWork;

        public AuctionService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<AuctionDto>> GetAllAuctions()
        {
            var auctions = await _unitOfWork.AuctionRepository.GetAll();

            return auctions.Select(x => new AuctionDto
            {
                AuctionId = x.AuctionId,
                AuctionName = x.AuctionName,
                AuctionDate = x.AuctionDate.ToString(),
                AuctionFee = x.AuctionFee,
                CreatedAt = x.CreatedDate
            });
        }

        public async Task<AuctionDto> GetAuctionById(int id)
        {
            var auction = await _unitOfWork.AuctionRepository.GetById(id);

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
            await _unitOfWork.AuctionRepository.Create(new AuctionEntity
            {
                AuctionName = dto.AuctionName,
                AuctionDate = DateOnly.Parse(dto.AuctionDate.Split("T")[0]),
                AuctionFee= dto.AuctionFee,
            });
        }

        public async Task UpdateAuction(int id, AuctionDto dto)
        {
            var result = await _unitOfWork.AuctionRepository.Update(id, new AuctionEntity
            {
                AuctionName= dto.AuctionName,
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
