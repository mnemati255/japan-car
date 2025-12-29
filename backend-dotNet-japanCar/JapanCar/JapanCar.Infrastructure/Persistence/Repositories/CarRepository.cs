using JapanCar.Application.DTOs;
using JapanCar.Application.Helpers;
using JapanCar.Application.Interfaces;
using JapanCar.Application.Models;
using JapanCar.Domain.Entities;
using JapanCar.Infrastructure.Persistence.Models;
using Microsoft.EntityFrameworkCore;

namespace JapanCar.Infrastructure.Persistence.Repositories
{
    public class CarRepository : ICarRepository
    {
        private readonly AppDbContext _context;

        public CarRepository(AppDbContext context)
        {
            _context = context;
        }


        public async Task<int?> Create(CarEntity car)
        {
            var newCar = new Car
            {
                ModelId = car.ModelId,
                ColorId = car.ColorId,
                ActionId = car.AuctionId,
                Year = car.Year,
                ChassisNumber = car.ChassisNumber,
                EngineVolume = car.EngineVolume,
                FuelType = car.FuelType,
                Mileage = car.Mileage,
                ManufactureMonth = car.ManufactureMonth,
                PlateType = car.PlateType,
                TransmissionType = car.TransmissionType,
                HasInsurance = car.HasInsurance,
                InsuranceExpireDate = car.InsuranceEndDate,
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
                PlateNumber = car.PlateNumber,
                PlateRegisteredDate = car.PlateRegisteredDate,
                SukuraNumber = car.SukuraNumber,
                SentToMunicipality = car.SentToMunicipality,
                MunicipalitySentDate = car.MunicipalitySentDate,
                MunicipalitySentToPerson = car.MunicipalitySentToPerson,
                MunicipalitySentByUserId = car.MunicipalitySentByUserId,
                SentToAction = car.SentToAuction,
                ActionSentDate = car.AuctionSentDate,
                ActionSentToPerson = car.AuctionSentToPerson,
                ActionSentByUserId = car.AuctionSentByUserId,
                PlateRevoked = car.PlateRevoked,
                PlateRevokedDate = car.PlateRevokedDate,
                PlateRevokedByUserId = car.PlateRevokedByUserId,
                Grad = car.Grad,
                Point = car.Point,
                TransportConfirmUserId = car.TransportConfirmUserId != 0 ? car.TransportConfirmUserId : null,
                PoliceCertificateNumber = car.PoliceCertificateNumber,
                ActionNumber = car.ActionNumber,
                Katashaki = car.Katashaki,
                ActionDeadlineDate = car.ActionDeadlineDate,
                MunicipalityDeadlineDate = car.MunicipalityDeadlineDate,
                PlateRevokedDeadLine = car.PlateRevokedDeadLine,
            };

            foreach (var item in car.ImageUrls)
            {
                newCar.CarImages.Add(new CarImage
                {
                    ImageUrl = item
                });
            }

            newCar.CarAuctionDetails.Add(new CarAuctionDetail
            {
                PurchasePrice = car.PurchasePrice,
                TaxAmount = car.TaxAmount,
                FinalPrice = car.FinalPrice,
                TransportPrice = car.TransportPrice,
                AuctionPrice = car.AuctionPrice,
                ScrapCost = car.ScrapCost,
                PurchaseDate = car.PurchaseDate
            });

            _context.Cars.Add(newCar);

            await _context.SaveChangesAsync();

            return car.SukuraNumber;
        }


        public async Task<bool> Delete(int id)
        {
            var car = await _context.Cars
                .Include(x => x.CarAuctionDetails)
                .Include(x => x.CarImages)
                .Include(x => x.SystemNotifications)
                .FirstOrDefaultAsync(x => x.CarId == id);

            if (car == null)
                return false;

            _context.CarAuctionDetails.RemoveRange(car.CarAuctionDetails);

            _context.CarImages.RemoveRange(car.CarImages);

            _context.SystemNotifications.RemoveRange(car.SystemNotifications);

            _context.Cars.Remove(car);

            await _context.SaveChangesAsync();

            return true;
        }


        public async Task<PagedResult<CarEntity>> GetCars(int languageId, CarFilterDto filterDto, int? auctionId = null)
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
                    ImageUrls = x.imgs.Select(i => i.ImageUrl).ToArray(),
                    SukuraNumber = x.car.SukuraNumber,
                    PurchaseDate = x.cad.PurchaseDate,
                    Katashaki = x.car.Katashaki,
                    ChassisNumber = x.car.ChassisNumber,
                    ForSale = x.car.ForSale
                })
                .OrderByDescending(x => x.CreatedDate).ToListAsync();


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
                ImageUrls = car.CarImages.Any() ? car.CarImages.Select(x => x.ImageUrl).ToArray() : [],
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

                _context.CarAuctionDetails.RemoveRange(car.CarAuctionDetails);
                _context.CarImages.RemoveRange(car.CarImages);

                foreach (var item in entity.ImageUrls)
                {
                    car.CarImages.Add(new CarImage
                    {
                        ImageUrl = item
                    });
                }

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
