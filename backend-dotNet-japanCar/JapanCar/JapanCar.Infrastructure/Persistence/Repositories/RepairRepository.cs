using JapanCar.Application.DTOs;
using JapanCar.Application.Interfaces;
using JapanCar.Application.Models;
using JapanCar.Domain.Entities;
using JapanCar.Infrastructure.Persistence.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Infrastructure.Persistence.Repositories
{
    public class RepairRepository : IRepairRepository
    {
        private readonly AppDbContext _context;


        public RepairRepository(AppDbContext context)
        {
            _context = context;
        }


        public async Task<PagedResult<RepairEntity>> GetRepairsOfCar(int carId, RepairFilterDto filterDto)
        {
            var query = from repair in _context.CarRepairHistories.AsNoTracking()

                        join mechanic in _context.Mechanics.AsNoTracking() on repair.MechanicId equals mechanic.MechanicId into mG
                        from mechanic in mG.DefaultIfEmpty()

                        join dashboardReplacer in _context.Mechanics.AsNoTracking() on repair.DashboardReplacerId equals dashboardReplacer.MechanicId into dG
                        from dashboardReplacer in dG.DefaultIfEmpty()

                        join steeringReplacer in _context.Mechanics.AsNoTracking() on repair.SteeringReplacerId equals steeringReplacer.MechanicId into sG
                        from steeringReplacer in sG.DefaultIfEmpty()

                        where repair.CarId == carId
                        select new { repair, mechanic, dashboardReplacer, steeringReplacer };

            var totalCount = await query.CountAsync();

            if (filterDto.Skip.HasValue)
                query = query.Skip(filterDto.Skip.Value);

            if (filterDto.Take.HasValue)
                query = query.Take(filterDto.Take.Value);

            var items = await query.Select(x => new RepairEntity
            {
                RepairId = x.repair.RepairId,
                CarId = x.repair.CarId,
                MechanicName = x.mechanic.MechanicName,
                DashboardReplacerName = x.dashboardReplacer.MechanicName,
                SteeringReplacerName = x.steeringReplacer.MechanicName,
                RepairDate = x.repair.RepairDate,
                CreatedDate = x.repair.CreatedDate,
            }).OrderByDescending(x => x.CreatedDate).ToListAsync();

            return new PagedResult<RepairEntity>
            {
                Items = items,
                TotalCount = totalCount
            };

        }


        public async Task<int> CreateRepair(int languageId, RepairEntity entity)
        {
            var newModel = new CarRepairHistory
            {
                CarId = entity.CarId,
                DashboardReplacerId = entity.DashboardReplacerId,
                MechanicId = entity.MechanicId,
                RepairDate = entity.RepairDate,
                SteeringReplacerId = entity.SteeringReplacerId,
            };

            newModel.CarRepairHistoryTranslations.Add(new CarRepairHistoryTranslation
            {
                LanguageId = languageId,
                MechanicTechnicalNote = entity.MechanicTechnicalNote,
            });

            _context.CarRepairHistories.Add(newModel);

            await _context.SaveChangesAsync();

            return newModel.RepairId;
        }


        public async Task<bool> UpdateRepair(int languageId, int repairId, RepairEntity entity)
        {
            var repair = await _context.CarRepairHistories
                .Include(x => x.CarRepairHistoryTranslations.Where(y => y.LanguageId == languageId))
                .FirstOrDefaultAsync(x => x.RepairId == repairId);

            if (repair == null)
                return false;

            repair.DashboardReplacerId = entity.DashboardReplacerId;
            repair.MechanicId = entity.MechanicId;
            repair.RepairDate = entity.RepairDate;
            repair.SteeringReplacerId = entity.SteeringReplacerId;

            var translation = repair.CarRepairHistoryTranslations.FirstOrDefault();

            if (translation != null)
            {
                translation.MechanicTechnicalNote = entity.MechanicTechnicalNote;
            }
            else
            {
                repair.CarRepairHistoryTranslations.Add(new CarRepairHistoryTranslation
                {
                    MechanicTechnicalNote = entity.MechanicTechnicalNote,
                    LanguageId = languageId,
                });
            }

            _context.CarRepairHistories.Update(repair);

            await _context.SaveChangesAsync();

            return true;
        }


        public async Task<bool> DeleteRepair(int repairId)
        {
            var repair = await _context.CarRepairHistories
                .Include(x => x.CarRepairHistoryTranslations)
                .FirstOrDefaultAsync(x => x.RepairId == repairId);

            if (repair == null)
                return false;

            _context.CarRepairHistoryTranslations.RemoveRange(repair.CarRepairHistoryTranslations);
            _context.CarRepairHistories.Remove(repair);

            await _context.SaveChangesAsync();

            return true;
        }


        public async Task<RepairEntity?> GetRepairById(int languageId, int id)
        {
            var repair = await _context
                .CarRepairHistories
                .Include(x => x.CarRepairHistoryTranslations.Where(t => t.LanguageId == languageId))
                .FirstOrDefaultAsync(x => x.RepairId == id);

            if (repair == null)
                return null;

            var translation = repair.CarRepairHistoryTranslations.FirstOrDefault();

            var result = new RepairEntity
            {
                MechanicId = repair.MechanicId,
                DashboardReplacerId = repair.DashboardReplacerId,
                SteeringReplacerId = repair.SteeringReplacerId,
                RepairDate = repair.RepairDate,
            };
            if (translation != null)
                result.MechanicTechnicalNote = translation.MechanicTechnicalNote;

            return result;
        }
    }
}
