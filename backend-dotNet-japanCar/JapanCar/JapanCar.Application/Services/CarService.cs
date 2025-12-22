using Common.Exceptions;
using JapanCar.Application.DTOs;
using JapanCar.Application.Helpers;
using JapanCar.Application.Interfaces;
using JapanCar.Application.Models;
using JapanCar.Common;
using JapanCar.Domain.Entities;
using System.Reflection;

namespace JapanCar.Application.Services
{
    public class CarService : BaseService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileStorage _fileStorage;
        private readonly IRequestContext _requestContext;

        public CarService(
            IUnitOfWork unitOfWork,
            IFileStorage fileStorage,
            LanguageService languageService,
            IRequestContext requestContext
            ) : base(languageService)
        {
            _unitOfWork = unitOfWork;
            _fileStorage = fileStorage;
            _requestContext = requestContext;
        }


        public async Task<GridDto<CarDto>> GetAllCars(CarFilterDto filterDto, int? auctionId = null)
        {
            var languageId = await GetLanguageId(_requestContext.Locale);

            var entities = await _unitOfWork.CarRepository.GetCars(languageId, filterDto, auctionId);

            var cars = entities.Items.Select(x => new CarDto
            {
                CarId = x.CarId,
                AuctionId = x.AuctionId,
                AuctionName = x.AuctionName,
                BrandName = x.BrandName,
                ModelName = x.ModelName,
                ColorName = x.ColorName,
                FinalPrice = x.FinalPrice,
                PurchasePrice = x.PurchasePrice,
                TaxAmount = x.TaxAmount,
                TransportPrice = x.TransportPrice,
                AuctionPrice = x.AuctionPrice,
                Year = x.Year,
                CreatedAt = x.CreatedDate,
                Images = x.ImageUrls,
                SukuraNumber = x.SukuraNumber,
                PurchaseDate = x.PurchaseDate.ToString(),
                ChasisNumber = x.ChassisNumber,
                ForSale = x.ForSale
            });

            var totalPage = filterDto.Take.HasValue ? PagingHelper.GetTotalPages(entities.TotalCount, filterDto.Take.Value) : 0;

            return new GridDto<CarDto>
            {
                Items = cars,
                TotalPage = totalPage
            };
        }


        public async Task<int?> CreateCar(CarDto dto, List<FileData> images, string userName)
        {
            var savedNames = await _fileStorage.SaveFilesAsync(images, Constants.CARS_IMAGES_FOLDER);

            int? sukuraNumber = null;
            if (dto.ForSale == 1)
                sukuraNumber = await _unitOfWork.CarRepository.GetSukuraNumber();

            var currentUser = await _unitOfWork.UserRepository.GetUserByUserName(userName);
            if (currentUser == null)
                throw new AppException("User not found", System.Net.HttpStatusCode.NotFound);

            await _unitOfWork.CarRepository.Create(new CarEntity
            {
                AuctionId = dto.AuctionId,
                ChassisNumber = dto.ChasisNumber,
                ColorId = dto.ColorId,
                EngineVolume = dto.EngineVolume,
                FinalPrice = dto.FinalPrice,
                FuelType = dto.FuelType,
                ImageUrls = savedNames.ToArray(),
                Mileage = dto.Mileage,
                PurchasePrice = dto.PurchasePrice,
                TaxAmount = dto.TaxAmount,
                TransportPrice = dto.TransportPrice,
                AuctionPrice = dto.AuctionPrice,
                Year = dto.Year,
                ModelId = dto.ModelId,
                ManufactureMonth = dto.ManufactureMonth,
                ScrapCost = dto.ScrapCost,
                HasInsurance = dto.HasInsurance,
                InsuranceEndDate = dto.InsuranceEndDate.ToDateTime(),
                TransmissionType = dto.TransmissionType,
                PlateType = dto.PlateType,
                PlateNumber = dto.PlateNumber,
                PurchaseDate = dto.PurchaseDate.ToDateTime()!.Value,
                ForSale = dto.ForSale,
                TransportConfirm = dto.TransportConfirm,
                TransportDate = dto.TransportDate.ToDateTime(),
                TransportDateReceived = dto.TransportDateReceived.ToDateTime(),
                TransportFrom = dto.TransportFrom,
                TransportTo = dto.TransportTo,
                NeedsPoliceCertificate = dto.NeedsPoliceCertificate,
                PoliceCertificateRequestedDate = dto.PoliceCertificateRequestedDate.ToDateTime(),
                PoliceCertificateReceivedDate = dto.PoliceCertificateReceivedDate.ToDateTime(),
                DeedRequestedDate = dto.DeedRequestedDate.ToDateTime(),
                DeedIssuedDate = dto.DeedIssuedDate.ToDateTime(),
                PlateRegisteredDate = dto.PlateRegisteredDate.ToDateTime(),
                SukuraNumber = sukuraNumber,
                SentToMunicipality = dto.SentToMunicipality,
                MunicipalitySentDate = dto.MunicipalitySentDate.ToDateTime(),
                MunicipalitySentToPerson = dto.MunicipalitySentToPerson,
                MunicipalitySentByUserId = dto.SentToMunicipality ? currentUser.UserId : null,
                SentToAuction = dto.SentToAuction,
                AuctionSentDate = dto.AuctionSentDate.ToDateTime(),
                AuctionSentToPerson = dto.AuctionSentToPerson,
                AuctionSentByUserId = dto.SentToAuction ? currentUser.UserId : null,
                PlateRevoked = dto.PlateRevoked,
                PlateRevokedDate = dto.PlateRevokedDate.ToDateTime(),
                PlateRevokedByUserId = dto.PlateRevoked ? currentUser.UserId : null
            });

            return sukuraNumber;
        }


