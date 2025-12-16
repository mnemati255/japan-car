using JapanCar.Application.DTOs;
using JapanCar.Application.Models;
using JapanCar.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.Interfaces
{
    public interface IRepairRepository
    {
        Task<PagedResult<RepairEntity>> GetRepairsOfCar(int carId, RepairFilterDto filterDto);
        Task<int> CreateRepair(int languageId, RepairEntity entity);
        Task<bool> UpdateRepair(int languageId, int repairId, RepairEntity entity);
        Task<bool> DeleteRepair(int repairId);
        Task<RepairEntity?> GetRepairById(int languageId, int id);
    }
}
