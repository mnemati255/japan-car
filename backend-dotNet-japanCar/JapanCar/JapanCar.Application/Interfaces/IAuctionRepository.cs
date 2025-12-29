using JapanCar.Application.Models;
using JapanCar.Domain.Entities;

namespace JapanCar.Application.Interfaces
{
    public interface IAuctionRepository
    {
        Task<PagedResult<AuctionEntity>> GetAuctions(int languageId, string? keyword, int? skip = null, int? take = null);
        Task<AuctionEntity?> GetAuctionById(int languageId, int id);
        Task CreateAuction(int languageId, AuctionEntity auction);
        Task<bool> UpdateAuction(int languageId, int id, AuctionEntity auction);
        Task<bool> DeleteAuction(int id);
    }
}