        public async Task<int?> UpdateCar(int id, CarDto dto, List<FileData> images, string userName)
        {
            var carWithImages = await _unitOfWork.CarRepository.GetById(id, false, true);

            if (carWithImages != null)
                _fileStorage.DeleteFiles(carWithImages.ImageUrls);

            var savedNames = await _fileStorage.SaveFilesAsync(images, Constants.CARS_IMAGES_FOLDER);

            var currentUser = await _unitOfWork.UserRepository.GetUserByUserName(userName);
            if (currentUser == null)
                throw new AppException("User not found", System.Net.HttpStatusCode.NotFound);

            int? sukuraNumber = null;
            if (dto.ForSale == 1)
                sukuraNumber = await _unitOfWork.CarRepository.GetSukuraNumber();

            var updatedSukuraNumber = await _unitOfWork.CarRepository.Update(id, new CarEntity
            {
                AuctionId = dto.AuctionId,
                ChassisNumber = dto.ChasisNumber,
                ColorId = dto.ColorId,
                EngineVolume = dto.EngineVolume,
                FinalPrice = dto.FinalPrice,
                FuelType = dto.FuelType,
                ImageUrls = savedNames.ToArray(),
                Mileage = dto.Mileage,
                PurchasePrice = dto.PurchasePrice,
                TransportPrice = dto.TransportPrice,
                AuctionPrice = dto.AuctionPrice,
                TaxAmount = dto.TaxAmount,
                Year = dto.Year,
                ModelId = dto.ModelId,
                ManufactureMonth = dto.ManufactureMonth,
                ScrapCost = dto.ScrapCost,
                HasInsurance = dto.HasInsurance,
                InsuranceEndDate = dto.InsuranceEndDate.ToDateTime(),
                TransmissionType = dto.TransmissionType,
                PlateType = dto.PlateType,
                PlateNumber = dto.PlateNumber,
                PurchaseDate = dto.PurchaseDate.ToDateTime()!.Value,
                ForSale = dto.ForSale,
                TransportConfirm = dto.TransportConfirm,
                TransportDate = dto.TransportDate.ToDateTime(),
                TransportDateReceived = dto.TransportDateReceived.ToDateTime(),
                TransportFrom = dto.TransportFrom,
                TransportTo = dto.TransportTo,
                NeedsPoliceCertificate = dto.NeedsPoliceCertificate,
                PoliceCertificateRequestedDate = dto.PoliceCertificateRequestedDate.ToDateTime(),
                PoliceCertificateReceivedDate = dto.PoliceCertificateReceivedDate.ToDateTime(),
                DeedRequestedDate = dto.DeedRequestedDate.ToDateTime(),
                DeedIssuedDate = dto.DeedIssuedDate.ToDateTime(),
                PlateRegisteredDate = dto.PlateRegisteredDate.ToDateTime(),
                SukuraNumber = sukuraNumber,
                SentToMunicipality = dto.SentToMunicipality,
                MunicipalitySentDate = dto.MunicipalitySentDate.ToDateTime(),
                MunicipalitySentToPerson = dto.MunicipalitySentToPerson,
                MunicipalitySentByUserId = dto.SentToMunicipality ? currentUser.UserId : null,
                SentToAuction = dto.SentToAuction,
                AuctionSentDate = dto.AuctionSentDate.ToDateTime(),
                AuctionSentToPerson = dto.AuctionSentToPerson,
                AuctionSentByUserId = dto.SentToAuction ? currentUser.UserId : null,
                PlateRevoked = dto.PlateRevoked,
                PlateRevokedDate = dto.PlateRevokedDate.ToDateTime(),
                PlateRevokedByUserId = dto.PlateRevoked ? currentUser.UserId : null
            });

            return updatedSukuraNumber;
        }


