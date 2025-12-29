using JapanCar.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.Interfaces
{
    public interface ITranslationRepository
    {
        Task<IEnumerable<TranslationEntity>> GetAllTranslations(int? languageId = null, string? entityName = null);
        Task CreateTranslation(List<TranslationEntity> entities);
    }
}
