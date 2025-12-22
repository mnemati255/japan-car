using JapanCar.Application.Interfaces;
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


        public async Task CreateAuction(int languageId, AuctionEntity auction)
        {
            var entity = new Auction();

            entity.AuctionsTranslations.Add(new AuctionsTranslation
            {
                AuctionDate = auction.AuctionDate,
                AuctionFee = auction.AuctionFee,
                AuctionName = auction.AuctionName,
                LanguageId = languageId
            });

            _context.Auctions.Add(entity);

            await _context.SaveChangesAsync();
        }


        public async Task<bool> DeleteAuction(int id)
        {
            var entity = await _context.Auctions
                .Include(x => x.AuctionsTranslations)
                .FirstOrDefaultAsync(x => x.AuctionId == id);

            if (entity == null)
                return false;

            _context.AuctionsTranslations.RemoveRange(entity.AuctionsTranslations);

            _context.Auctions.Remove(entity);

            await _context.SaveChangesAsync();

            return true;
        }


        public async Task<IEnumerable<AuctionEntity>> GetAuctions(int languageId)
        {
            var query = from auc in _context.Auctions
                        join aucTr in _context.AuctionsTranslations on auc.AuctionId equals aucTr.AuctionId
                        where aucTr.LanguageId == languageId
                        select new AuctionEntity
                        {
                            AuctionId = auc.AuctionId,
                            AuctionName = aucTr.AuctionName,
                            AuctionDate = aucTr.AuctionDate,
                            AuctionFee = aucTr.AuctionFee,
                            CreatedDate = auc.CreatedDate
                        };

            return await query.ToListAsync();
        }


        public async Task<AuctionEntity?> GetAuctionById(int languageId, int id)
        {
            var entity = await _context
                .Auctions
                .Include(x => x.AuctionsTranslations.Where(t => t.LanguageId == languageId))
                .SingleOrDefaultAsync(x => x.AuctionId == id);

            if (entity == null)
                return null;

            var translation = entity.AuctionsTranslations.FirstOrDefault();

            var result = new AuctionEntity
            {
                AuctionId = entity.AuctionId,
                AuctionName = translation != null ? translation.AuctionName : "",
                AuctionFee = translation?.AuctionFee,
            };
            if (translation != null)
                result.AuctionDate = translation.AuctionDate;

            return result;
        }


        public async Task<bool> UpdateAuction(int languageId, int id, AuctionEntity auction)
        {
            var entity = await _context
                .Auctions
                .Include(x => x.AuctionsTranslations.Where(t => t.LanguageId == languageId))
                .FirstOrDefaultAsync(x => x.AuctionId == id);

            if (entity == null)
                return false;

            entity.ModifiedDate = DateTime.Now;

            var trEntity = entity.AuctionsTranslations.FirstOrDefault();
            if (trEntity != null)
            {
                trEntity.AuctionName = auction.AuctionName;
                trEntity.AuctionDate = auction.AuctionDate;
                trEntity.AuctionFee = auction.AuctionFee;
            }
            else
            {
                entity.AuctionsTranslations.Add(new AuctionsTranslation
                {
                    AuctionName = auction.AuctionName,
                    AuctionFee = auction.AuctionFee,
                    AuctionDate = auction.AuctionDate,
                    LanguageId = languageId,
                });
            }

            _context.Update(entity);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