        public async Task DeleteCar(int id)
        {
            var car = await _unitOfWork.CarRepository.GetById(id, false, true);
            if (car == null)
                throw new AppException("Not found", System.Net.HttpStatusCode.NotFound);

            if (car.ImageUrls.Any())
                _fileStorage.DeleteFiles(car.ImageUrls);

            await _unitOfWork.CarRepository.Delete(id);
        }


        public async Task<CarDto?> GetCarById(int id)
        {
            var car = await _unitOfWork.CarRepository.GetById(id, true, true);

            if (car == null)
                return null;

            return new CarDto
            {
                CarId = car.CarId,
                AuctionId = car.AuctionId,
                BrandId = car.BrandId,
                BrandName = car.BrandName,
                ModelName = car.ModelName,
                ColorName = car.ColorName,
                FinalPrice = car.FinalPrice,
                PurchasePrice = car.PurchasePrice,
                TaxAmount = car.TaxAmount,
                TransportPrice = car.TransportPrice,
                AuctionPrice = car.AuctionPrice,
                Year = car.Year,
                CreatedAt = car.CreatedDate,
                Images = car.ImageUrls,
                ColorId = car.ColorId,
                ModelId = car.ModelId,
                ChasisNumber = car.ChassisNumber,
                Mileage = car.Mileage,
                EngineVolume = car.EngineVolume,
                FuelType = car.FuelType,
                ManufactureMonth = car.ManufactureMonth ?? 0,
                PurchaseDate = car.PurchaseDate.ToString(),
                ScrapCost = car.ScrapCost,
                HasInsurance = car.HasInsurance,
                InsuranceEndDate = car.InsuranceEndDate?.ToString(),
                PlateType = car.PlateType,
                PlateNumber = car.PlateNumber,
                TransmissionType = car.TransmissionType,
                ForSale = car.ForSale,
                TransportConfirm = car.TransportConfirm,
                TransportDate = car.TransportDate?.ToString(),
                TransportDateReceived = car.TransportDateReceived?.ToString(),
                TransportFrom = car.TransportFrom,
                TransportTo = car.TransportTo,
                NeedsPoliceCertificate = car.NeedsPoliceCertificate,
                PoliceCertificateRequestedDate = car.PoliceCertificateRequestedDate?.ToString(),
                PoliceCertificateReceivedDate = car.PoliceCertificateReceivedDate?.ToString(),
                DeedRequestedDate = car.DeedRequestedDate?.ToString(),
                DeedIssuedDate = car.DeedIssuedDate?.ToString(),
                PlateRegisteredDate = car.PlateRegisteredDate?.ToString(),
                SukuraNumber = car.SukuraNumber,
                SentToMunicipality = car.SentToMunicipality,
                MunicipalitySentDate = car.MunicipalitySentDate.ToString(),
                MunicipalitySentToPerson = car.MunicipalitySentToPerson,
                SentToAuction = car.SentToAuction,
                AuctionSentDate = car.AuctionSentDate.ToString(),
                AuctionSentToPerson = car.AuctionSentToPerson,
                PlateRevoked = car.PlateRevoked,
                PlateRevokedDate = car.PlateRevokedDate.ToString(),
            };
        }
    }
}
