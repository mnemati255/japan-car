using JapanCar.Application.Interfaces;
using JapanCar.Application.Models;
using JapanCar.Domain.Entities;
using JapanCar.Infrastructure.Persistence.Models;
using Microsoft.EntityFrameworkCore;

namespace JapanCar.Infrastructure.Persistence.Repositories
{
    public class AuctionRepository : IAuctionRepository
    {
        private readonly AppDbContext _context;

        public AuctionRepository(AppDbContext context)
        {
            _context = context;
        }


        public async Task CreateAuction(int languageId, AuctionEntity entity)
        {
            var auction = new Auction
            {
                CreatedBy = entity.CreatedBy
            };

            auction.AuctionsTranslations.Add(new AuctionsTranslation
            {
                AuctionName = entity.AuctionName,
                LanguageId = languageId,
            });

            _context.Auctions.Add(auction);

            await _context.SaveChangesAsync();
        }


        public async Task<bool> DeleteAuction(int id)
        {
            var auction = await _context.Auctions
                .Include(x => x.AuctionsTranslations)
                .FirstOrDefaultAsync(x => x.AuctionId == id);

            if (auction == null)
                return false;

            _context.AuctionsTranslations.RemoveRange(auction.AuctionsTranslations);

            _context.Auctions.Remove(auction);

            await _context.SaveChangesAsync();

            return true;
        }


        public async Task<PagedResult<AuctionEntity>> GetAuctions(int languageId, string? keyword, int? skip = null, int? take = null)
        {
            var query = from auc in _context.Auctions
                        join aucTr in _context.AuctionsTranslations on auc.AuctionId equals aucTr.AuctionId
                        where aucTr.LanguageId == languageId
                        select new AuctionEntity
                        {
                            AuctionId = auc.AuctionId,
                            AuctionName = aucTr.AuctionName,
                            CreatedDate = auc.CreatedDate
                        };

            if (!string.IsNullOrEmpty(keyword))
                query = query.Where(x => x.AuctionName.Contains(keyword));

            var totalCount = await query.CountAsync();

            if (skip.HasValue)
                query = query.Skip(skip.Value);

            if (take.HasValue)
                query = query.Take(take.Value);

            var items = await query.ToListAsync();

            return new PagedResult<AuctionEntity>
            {
                Items = items,
                TotalCount = totalCount
            };
        }


        public async Task<AuctionEntity?> GetAuctionById(int languageId, int id)
        {
            var auction = await _context
                .Auctions
                .Where(x => x.AuctionId == id)
                .Select(a => new
                {
                    a,
                    tr = a.AuctionsTranslations.First(t => t.LanguageId == languageId)
                })
                .FirstAsync();

            if (auction == null)
                return null;

            return new AuctionEntity
            {
                AuctionId = auction.a.AuctionId,
                AuctionName = auction.tr != null ? auction.tr.AuctionName : ""
            };
        }


        public async Task<bool> UpdateAuction(int languageId, int id, AuctionEntity entity)
        {
            var auction = await _context
                .Auctions
                .Where(x => x.AuctionId == id)
                .Select(a => new
                {
                    a,
                    tr = a.AuctionsTranslations.First(t => t.LanguageId == languageId)
                })
                .FirstOrDefaultAsync();

            if (auction == null)
                return false;

            auction.a.ModifiedBy = entity.ModifiedBy;
            auction.a.ModifiedDate = DateTime.Now;

            if (auction.tr != null)
            {
                auction.tr.AuctionName = entity.AuctionName;
            }
            else
            {
                auction.a.AuctionsTranslations.Add(new AuctionsTranslation
                {
                    AuctionName = entity.AuctionName,
                    LanguageId = languageId,
                });
            }

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
