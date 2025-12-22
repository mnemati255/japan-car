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
    public class PartRepository : IPartRepository
    {
        private readonly AppDbContext _context;


        public PartRepository(AppDbContext context)
        {
            _context = context;
        }


        public async Task CreatePart(int languageId, PartEntity entity)
        {
            var part = new Part
            {
                PartPrice = entity.PartPrice
            };

            part.PartTranslations.Add(new PartTranslation
            {
                PartName = entity.PartName,
                PartDescription = entity.PartDescription,
                LanguageId = languageId
            });

            _context.Parts.Add(part);

            await _context.SaveChangesAsync();
        }


        public async Task<bool> DeletePart(int id)
        {
            var part = await _context.Parts
                .Include(x => x.PartTranslations)
                .FirstAsync(x => x.PartId == id);

            if (part == null)
                return false;

            _context.PartTranslations.RemoveRange(part.PartTranslations);
            _context.Parts.Remove(part);

            await _context.SaveChangesAsync();
                
            return true;
        }


        public async Task<PartEntity?> GetPartById(int languageId, int id)
        {
            var part = await _context.Parts
                .Where(x => x.PartId == id)
                .Select(p => new
                {
                    p,
                    tr = p.PartTranslations.First(t => t.LanguageId == languageId)
                })
                .FirstAsync();

            return new PartEntity
            {
                PartId = id,
                PartPrice = part.p.PartPrice,
                PartName = part.tr != null ? part.tr.PartName : "",
                PartDescription = part.tr != null ? part.tr.PartDescription : "",
            };
        }


        public async Task<PagedResult<PartEntity>> GetParts(int languageId, string? keyword, int? skip = null, int? take = null)
        {
            var query = from p in _context.Parts.AsNoTracking()
                        join pTr in _context.PartTranslations.AsNoTracking() on p.PartId equals pTr.PartId
                        where pTr.LanguageId == languageId
                        select new { p, pTr };

            if (!string.IsNullOrEmpty(keyword))
                query = query.Where(x => x.pTr.PartName.Contains(keyword) || (!string.IsNullOrEmpty(x.pTr.PartDescription) && x.pTr.PartDescription.Contains(keyword)));

            var totalCount = await query.CountAsync();

            if (skip.HasValue)
                query = query.Skip(skip.Value);

            if (take.HasValue)
                query = query.Take(take.Value);

            var items = await query.Select(x => new PartEntity
            {
                PartId = x.p.PartId,
                PartPrice = x.p.PartPrice,
                PartName = x.pTr.PartName,
                PartDescription = x.pTr.PartDescription,
                CreatedDate = x.p.CreatedDate
            }).ToListAsync();

            return new PagedResult<PartEntity>
            {
                Items = items,
                TotalCount = totalCount
            };
        }


        public async Task UpdatePart(int languageId, int id, PartEntity entity)
        {
            var part = await _context.Parts
                .Where(x => x.PartId == id)
                .Select(p => new
                {
                    p,
                    tr = p.PartTranslations.First(t => t.LanguageId == languageId)
                })
                .FirstOrDefaultAsync();

            if (part != null)
            {
                part.p.PartPrice = entity.PartPrice;

                if (part.tr != null)
                {
                    part.tr.PartName = entity.PartName;
                    part.tr.PartDescription = entity.PartDescription;
                }
                else
                {
                    part.p.PartTranslations.Add(new PartTranslation
                    {
                        PartName = entity.PartName,
                        PartDescription = entity.PartDescription,
                        LanguageId = languageId
                    });
                }

                part.p.ModifiedDate = DateTime.Now;

                await _context.SaveChangesAsync();
            }
        }

    }
}
