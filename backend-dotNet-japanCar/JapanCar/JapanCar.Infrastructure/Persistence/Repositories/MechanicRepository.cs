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
    public class MechanicRepository : IMechanicRepository
    {
        private readonly AppDbContext _context;


        public MechanicRepository(AppDbContext context)
        {
            _context = context;
        }


        public async Task CreateMechanic(MechanicEntity entity)
        {
            var mechanic = new Mechanic
            {
                MechanicName = entity.MechanicName,
                Contact = entity.Contact,
            };

            _context.Mechanics.Add(mechanic);

            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteMechanic(int id)
        {
            var entity = await _context.Mechanics.FirstOrDefaultAsync(x => x.MechanicId == id);

            if (entity == null)
                return false;

            _context.Mechanics.Remove(entity);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<MechanicEntity?> GetMechanicById(int id)
        {
            var entity = await _context.Mechanics.FirstOrDefaultAsync(x => x.MechanicId == id);
            if (entity == null)
                return null;

            return new MechanicEntity
            {
                MechanicId = entity.MechanicId,
                CreatedDate = entity.CreatedDate,
                MechanicName = entity.MechanicName,
                Contact = entity.Contact,
            };
        }

        public async Task<PagedResult<MechanicEntity>> GetMechanics(string? keyword, int? skip = null, int? take = null)
        {
            var mechanics = _context.Mechanics.AsNoTracking();

            if (!string.IsNullOrEmpty(keyword))
                mechanics = mechanics.Where(x => x.MechanicName.Contains(keyword));

            var totalCount = await mechanics.CountAsync();

            if (skip.HasValue)
                mechanics = mechanics.Skip(skip.Value);

            if (take.HasValue)
                mechanics = mechanics.Take(take.Value);

            var items = await mechanics.Select(x => new MechanicEntity
            {
                Contact = x.Contact,
                CreatedDate = x.CreatedDate,
                MechanicId = x.MechanicId,
                MechanicName = x.MechanicName,
            }).OrderByDescending(x => x.CreatedDate).ToListAsync();

            return new PagedResult<MechanicEntity>
            {
                Items = items,
                TotalCount = totalCount
            };
        }

        public async Task UpdateMechanic(int id, MechanicEntity entity)
        {
            var item = await _context.Mechanics.FirstOrDefaultAsync(x => x.MechanicId == id);
            if (item != null)
            {
                item.Contact = entity.Contact;
                item.MechanicName = entity.MechanicName;
                item.ModifiedDate = DateTime.Now;

                await _context.SaveChangesAsync();
            }
        }
    }
}
