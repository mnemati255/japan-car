using JapanCar.Domain.Entities;

namespace JapanCar.Application.Interfaces
{
    public interface IAuctionRepository
    {
        Task<IEnumerable<AuctionEntity>> GetAll();
        Task<AuctionEntity?> GetById(int id);
        Task Create(AuctionEntity auction);
        Task<bool> Update(int id, AuctionEntity auction);
        Task<bool> Delete(int id);
    }
}
