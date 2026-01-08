using DocumentFormat.OpenXml.Office.CustomUI;
using DocumentFormat.OpenXml.Vml.Office;
using JapanCar.Application.DTOs;
using JapanCar.Application.Helpers;
using JapanCar.Application.Interfaces;
using JapanCar.Application.Models;
using JapanCar.Domain.Entities;
using JapanCar.Infrastructure.Persistence.Models;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace JapanCar.Infrastructure.Persistence.Repositories
{
    public class CarRepository : ICarRepository
    {
        private readonly AppDbContext _context;

        public CarRepository(AppDbContext context)
        {
            _context = context;
        }


        public async Task<int> Create(int languageId, CarEntity entity)
        {
            var newCar = new Car
            {
                ModelId = entity.ModelId,
                ColorId = entity.ColorId,
                ActionId = entity.AuctionId,
                Year = entity.Year,
                ChassisNumber = entity.ChassisNumber,
                EngineVolume = entity.EngineVolume,
                FuelType = entity.FuelType,
                Mileage = entity.Mileage,
                ManufactureMonth = entity.ManufactureMonth,
                PlateType = entity.PlateType,
                TransmissionType = entity.TransmissionType,
                HasInsurance = entity.HasInsurance,
                InsuranceExpireDate = entity.InsuranceEndDate,
                ForSale = entity.ForSale,
                TransportConfirm = entity.TransportConfirm,
                TransportDate = entity.TransportDate,
                TransportDateReceived = entity.TransportDateReceived,
                TransportFrom = entity.TransportFrom,
                TransportTo = entity.TransportTo,
                NeedsPoliceCertificate = entity.NeedsPoliceCertificate,
                PoliceCertificateRequestedDate = entity.PoliceCertificateRequestedDate,
                PoliceCertificateReceivedDate = entity.PoliceCertificateReceivedDate,
                DeedRequestedDate = entity.DeedRequestedDate,
                DeedIssuedDate = entity.DeedIssuedDate,
                PlateNumber = entity.PlateNumber,
                PlateRegisteredDate = entity.PlateRegisteredDate,
                SukuraNumber = entity.SukuraNumber,
                SentToMunicipality = entity.SentToMunicipality,
                MunicipalitySentDate = entity.MunicipalitySentDate,
                MunicipalitySentToPerson = entity.MunicipalitySentToPerson,
                MunicipalitySentByUserId = entity.MunicipalitySentByUserId,
                SentToAction = entity.SentToAuction,
                ActionSentDate = entity.AuctionSentDate,
                ActionSentToPerson = entity.AuctionSentToPerson,
                ActionSentByUserId = entity.AuctionSentByUserId,
                PlateRevoked = entity.PlateRevoked,
                PlateRevokedDate = entity.PlateRevokedDate,
                PlateRevokedByUserId = entity.PlateRevokedByUserId,
                Grad = entity.Grad,
                Point = entity.Point,
                TransportConfirmUserId = entity.TransportConfirmUserId != 0 ? entity.TransportConfirmUserId : null,
                PoliceCertificateNumber = entity.PoliceCertificateNumber,
                ActionNumber = entity.ActionNumber,
                Katashaki = entity.Katashaki,
                ActionDeadlineDate = entity.ActionDeadlineDate,
                MunicipalityDeadlineDate = entity.MunicipalityDeadlineDate,
                PlateRevokedDeadLine = entity.PlateRevokedDeadLine,
                HasShakend = entity.HasShakend,
                ThirdPartyInsuranceNumber = entity.ThirdPartyInsuranceNumber,
                DeedNumber = entity.DeedNumber,
                CommandType = entity.CommandType,
                TransportCompanyRequestDate = entity.TransportCompanyRequestDate,
                NewPlateNumber = entity.NewPlateNumber,
                Description = entity.Description,
                InsuranceCancellationDate = entity.InsuranceCancellationDate,
                IsInsuranceCancelled = entity.IsInsuranceCancelled,
                IsUnder1000CcdeedCopyUploaded = entity.IsUnder1000CcdeedCopyUploaded,
                PoliceDeedCertificateDeliveryDate = entity.PoliceDeedCertificateDeliveryDate,
                NewDeedCopySentToBuyerDate = entity.NewDeedCopySentToBuyerDate,
                ThirdPartyInsuranceExpireDate = entity.ThirdPartyInsuranceExpireDate,
                ThirdPartyInsuranceCompany = entity.ThirdPartyInsuranceCompany,
            };

            newCar.CarAuctionDetails.Add(new CarAuctionDetail
            {
                PurchasePrice = entity.PurchasePrice,
                TaxAmount = entity.TaxAmount,
                FinalPrice = entity.FinalPrice,
                TransportPrice = entity.TransportPrice,
                AuctionPrice = entity.AuctionPrice,
                ScrapCost = entity.ScrapCost,
                PurchaseDate = entity.PurchaseDate
            });

            _context.Cars.Add(newCar);
            await _context.SaveChangesAsync();

            for (int i = 0; i < entity.Images.Length; i++)
            {
                var imageUrl = entity.Images[i];
                var fileType = entity.ImagesWithTypes[i]?.FileType ?? "";

                var carImageType = new CarImageType();
                carImageType.CarImageTypeTranslations.Add(new CarImageTypeTranslation
                {
                    Title = fileType,
                    LanguageId = 1
                });

                var carImage = new CarImage
                {
                    CarId = newCar.CarId,
                    ImageUrl = imageUrl,
                    ImageType = carImageType
                };

                _context.CarImages.Add(carImage);
            }

            await _context.SaveChangesAsync();

            return newCar.CarId;
        }


        public async Task<bool> Delete(int id)
        {
            var car = await _context.Cars
                .Include(x => x.CarAuctionDetails)
                .Include(x => x.CarImages)
                .Include(x => x.SystemNotifications)
                .Include(x => x.CarSales)
                .FirstOrDefaultAsync(x => x.CarId == id);

            if (car == null)
                return false;

            _context.CarAuctionDetails.RemoveRange(car.CarAuctionDetails);

            _context.CarImages.RemoveRange(car.CarImages);

            _context.SystemNotifications.RemoveRange(car.SystemNotifications);

            _context.CarSales.RemoveRange(car.CarSales);

            _context.Cars.Remove(car);

            await _context.SaveChangesAsync();

            return true;
        }


        public async Task<PagedResult<CarEntity>> GetCars(int languageId, CarFilterDto filterDto)
        {
            var query = from car in _context.Cars.AsNoTracking()

                        join cad in _context.CarAuctionDetails.AsNoTracking()
                            on car.CarId equals cad.CarId into cadGroup
                        from cad in cadGroup.DefaultIfEmpty()

                        join color in _context.CarColors.AsNoTracking()
                            on car.ColorId equals color.ColorId

                        join colorTr in _context.CarColorTranslations.AsNoTracking()
                                .Where(x => x.LanguageId == languageId)
                            on color.ColorId equals colorTr.CarColorId into colorTrGroup
                        from colorTr in colorTrGroup.DefaultIfEmpty()

                        join model in _context.CarModels.AsNoTracking()
                            on car.ModelId equals model.ModelId

                        join modelTr in _context.CarModelTranslations.AsNoTracking()
                                .Where(x => x.LanguageId == languageId)
                            on model.ModelId equals modelTr.CarModelId into modelTrGroup
                        from modelTr in modelTrGroup.DefaultIfEmpty()

                        join brand in _context.CarBrands.AsNoTracking()
                            on model.BrandId equals brand.BrandId

                        join brandTr in _context.CarBrandTranslations.AsNoTracking()
                                .Where(x => x.LanguageId == languageId)
                            on brand.BrandId equals brandTr.BrandId into brandTrGroup
                        from brandTr in brandTrGroup.DefaultIfEmpty()

                        join image in _context.CarImages.AsNoTracking()
                            on car.CarId equals image.CarId into imgs

                        orderby car.CreatedDate descending

                        select new { car, cad, color, colorTr, model, modelTr, brand, brandTr, imgs };

            if (filterDto.BrandId.HasValue)
                query = query.Where(x => x.brand.BrandId == filterDto.BrandId.Value);

            if (filterDto.ModelId.HasValue)
                query = query.Where(x => x.model.ModelId == filterDto.ModelId.Value);

            if (filterDto.ColorId.HasValue)
                query = query.Where(x => x.color.ColorId == filterDto.ColorId.Value);

            if (filterDto.Year.HasValue)
                query = query.Where(x => x.car.Year == filterDto.Year);

            if (!string.IsNullOrEmpty(filterDto.Katashaki))
                query = query.Where(x => !string.IsNullOrEmpty(x.car.Katashaki) && x.car.Katashaki.Contains(filterDto.Katashaki));

            if (!string.IsNullOrEmpty(filterDto.ChasisNumber))
                query = query.Where(x => x.car.ChassisNumber.Contains(filterDto.ChasisNumber));

            if (!string.IsNullOrEmpty(filterDto.FuelType))
                query = query.Where(x => x.car.FuelType == filterDto.FuelType);

            if (filterDto.Month.HasValue)
                query = query.Where(x => x.car.ManufactureMonth == filterDto.Month);

            if (!string.IsNullOrEmpty(filterDto.TransmissionType))
                query = query.Where(x => x.car.TransmissionType == filterDto.TransmissionType);

            if (filterDto.PlateType.HasValue)
                query = query.Where(x => x.car.PlateType == filterDto.PlateType);

            if (!string.IsNullOrEmpty(filterDto.PlateNumber))
                query = query.Where(x => !string.IsNullOrEmpty(x.car.PlateNumber) && x.car.PlateNumber.Contains(filterDto.PlateNumber));

            if (!string.IsNullOrEmpty(filterDto.PurchaseDateFrom))
            {
                var date = filterDto.PurchaseDateFrom.ToDateTime();
                query = query.Where(x => x.cad.PurchaseDate.Date >= date!.Value.Date);
            }

            if (!string.IsNullOrEmpty(filterDto.PurchaseDateTo))
            {
                var date = filterDto.PurchaseDateTo.ToDateTime();
                query = query.Where(x => x.cad.PurchaseDate.Date <= date!.Value.Date);
            }

            if (filterDto.PurchasePriceFrom.HasValue)
                query = query.Where(x => x.cad.PurchasePrice >= filterDto.PurchasePriceFrom);

            if (filterDto.PurchasePriceTo.HasValue)
                query = query.Where(x => x.cad.PurchasePrice <= filterDto.PurchasePriceTo);

            if (!string.IsNullOrEmpty(filterDto.TransportDateFrom))
            {
                var date = filterDto.TransportDateFrom.ToDateTime();
                query = query.Where(x => x.car.TransportDate != null && x.car.TransportDate.Value.Date >= date!.Value.Date);
            }

            if (!string.IsNullOrEmpty(filterDto.TransportDateTo))
            {
                var date = filterDto.TransportDateTo.ToDateTime();
                query = query.Where(x => x.car.TransportDate != null && x.car.TransportDate.Value.Date <= date!.Value.Date);
            }

            if (!string.IsNullOrEmpty(filterDto.HasPoliceCertificate))
                query = query.Where(x => x.car.PoliceCertificateReceivedDate != null);

            if (!string.IsNullOrEmpty(filterDto.PoliceCertificateReceivedDateFrom))
            {
                var date = filterDto.PoliceCertificateReceivedDateFrom.ToDateTime();
                query = query.Where(x => x.car.PoliceCertificateReceivedDate != null && x.car.PoliceCertificateReceivedDate.Value.Date >= date!.Value.Date);
            }

            if (!string.IsNullOrEmpty(filterDto.PoliceCertificateReceivedDateTo))
            {
                var date = filterDto.PoliceCertificateReceivedDateTo.ToDateTime();
                query = query.Where(x => x.car.PoliceCertificateReceivedDate != null && x.car.PoliceCertificateReceivedDate.Value.Date <= date!.Value.Date);
            }

            if (!string.IsNullOrEmpty(filterDto.MunicipalitySentDateFrom))
            {
                var date = filterDto.MunicipalitySentDateFrom.ToDateTime();
                query = query.Where(x => x.car.MunicipalitySentDate != null && x.car.MunicipalitySentDate.Value.Date >= date!.Value.Date);
            }

            if (!string.IsNullOrEmpty(filterDto.MunicipalitySentDateTo))
            {
                var date = filterDto.MunicipalitySentDateTo.ToDateTime();
                query = query.Where(x => x.car.MunicipalitySentDate != null && x.car.MunicipalitySentDate.Value.Date <= date!.Value.Date);
            }

            var totalCount = await query.CountAsync();

            if (filterDto.Skip.HasValue)
                query = query.Skip(filterDto.Skip.Value);

            if (filterDto.Take.HasValue)
                query = query.Take(filterDto.Take.Value);

            var items = await query
                .Select(x => new CarEntity
                {
                    CarId = x.car.CarId,
                    BrandName = x.brandTr.BrandName,
                    ModelName = x.modelTr.ModelName,
                    ColorName = x.colorTr.ColorName,
                    FinalPrice = x.cad != null ? x.cad.FinalPrice : 0,
                    PurchasePrice = x.cad != null ? x.cad.PurchasePrice : 0,
                    TaxAmount = x.cad != null ? x.cad.TaxAmount : 0,
                    Year = x.car.Year,
                    CreatedDate = x.car.CreatedDate,
                    Images = x.imgs.Select(i => i.ImageUrl).ToArray(),
                    SukuraNumber = x.car.SukuraNumber,
                    PurchaseDate = x.cad.PurchaseDate,
                    Katashaki = x.car.Katashaki,
                    ChassisNumber = x.car.ChassisNumber,
                    ForSale = x.car.ForSale
                }).ToListAsync();


            return new PagedResult<CarEntity>
            {
                Items = items,
                TotalCount = totalCount
            };
        }


        public async Task<CarEntity?> GetById(int id, bool withAuctionDetails, bool withImages)
        {
            var query = _context.Cars
                .Include(x => x.Model)
                .Include(x => x.CarSales.Where(y => y.IsActive))
                .Include(x => x.CarImages)
                    .ThenInclude(ci => ci.ImageType)
                        .ThenInclude(it => it.CarImageTypeTranslations)
                .Where(x => x.CarId == id);

            if (withAuctionDetails)
                query = query.Include(x => x.CarAuctionDetails);

            if (withImages)
                query = query.Include(x => x.CarImages);

            var car = await query.FirstOrDefaultAsync();

            if (car == null)
                return null;

            return new CarEntity
            {
                CarId = id,
                BrandId = car.Model.BrandId,
                ModelId = car.ModelId,
                ColorId = car.ColorId,
                AuctionId = car.ActionId,
                Mileage = car.Mileage,
                Year = car.Year,
                ChassisNumber = car.ChassisNumber,
                EngineVolume = car.EngineVolume,
                FuelType = car.FuelType,
                PurchasePrice = car.CarAuctionDetails.Any() ? car.CarAuctionDetails.First().PurchasePrice : 0,
                TaxAmount = car.CarAuctionDetails.Any() ? car.CarAuctionDetails.First().TaxAmount : null,
                FinalPrice = car.CarAuctionDetails.Any() ? car.CarAuctionDetails.First().FinalPrice : null,
                TransportPrice = car.CarAuctionDetails.Any() ? car.CarAuctionDetails.First().TransportPrice : null,
                AuctionPrice = car.CarAuctionDetails.Any() ? car.CarAuctionDetails.First().AuctionPrice : null,
                Images = car.CarImages.Any() ? car.CarImages.Select(x => x.ImageUrl).ToArray() : [],
                ImagesWithTypes = car.CarImages.Any()
                ? car.CarImages.Select(x => new Common.Models.FileData
                {
                    FileName = x.ImageUrl,
                    FileType = x.ImageType != null
                        ? x.ImageType.CarImageTypeTranslations
                            .FirstOrDefault(t => t.LanguageId == 1)?.Title ?? ""
                        : ""
                }).ToList() : new List<Common.Models.FileData>(),
                PurchaseDate = car.CarAuctionDetails.Any() ? car.CarAuctionDetails.First().PurchaseDate : DateTime.Now,
                ScrapCost = car.CarAuctionDetails.Any() ? car.CarAuctionDetails.First().ScrapCost : null,
                ManufactureMonth = car.ManufactureMonth,
                HasInsurance = car.HasInsurance,
                InsuranceEndDate = car.InsuranceExpireDate,
                PlateType = car.PlateType,
                PlateNumber = car.PlateNumber,
                TransmissionType = car.TransmissionType,
                ForSale = car.ForSale,
                TransportConfirm = car.TransportConfirm,
                TransportDate = car.TransportDate,
                TransportDateReceived = car.TransportDateReceived,
                TransportFrom = car.TransportFrom,
                TransportTo = car.TransportTo,
                NeedsPoliceCertificate = car.NeedsPoliceCertificate,
                PoliceCertificateRequestedDate = car.PoliceCertificateRequestedDate,
                PoliceCertificateReceivedDate = car.PoliceCertificateReceivedDate,
                DeedRequestedDate = car.DeedRequestedDate,
                DeedIssuedDate = car.DeedIssuedDate,
                PlateRegisteredDate = car.PlateRegisteredDate,
                SukuraNumber = car.SukuraNumber,
                SentToMunicipality = car.SentToMunicipality,
                MunicipalitySentDate = car.MunicipalitySentDate,
                MunicipalitySentToPerson = car.MunicipalitySentToPerson,
                MunicipalitySentByUserId = car.MunicipalitySentByUserId,
                SentToAuction = car.SentToAction,
                AuctionSentDate = car.ActionSentDate,
                AuctionSentToPerson = car.ActionSentToPerson,
                AuctionSentByUserId = car.ActionSentByUserId,
                PlateRevoked = car.PlateRevoked,
                PlateRevokedDate = car.PlateRevokedDate,
                PlateRevokedByUserId = car.PlateRevokedByUserId,
                Grad = car.Grad,
                Point = car.Point,
                TransportConfirmUserId = car.TransportConfirmUserId,
                PoliceCertificateNumber = car.PoliceCertificateNumber,
                ActionNumber = car.ActionNumber,
                Katashaki = car.Katashaki,
                ActionDeadlineDate = car.ActionDeadlineDate,
                MunicipalityDeadlineDate = car.MunicipalityDeadlineDate,
                PlateRevokedDeadLine = car.PlateRevokedDeadLine,
                HasShakend = car.HasShakend,
                ThirdPartyInsuranceNumber = car.ThirdPartyInsuranceNumber,
                DeedNumber = car.DeedNumber,
                CommandType = car.CommandType,
                TransportCompanyRequestDate = car.TransportCompanyRequestDate,
                NewPlateNumber = car.NewPlateNumber,
                Description = car.Description,
                InsuranceCancellationDate = car.InsuranceCancellationDate,
                IsInsuranceCancelled = car.IsInsuranceCancelled,
                IsUnder1000CcdeedCopyUploaded = car.IsUnder1000CcdeedCopyUploaded,
                PoliceDeedCertificateDeliveryDate = car.PoliceDeedCertificateDeliveryDate,
                NewDeedCopySentToBuyerDate = car.NewDeedCopySentToBuyerDate,
                BuyerId = car.CarSales.Any() ? car.CarSales.First().BuyerId : null,
                SaleDate = car.CarSales.Any() ? car.CarSales.First().SaleDate : null,
                SalePrice = car.CarSales.Any() ? car.CarSales.First().SalePrice : null,
                ThirdPartyInsuranceExpireDate = car.ThirdPartyInsuranceExpireDate,
                ThirdPartyInsuranceCompany = car.ThirdPartyInsuranceCompany,
            };
        }


        public async Task<int?> Update(int id, CarEntity entity)
        {
            var car = await _context.Cars
                .Where(x => x.CarId == id)
                .Include(x => x.CarAuctionDetails)
                .Include(x => x.CarImages)
                .FirstOrDefaultAsync();

            if (car != null)
            {
                car.ActionId = entity.AuctionId;
                car.ModelId = entity.ModelId;
                car.ColorId = entity.ColorId;
                car.Year = entity.Year;
                car.ChassisNumber = entity.ChassisNumber;
                car.EngineVolume = entity.EngineVolume;
                car.FuelType = entity.FuelType;
                car.Mileage = entity.Mileage;
                car.ManufactureMonth = entity.ManufactureMonth;
                car.PlateType = entity.PlateType;
                car.PlateNumber = entity.PlateNumber;
                car.TransmissionType = entity.TransmissionType;
                car.HasInsurance = entity.HasInsurance;
                car.InsuranceExpireDate = entity.InsuranceEndDate;
                car.ForSale = entity.ForSale;
                car.TransportConfirm = entity.TransportConfirm;
                car.TransportDate = entity.TransportDate;
                car.TransportDateReceived = entity.TransportDateReceived;
                car.TransportFrom = entity.TransportFrom;
                car.TransportTo = entity.TransportTo;
                car.NeedsPoliceCertificate = entity.NeedsPoliceCertificate;
                car.PoliceCertificateRequestedDate = entity.PoliceCertificateRequestedDate;
                car.PoliceCertificateReceivedDate = entity.PoliceCertificateReceivedDate;
                car.DeedRequestedDate = entity.DeedRequestedDate;
                car.DeedIssuedDate = entity.DeedIssuedDate;
                car.PlateNumber = entity.PlateNumber;
                car.PlateRegisteredDate = entity.PlateRegisteredDate;
                car.SukuraNumber = car.SukuraNumber == null ? entity.SukuraNumber : null;
                car.SentToMunicipality = entity.SentToMunicipality;
                car.MunicipalitySentDate = entity.MunicipalitySentDate;
                car.MunicipalitySentToPerson = entity.MunicipalitySentToPerson;
                car.MunicipalitySentByUserId = entity.MunicipalitySentByUserId;
                car.SentToAction = entity.SentToAuction;
                car.ActionSentDate = entity.AuctionSentDate;
                car.ActionSentToPerson = entity.AuctionSentToPerson;
                car.ActionSentByUserId = entity.AuctionSentByUserId;
                car.PlateRevoked = entity.PlateRevoked;
                car.PlateRevokedDate = entity.PlateRevokedDate;
                car.PlateRevokedByUserId = entity.PlateRevokedByUserId;
                car.Grad = entity.Grad;
                car.Point = entity.Point;
                car.TransportConfirmUserId = entity.TransportConfirmUserId != 0 ? entity.TransportConfirmUserId : null;
                car.PoliceCertificateNumber = entity.PoliceCertificateNumber;
                car.ActionNumber = entity.ActionNumber;
                car.Katashaki = entity.Katashaki;
                car.ActionDeadlineDate = entity.ActionDeadlineDate;
                car.MunicipalityDeadlineDate = entity.MunicipalityDeadlineDate;
                car.PlateRevokedDeadLine = entity.PlateRevokedDeadLine;
                car.HasShakend = entity.HasShakend;
                car.ThirdPartyInsuranceNumber = entity.ThirdPartyInsuranceNumber;
                car.DeedNumber = entity.DeedNumber;
                car.CommandType = entity.CommandType;
                car.TransportCompanyRequestDate = entity.TransportCompanyRequestDate;
                car.NewPlateNumber = entity.NewPlateNumber;
                car.Description = entity.Description;
                car.InsuranceCancellationDate = entity.InsuranceCancellationDate;
                car.IsInsuranceCancelled = entity.IsInsuranceCancelled;
                car.IsUnder1000CcdeedCopyUploaded = entity.IsUnder1000CcdeedCopyUploaded;
                car.PoliceDeedCertificateDeliveryDate = entity.PoliceDeedCertificateDeliveryDate;
                car.NewDeedCopySentToBuyerDate = entity.NewDeedCopySentToBuyerDate;
                car.ThirdPartyInsuranceExpireDate = entity.ThirdPartyInsuranceExpireDate;
                car.ThirdPartyInsuranceCompany = entity.ThirdPartyInsuranceCompany;

                _context.CarAuctionDetails.RemoveRange(car.CarAuctionDetails);
                _context.CarImages.RemoveRange(car.CarImages);

                if (car.CarAuctionDetails.Any())
                {
                    car.CarAuctionDetails.Add(new CarAuctionDetail
                    {
                        PurchasePrice = entity.PurchasePrice,
                        TaxAmount = entity.TaxAmount,
                        FinalPrice = entity.FinalPrice,
                        TransportPrice = entity.TransportPrice,
                        AuctionPrice = entity.AuctionPrice,
                        ScrapCost = entity.ScrapCost,
                        PurchaseDate = entity.PurchaseDate
                    });
                }

                if (entity.BuyerId != null && entity.SaleDate != null)
                {
                    car.CarSales.Add(new CarSale
                    {
                        BuyerId = entity.BuyerId.Value,
                        SaleDate = entity.SaleDate.Value,
                        SalePrice = entity.SalePrice,
                        IsActive = true,
                        CreatedDate = DateTime.Now,
                        CreatedBy = entity.CreatedBy!.Value
                    });
                }

                await _context.SaveChangesAsync();

                _context.CarImages.RemoveRange(car.CarImages);
                await _context.SaveChangesAsync();

                for (int i = 0; i < entity.Images.Length; i++)
                {
                    var imageUrl = entity.Images[i];
                    var fileType = entity.ImagesWithTypes[i]?.FileType ?? "";

                    var carImageType = new CarImageType();
                    carImageType.CarImageTypeTranslations.Add(new CarImageTypeTranslation
                    {
                        Title = fileType,
                        LanguageId = 1
                    });

                    var carImage = new CarImage
                    {
                        CarId = car.CarId,
                        ImageUrl = imageUrl,
                        ImageType = carImageType
                    };

                    _context.CarImages.Add(carImage);
                }

                await _context.SaveChangesAsync();
            }

            return car?.SukuraNumber ?? null;
        }


        public async Task<bool> ExistsCar(int carId)
        {
            var isExists = await _context.Cars
                .Where(x => x.CarId == carId)
                .AnyAsync();

            return isExists;
        }


        public async Task<int> GetSukuraNumber()
        {
            var lastSukuraNumber = await _context.Cars
                .Where(x => x.ForSale == 1)
                .OrderByDescending(c => c.SukuraNumber)
                .Select(c => c.SukuraNumber)
                .FirstOrDefaultAsync();

            return (lastSukuraNumber ?? 0) + 1;
        }

    }
}
