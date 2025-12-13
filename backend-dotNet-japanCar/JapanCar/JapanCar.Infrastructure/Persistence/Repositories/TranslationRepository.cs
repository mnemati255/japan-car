using JapanCar.Application.Interfaces;
using JapanCar.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace JapanCar.Infrastructure.Persistence.Repositories
{
    public class TranslationRepository : ITranslationRepository
    {
        private readonly AppDbContext _context;


        public TranslationRepository(AppDbContext context)
        {
            _context = context;
        }


        public async Task<IEnumerable<GenericTranslationEntity>> GetAllTranslations()
        {
            var result = await _context.GenericTranslations
                .Include(x => x.Language)
                .ToListAsync();

            return result.Select(x => new GenericTranslationEntity
            {
                Category = x.Category,
                EntityName = x.EntityName,
                FieldName = x.FieldName,
                LanguageCode = x.Language.Code,
                TranslatedValue = x.TranslatedValue,
            });
        }
    }
}
