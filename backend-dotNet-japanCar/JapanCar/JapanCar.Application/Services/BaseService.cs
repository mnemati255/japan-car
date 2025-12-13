using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.Services
{
    public abstract class BaseService
    {
        private readonly LanguageService _languageService;


        protected BaseService(LanguageService languageService)
        {
            _languageService = languageService;
        }


        protected async Task<int> GetLanguageId(string langCode)
        {
            return await _languageService.GetLanguageIdByCode(langCode);
        }

    }
}
