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

        public async Task Create(AuctionEntity auction)
        {
            var entity = new Auction
            {
                AuctionName = auction.AuctionName,
                AuctionDate = auction.AuctionDate,
                AuctionFee = auction.AuctionFee,
            };

            _context.Auctions.Add(entity);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> Delete(int id)
        {
            var entity = await _context.Auctions.SingleOrDefaultAsync(x=>x.AuctionId == id);
            if (entity == null)
                return false;

            _context.Auctions.Remove(entity);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<AuctionEntity>> GetAll()
        {
            var entities = await _context.Auctions.ToListAsync();

            return entities.Select(x => new AuctionEntity
            {
                AuctionId = x.AuctionId,
                AuctionName = x.AuctionName,
                AuctionDate = x.AuctionDate,
                AuctionFee = x.AuctionFee,
                CreatedDate = x.CreatedDate
            });
        }

        public async Task<AuctionEntity?> GetById(int id)
        {
            var entity = await _context.Auctions.SingleOrDefaultAsync(x => x.AuctionId == id);

            if (entity == null)
                return null;

            return new AuctionEntity
            {
                AuctionName = entity.AuctionName,
                AuctionDate = entity.AuctionDate,
                AuctionFee = entity.AuctionFee,
            };
        }

        public async Task<bool> Update(int id, AuctionEntity auction)
        {
            var entity = await _context.Auctions.SingleOrDefaultAsync(x => x.AuctionId == id);

            if (entity == null)
                return false;

            entity.AuctionName = auction.AuctionName;
            entity.AuctionDate = auction.AuctionDate;
            entity.AuctionFee = auction.AuctionFee;

            _context.Auctions.Update(entity);

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
