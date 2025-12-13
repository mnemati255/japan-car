using JapanCar.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Infrastructure.Persistence.Repositories
{
    public class LanguageRepository : ILanguageRepository
    {
        private readonly AppDbContext _context;


        public LanguageRepository(AppDbContext context)
        {
            _context = context;
        }


        public async Task<int?> GetLanguageIdByCode(string langCode)
        {
            var language = await _context.Languages.FirstOrDefaultAsync(x => x.Code == langCode);
            return language?.LanguageId;
        }
    }
}
