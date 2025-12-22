using JapanCar.Domain.Entities;

namespace JapanCar.Application.Interfaces
{
    public interface IAuctionRepository
    {
        Task<IEnumerable<AuctionEntity>> GetAuctions(int languageId);
        Task<AuctionEntity?> GetAuctionById(int languageId, int id);
        Task CreateAuction(int languageId, AuctionEntity auction);
        Task<bool> UpdateAuction(int languageId, int id, AuctionEntity auction);
        Task<bool> DeleteAuction(int id);
    }
}
