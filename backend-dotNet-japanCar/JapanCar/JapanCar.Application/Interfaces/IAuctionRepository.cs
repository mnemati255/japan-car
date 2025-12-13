using JapanCar.Domain.Entities;

namespace JapanCar.Application.Interfaces
{
    public interface IAuctionRepository
    {
        Task<IEnumerable<AuctionEntity>> GetAll(int languageId);
        Task<AuctionEntity?> GetById(int languageId, int id);
        Task Create(int languageId, AuctionEntity auction);
        Task<bool> Update(int languageId, int id, AuctionEntity auction);
        Task<bool> Delete(int id);
    }
}
