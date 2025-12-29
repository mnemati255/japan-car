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


        public async Task<IEnumerable<TranslationEntity>> GetAllTranslations(int? languageId = null, string? entityName = null)
        {
            var query = _context.GenericTranslations
                .Include(x => x.Language)
                .AsQueryable();

            if (languageId.HasValue)
                query = query.Where(x => x.LanguageId == languageId.Value);

            if (!string.IsNullOrEmpty(entityName))
                query = query.Where(x => x.EntityName == entityName);

            var result = await query.ToListAsync();

            return result.Select(x => new TranslationEntity
            {
                Category = x.Category,
                EntityName = x.EntityName,
                FieldName = x.FieldName,
                LanguageCode = x.Language.Code,
                TranslatedValue = x.TranslatedValue,
            });
        }


        public async Task CreateTranslation(List<TranslationEntity> entities)
        {
            foreach (var item in entities)
            {
                _context.GenericTranslations.Add(new Models.GenericTranslation
                {
                    LanguageId = 1,
                    EntityName = item.EntityName,
                    FieldName = item.FieldName,
                    TranslatedValue = item.TranslatedValue
                });

                _context.GenericTranslations.Add(new Models.GenericTranslation
                {
                    LanguageId = 2,
                    EntityName = item.EntityName,
                    FieldName = item.FieldName,
                    TranslatedValue = item.TranslatedValue
                });
            }

            await _context.SaveChangesAsync();
        }
    }
}
