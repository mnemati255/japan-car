using JapanCar.Application.Interfaces;
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
    public class CarPartRepository : ICarPartRepository
    {
        private readonly AppDbContext _context;


        public CarPartRepository(AppDbContext context)
        {
            _context = context;
        }


        public async Task<IEnumerable<CarPartEntity>> GetPartsOfRepair(int repairId)
        {
            var carParts = await _context.CarParts
                .Where(x => x.CarRepairHistoryId == repairId)
                .ToListAsync();

            return carParts.Select(x => new CarPartEntity
            {
                CarRepairHistoryId = x.CarRepairHistoryId,
                CarPartId = x.CarPartId,
                MechanicId = x.MechanicId,
                PartCost = x.PartCost,
                PartCount = x.PartCount,
                PartId = x.PartId
            });
        }


        public async Task CreateCarPart(CarPartEntity carPartEntity)
        {
            var newCarPart = new CarPart
            {
                CarRepairHistoryId = carPartEntity.CarRepairHistoryId,
                MechanicId = carPartEntity.MechanicId,
                PartCost = carPartEntity.PartCost,
                PartCount = carPartEntity.PartCount,
                PartId = carPartEntity.PartId,
            };

            _context.CarParts.Add(newCarPart);

            await _context.SaveChangesAsync();
        }


        public async Task<bool> DeleteCarPart(int id)
        {
            var carPart = await _context.CarParts.FirstOrDefaultAsync(x => x.CarPartId == id);

            if (carPart == null)
                return false;

            _context.CarParts.Remove(carPart);

            await _context.SaveChangesAsync();

            return true;
        }


        public async Task DeleteCarPartRange(int[] ids)
        {
            var carParts = await _context.CarParts
                .Where(x => ids.Contains(x.CarPartId))
                .ToListAsync();

            if (carParts.Any())
            {
                _context.CarParts.RemoveRange(carParts);
                await _context.SaveChangesAsync();
            }
        }
    }
}
