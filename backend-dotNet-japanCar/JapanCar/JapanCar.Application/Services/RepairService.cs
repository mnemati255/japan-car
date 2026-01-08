using JapanCar.Application.DTOs;
using JapanCar.Application.Helpers;
using JapanCar.Application.Interfaces;
using JapanCar.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.Services
{
    public class RepairService : BaseService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRequestContext _requestContext;


        public RepairService(IUnitOfWork unitOfWork, LanguageService languageService, IRequestContext requestContext) : base(languageService)
        {
            _unitOfWork = unitOfWork;
            _requestContext = requestContext;
        }


        public async Task<GridDto<RepairDto>> GetRepairsOfCar(int carId, RepairFilterDto filterDto)
        {
            var entities = await _unitOfWork.RepairRepository.GetRepairsOfCar(carId, filterDto);

            var repairs = entities.Items.Select(x => new RepairDto
            {
                RepairId = x.RepairId,
                CarId = x.CarId,
                CreatedAt = x.CreatedDate,
                DashboardReplacerName = x.DashboardReplacerName,
                MechanicName = x.MechanicName,
                SteeringReplacerName = x.SteeringReplacerName,
                RepairDate = x.RepairDate.ToString()
            });

            var totalPage = filterDto.Take.HasValue ? PagingHelper.GetTotalPages(entities.TotalCount, filterDto.Take.Value) : 0;

            return new GridDto<RepairDto>
            {
                Items = repairs,
                TotalPage = totalPage
            };
        }


        public async Task CreateRepair(RepairDto dto)
        {
            var languageId = await GetLanguageId(_requestContext.Locale);

            var repairEntity = new RepairEntity
            {
                CarId = dto.CarId,
                DashboardReplacerId = dto.DashboardReplacerId,
                MechanicId = dto.MechanicId,
                MechanicTechnicalNote = dto.MechanicTechnicalNote,
                RepairDate = DateOnly.Parse(dto.RepairDate.Split("T")[0]),
                SteeringReplacerId = dto.SteeringReplacerId,
                MechanicWorkHours = dto.MechanicWorkHours,
                MechanicLaborCost = dto.MechanicLaborCost
            };

            await _unitOfWork.ExecuteInTransactionAsync(async () =>
            {
                var repairId = await _unitOfWork.RepairRepository.CreateRepair(languageId, repairEntity);

                foreach (var item in dto.Parts)
                {
                    var carPartEntity = new CarPartEntity
                    {
                        CarRepairHistoryId = repairId,
                        MechanicId = item.MechanicId,
                        PartCost = item.PartCost,
                        PartCount = item.PartCount,
                        PartId = item.PartId,
                    };

                    await _unitOfWork.CarPartRepository.CreateCarPart(carPartEntity);
                }
            });

        }


        public async Task UpdateRepair(string locale, int repairId, RepairDto dto)
        {
            var languageId = await GetLanguageId(locale);

            var repairEntity = new RepairEntity
            {
                CarId = dto.CarId,
                DashboardReplacerId = dto.DashboardReplacerId,
                MechanicId = dto.MechanicId,
                MechanicTechnicalNote = dto.MechanicTechnicalNote,
                RepairDate = DateOnly.Parse(dto.RepairDate.Split("T")[0]),
                SteeringReplacerId = dto.SteeringReplacerId,
                MechanicWorkHours = dto.MechanicWorkHours,
                MechanicLaborCost = dto.MechanicLaborCost
            };

            await _unitOfWork.ExecuteInTransactionAsync(async () =>
            {
                await _unitOfWork.CarPartRepository.DeleteCarPartsOfRepair(repairId);

                await _unitOfWork.RepairRepository.UpdateRepair(languageId, repairId, repairEntity);

                foreach (var item in dto.Parts)
                {
                    var carPartEntity = new CarPartEntity
                    {
                        CarRepairHistoryId = repairId,
                        MechanicId = item.MechanicId,
                        PartCost = item.PartCost,
                        PartCount = item.PartCount,
                        PartId = item.PartId,
                    };

                    await _unitOfWork.CarPartRepository.CreateCarPart(carPartEntity);
                }
            });

        }


        public async Task DeleteRepair(int repairId)
        {
            await _unitOfWork.ExecuteInTransactionAsync(async () =>
            {

                var carParts = await _unitOfWork.CarPartRepository.GetPartsOfRepair(repairId);

                await _unitOfWork.CarPartRepository.DeleteCarPartsOfRepair(repairId);

                await _unitOfWork.RepairRepository.DeleteRepair(repairId);
            });
        }


        public async Task<RepairDto?> GetRepairById(int repairId, string locale)
        {
            var languageId = await GetLanguageId(locale);

            var repair = await _unitOfWork.RepairRepository.GetRepairById(languageId, repairId);

            if (repair == null)
                return null;

            var carParts = await _unitOfWork.CarPartRepository.GetPartsOfRepair(repairId);

            var result = new RepairDto
            {
                RepairId = repairId,
                CarId = repair.CarId,
                DashboardReplacerId = repair.DashboardReplacerId,
                MechanicId = repair.MechanicId,
                SteeringReplacerId = repair.SteeringReplacerId,
                RepairDate = repair.RepairDate.ToString(),
                MechanicTechnicalNote = repair.MechanicTechnicalNote,
                MechanicWorkHours = repair.MechanicWorkHours,
                MechanicLaborCost = repair.MechanicLaborCost,
                Parts = carParts.Select(x => new RepairedPartDto
                {
                    CarPartId = x.CarPartId,
                    MechanicId = x.MechanicId,
                    PartCost = x.PartCost,
                    PartCount = x.PartCount,
                    PartId = x.PartId
                }).ToList()
            };

            return result;
        }


        public async Task<List<RepairDto>> GetRepairDetailsOfCar(int carId)
        {
            var languageId = await GetLanguageId(_requestContext.Locale);

            var result = await _unitOfWork.RepairRepository.GetRepairDetailsOfCar(languageId, carId);

            return result.Select(x => new RepairDto
            {
                RepairDate = x.RepairDate.ToString(),
                Parts = x.Parts.Select(y => new RepairedPartDto
                {
                    PartCost = y.PartCost,
                    PartCount = y.PartCount,
                    PartName = y.PartName,
                    MechanicName = y.MechanicName,
                }).ToList()
            }).ToList();
        }
    }
}
