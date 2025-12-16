using JapanCar.Application.Models;
using JapanCar.Domain.Entities;

namespace JapanCar.Application.Interfaces
{
    public interface IPartRepository
    {
        Task<PagedResult<PartEntity>> GetParts(int languageId, string? keyword, int? skip = null, int? take = null);
        Task<PartEntity?> GetPartById(int languageId, int id);
        Task CreatePart(int languageId, PartEntity entity);
        Task UpdatePart(int languageId, int id, PartEntity entity);
        Task DeletePart(int id);
    }
}
