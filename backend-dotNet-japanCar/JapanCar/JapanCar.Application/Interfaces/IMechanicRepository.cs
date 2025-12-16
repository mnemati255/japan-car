using JapanCar.Application.Models;
using JapanCar.Domain.Entities;

namespace JapanCar.Application.Interfaces
{
    public interface IMechanicRepository
    {
        Task<PagedResult<MechanicEntity>> GetMechanics(string? keyword, int? skip = null, int? take = null);
        Task<MechanicEntity?> GetMechanicById(int id);
        Task CreateMechanic(MechanicEntity entity);
        Task UpdateMechanic(int id, MechanicEntity entity);
        Task<bool> DeleteMechanic(int id);
    }
}
