using ClosedXML.Excel;
using Common.Exceptions;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Vml.Office;
using JapanCar.Application.DTOs;
using JapanCar.Application.Helpers;
using JapanCar.Application.Interfaces;
using JapanCar.Application.Models;
using JapanCar.Common;
using JapanCar.Common.Models;
using JapanCar.Domain.Entities;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
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


        public async Task<GridDto<CarDto>> GetCars(CarFilterDto filterDto)
        {
            var languageId = await GetLanguageId(_requestContext.Locale);

            var entities = await _unitOfWork.CarRepository.GetCars(languageId, filterDto);

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
                Images = x.Images,
                SukuraNumber = x.SukuraNumber,
                PurchaseDate = x.PurchaseDate.ToString("yyyy/MM/dd"),
                ChasisNumber = x.ChassisNumber,
                ForSale = x.ForSale,
                Katashaki = x.Katashaki,
            });

            var totalPage = filterDto.Take.HasValue ? PagingHelper.GetTotalPages(entities.TotalCount, filterDto.Take.Value) : 0;

            return new GridDto<CarDto>
            {
                Items = cars,
                TotalPage = totalPage,
                TotalCount = entities.TotalCount
            };
        }


        public async Task<int?> CreateCar(CarDto dto, List<FileData> images, string userName)
        {
            var languageId = await GetLanguageId(_requestContext.Locale);

            var savedNames = await _fileStorage.SaveFilesAsync(images, Constants.CARS_IMAGES_FOLDER);

            int? sukuraNumber = null;
            if (dto.ForSale == 1)
                sukuraNumber = await _unitOfWork.CarRepository.GetSukuraNumber();

            var currentUser = await _unitOfWork.UserRepository.GetUserByUserName(userName);
            if (currentUser == null)
                throw new AppException("User not found", System.Net.HttpStatusCode.NotFound);

            var carId = await _unitOfWork.CarRepository.Create(languageId, new CarEntity
            {
                AuctionId = dto.AuctionId,
                ChassisNumber = dto.ChasisNumber.ToUpper(),
                ColorId = dto.ColorId,
                EngineVolume = dto.EngineVolume,
                FinalPrice = dto.FinalPrice,
                FuelType = dto.FuelType,
                Images = savedNames.ToArray(),
                ImagesWithTypes = images,
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
                PlateRevokedByUserId = dto.PlateRevoked ? currentUser.UserId : null,
                Grad = dto.Grad,
                Point = dto.Point,
                TransportConfirmUserId = dto.TransportConfirmUserId != 0 ? dto.TransportConfirmUserId : null,
                PoliceCertificateNumber = dto.PoliceCertificateNumber,
                ActionNumber = dto.ActionNumber,
                Katashaki = dto.Katashaki?.ToUpper(),
                ActionDeadlineDate = dto.ActionDeadlineDate.ToDateOnly(),
                MunicipalityDeadlineDate = dto.MunicipalityDeadlineDate.ToDateOnly(),
                PlateRevokedDeadLine = dto.PlateRevokedDeadLine.ToDateOnly(),
                HasShakend = dto.HasShakend,
                ThirdPartyInsuranceNumber = dto.ThirdPartyInsuranceNumber,
                DeedNumber = dto.DeedNumber,
                CommandType = dto.CommandType,
                TransportCompanyRequestDate = dto.TransportCompanyRequestDate.ToDateTime(),
                NewPlateNumber = dto.NewPlateNumber,
                Description = dto.Description?.ToUpper(),
                InsuranceCancellationDate = dto.InsuranceCancellationDate.ToDateTime(),
                IsInsuranceCancelled = dto.IsInsuranceCancelled,
                IsUnder1000CcdeedCopyUploaded = dto.IsUnder1000CcdeedCopyUploaded,
                PoliceDeedCertificateDeliveryDate = dto.PoliceDeedCertificateDeliveryDate.ToDateTime(),
                NewDeedCopySentToBuyerDate = dto.NewDeedCopySentToBuyerDate.ToDateTime(),
                ThirdPartyInsuranceExpireDate = dto.ThirdPartyInsuranceExpireDate.ToDateTime(),
                ThirdPartyInsuranceCompany = dto.ThirdPartyInsuranceCompany,
            });

            return carId;
        }


        public async Task<TabState> UpdateCar(int id, CarDto dto, List<FileData> images, string userName)
        {
            var carWithImages = await _unitOfWork.CarRepository.GetById(id, false, true);

            if (carWithImages != null)
                _fileStorage.DeleteFiles(carWithImages.Images);

            var savedNames = await _fileStorage.SaveFilesAsync(images, Constants.CARS_IMAGES_FOLDER);

            var currentUser = await _unitOfWork.UserRepository.GetUserByUserName(userName);
            if (currentUser == null)
                throw new AppException("User not found", System.Net.HttpStatusCode.NotFound);

            int? sukuraNumber = null;
            if (dto.ForSale == 1)
                sukuraNumber = await _unitOfWork.CarRepository.GetSukuraNumber();

            var carEntity = new CarEntity
            {
                AuctionId = dto.AuctionId,
                ChassisNumber = dto.ChasisNumber.ToUpper(),
                ColorId = dto.ColorId,
                EngineVolume = dto.EngineVolume,
                FinalPrice = dto.FinalPrice,
                FuelType = dto.FuelType,
                Images = savedNames.ToArray(),
                ImagesWithTypes = images,
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
                PlateRevokedByUserId = dto.PlateRevoked ? currentUser.UserId : null,
                Grad = dto.Grad,
                Point = dto.Point,
                TransportConfirmUserId = dto.TransportConfirmUserId != 0 ? dto.TransportConfirmUserId : null,
                PoliceCertificateNumber = dto.PoliceCertificateNumber,
                ActionNumber = dto.ActionNumber,
                Katashaki = dto.Katashaki?.ToUpper(),
                ActionDeadlineDate = dto.ActionDeadlineDate.ToDateOnly(),
                MunicipalityDeadlineDate = dto.MunicipalityDeadlineDate.ToDateOnly(),
                PlateRevokedDeadLine = dto.PlateRevokedDeadLine.ToDateOnly(),
                HasShakend = dto.HasShakend,
                ThirdPartyInsuranceNumber = dto.ThirdPartyInsuranceNumber,
                DeedNumber = dto.DeedNumber,
                CommandType = dto.CommandType,
                TransportCompanyRequestDate = dto.TransportCompanyRequestDate.ToDateTime(),
                NewPlateNumber = dto.NewPlateNumber,
                Description = dto.Description?.ToUpper(),
                InsuranceCancellationDate = dto.InsuranceCancellationDate.ToDateTime(),
                IsInsuranceCancelled = dto.IsInsuranceCancelled,
                IsUnder1000CcdeedCopyUploaded = dto.IsUnder1000CcdeedCopyUploaded,
                PoliceDeedCertificateDeliveryDate = dto.PoliceDeedCertificateDeliveryDate.ToDateTime(),
                NewDeedCopySentToBuyerDate = dto.NewDeedCopySentToBuyerDate.ToDateTime(),
                BuyerId = dto.BuyerId,
                SaleDate = dto.SaleDate.ToDateOnly(),
                SalePrice = dto.SalePrice,
                CreatedBy = currentUser.UserId,
                ThirdPartyInsuranceExpireDate = dto.ThirdPartyInsuranceExpireDate.ToDateTime(),
                ThirdPartyInsuranceCompany = dto.ThirdPartyInsuranceCompany,
            };
            var updatedSukuraNumber = await _unitOfWork.CarRepository.Update(id, carEntity);

            var tabStats = GetTabsState(dto);

            return tabStats;
        }


        public async Task DeleteCar(int id)
        {
            var car = await _unitOfWork.CarRepository.GetById(id, false, true);
            if (car == null)
                throw new AppException("Not found", System.Net.HttpStatusCode.NotFound);

            if (car.Images.Any())
                _fileStorage.DeleteFiles(car.Images);

            await _unitOfWork.CarRepository.Delete(id);
        }


        public async Task<CarDto?> GetCarById(int id)
        {
            var car = await _unitOfWork.CarRepository.GetById(id, true, true);

            if (car == null)
                return null;

            var carDto = new CarDto
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
                Images = car.Images,
                ImagesWithTypes = car.ImagesWithTypes,
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
                Grad = car.Grad,
                Point = car.Point,
                TransportConfirmUserId = car.TransportConfirmUserId,
                PoliceCertificateNumber = car.PoliceCertificateNumber,
                ActionNumber = car.ActionNumber,
                Katashaki = car.Katashaki,
                ActionDeadlineDate = car.ActionDeadlineDate.ToString(),
                MunicipalityDeadlineDate = car.MunicipalityDeadlineDate.ToString(),
                PlateRevokedDeadLine = car.PlateRevokedDeadLine.ToString(),
                HasShakend = car.HasShakend,
                ThirdPartyInsuranceNumber = car.ThirdPartyInsuranceNumber,
                DeedNumber = car.DeedNumber,
                CommandType = car.CommandType,
                TransportCompanyRequestDate = car.TransportCompanyRequestDate.ToString(),
                NewPlateNumber = car.NewPlateNumber,
                Description = car.Description,
                InsuranceCancellationDate = car.InsuranceCancellationDate.ToString(),
                IsInsuranceCancelled = car.IsInsuranceCancelled,
                IsUnder1000CcdeedCopyUploaded = car.IsUnder1000CcdeedCopyUploaded,
                PoliceDeedCertificateDeliveryDate = car.PoliceDeedCertificateDeliveryDate.ToString(),
                NewDeedCopySentToBuyerDate = car.NewDeedCopySentToBuyerDate.ToString(),
                BuyerId = car.BuyerId,
                SaleDate = car.SaleDate.ToString(),
                SalePrice = car.SalePrice,
                ThirdPartyInsuranceExpireDate = car.ThirdPartyInsuranceExpireDate.ToString(),
                ThirdPartyInsuranceCompany = car.ThirdPartyInsuranceCompany,
            };

            return carDto;
        }


        public async Task<TabState?> GetTabsState(int id)
        {
            var carDto = await GetCarById(id);

            if (carDto == null)
                return null;

            var tabStates = GetTabsState(carDto);

            return tabStates;
        }


        public async Task<byte[]> GetReportExcel(CarFilterDto filterDto)
        {
            var languageId = await GetLanguageId(_requestContext.Locale);

            filterDto.Skip = null;
            filterDto.Take = null;

            var carsItems = await GetCars(filterDto);

            var cars = carsItems.Items.ToList();

            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Report");

            var translations = await _unitOfWork.TranslationRepository.GetAllTranslations(languageId);
            var dic = translations
                .GroupBy(x => x.FieldName)
                .ToDictionary(g => g.Key, g => g.First().TranslatedValue);

            worksheet.Cell(1, 1).Value = dic["BrandName"];
            worksheet.Cell(1, 2).Value = dic["ModelName"];
            worksheet.Cell(1, 3).Value = dic["ColorName"];
            worksheet.Cell(1, 4).Value = dic["Year"];
            worksheet.Cell(1, 5).Value = dic["PurchaseDate"];
            worksheet.Cell(1, 6).Value = dic["PurchasePrice"];
            worksheet.Cell(1, 7).Value = dic["SukuraNumber"];

            for (int i = 0; i < cars.Count(); i++)
            {
                worksheet.Cell(i + 2, 1).Value = cars[i].BrandName;
                worksheet.Cell(i + 2, 2).Value = cars[i].ModelName;
                worksheet.Cell(i + 2, 3).Value = cars[i].ColorName;
                worksheet.Cell(i + 2, 4).Value = cars[i].Year;
                worksheet.Cell(i + 2, 5).Value = cars[i].PurchaseDate;
                worksheet.Cell(i + 2, 6).Value = cars[i].PurchasePrice;
                worksheet.Cell(i + 2, 7).Value = cars[i].SukuraNumber;
            }

            worksheet.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);

            return stream.ToArray();
        }


        public async Task<byte[]> GetReportPdf(CarFilterDto filterDto)
        {
            var languageId = await GetLanguageId(_requestContext.Locale);

            filterDto.Skip = null;
            filterDto.Take = null;

            var carsItems = await GetCars(filterDto);

            var cars = carsItems.Items.ToList();

            var translations = await _unitOfWork.TranslationRepository.GetAllTranslations(languageId);
            var dic = translations
                .GroupBy(x => x.FieldName)
                .ToDictionary(g => g.Key, g => g.First().TranslatedValue);

            var pdfStream = new MemoryStream();
            QuestPDF.Settings.License = LicenseType.Community;
            Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4.Landscape());
                    page.Margin(10, Unit.Millimetre);
                    page.Content().Column(column =>
                    {
                        column.Item().Table(table =>
                        {
                            static IContainer CellStyle(IContainer container) => container.Border(1).Padding(10);

                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                            });

                            table.Header(header =>
                            {
                                header.Cell().Element(CellStyle).Text(dic["BrandName"]);
                                header.Cell().Element(CellStyle).Text(dic["ModelName"]);
                                header.Cell().Element(CellStyle).Text(dic["ColorName"]);
                                header.Cell().Element(CellStyle).Text(dic["Year"]);
                                header.Cell().Element(CellStyle).Text(dic["PurchaseDate"]);
                                header.Cell().Element(CellStyle).Text(dic["PurchasePrice"]);
                                header.Cell().Element(CellStyle).Text(dic["SukuraNumber"]);
                            });

                            for (int i = 0; i < cars.Count(); i++)
                            {
                                table.Cell().Element(CellStyle).Text(cars[i].BrandName);
                                table.Cell().Element(CellStyle).Text(cars[i].ModelName);
                                table.Cell().Element(CellStyle).Text(cars[i].ColorName);
                                table.Cell().Element(CellStyle).Text(cars[i].Year.ToString());
                                table.Cell().Element(CellStyle).Text(cars[i].PurchaseDate);
                                table.Cell().Element(CellStyle).Text(cars[i].PurchasePrice.ToString());
                                table.Cell().Element(CellStyle).Text(cars[i].SukuraNumber?.ToString() ?? "");
                            }
                        });
                    });
                });
            }).GeneratePdf(pdfStream);

            pdfStream.Position = 0;

            return pdfStream.ToArray();
        }


        private TabState GetTabsState(CarDto dto)
        {
            return new TabState
            {
                General = "enabled",
                Shakend = IsGeneralTabCompleted(dto) ? "enabled" : "disabled",
                Insurance = IsShakendTabCompleted(dto) ? "enabled" : "disabled",
                Police = dto.ForSale != 1 && dto.EngineVolume < 1000 && (!dto.HasInsurance || string.IsNullOrEmpty(dto.InsuranceEndDate)) ? "hidden" : IsShakendTabCompleted(dto) && IsInsuranceTabCompleted(dto) && dto.EngineVolume >= 1000 ? "enabled" : "disabled",
                Deed = IsShakendTabCompleted(dto) && IsInsuranceTabCompleted(dto) ? "enabled" : "disabled",
                Transport = IsGeneralTabCompleted(dto) ? "enabled" : "disabled",
                SentMunicipality = string.IsNullOrEmpty(dto.PlateRegisteredDate) || dto.EngineVolume >= 1000 ? "hidden" : "enabled",
                SentAction = string.IsNullOrEmpty(dto.PlateRegisteredDate) || string.IsNullOrEmpty(dto.DeedNumber) ? "hidden" : "enabled",
                Sale = "enabled",
            };
        }


        private bool IsGeneralTabCompleted(CarDto dto)
        {
            var result =
                !string.IsNullOrEmpty(dto.PurchaseDate) &&
                dto.ModelId > 0 &&
                dto.EngineVolume != null &&
                dto.ForSale > 0 &&
                !string.IsNullOrEmpty(dto.Katashaki) &&
                !string.IsNullOrEmpty(dto.ChasisNumber) &&
                dto.Mileage >= 0 &&
                dto.ColorId > 0 &&
                dto.Year > 0 &&
                dto.ManufactureMonth > 0;

            return result;
        }


        private bool IsShakendTabCompleted(CarDto dto)
        {
            var result = dto.HasInsurance && !string.IsNullOrEmpty(dto.InsuranceEndDate);
            return result;
        }


        private bool IsInsuranceTabCompleted(CarDto dto)
        {
            var result = dto.HasShakend;
            return result;
        }


        private bool IsDeedTabCompleted(CarDto dto)
        {
            var result = !string.IsNullOrEmpty(dto.PlateRegisteredDate) &&
                !string.IsNullOrEmpty(dto.DeedNumber) &&
                (dto.EngineVolume >= 1000 || (dto.EngineVolume < 1000 && dto.IsUnder1000CcdeedCopyUploaded));
            return result;
        }
    }
}
