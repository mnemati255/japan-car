using Common.Exceptions;
using JapanCar.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.Services
{
    public class LanguageService
    {
        private readonly IUnitOfWork _unitOfWork;


        public LanguageService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }


        public async Task<int> GetLanguageIdByCode(string langCode)
        {
            var languageId = await _unitOfWork.LanguageRepository.GetLanguageIdByCode(langCode);
            if (!languageId.HasValue)
                throw new AppException("Langiage not found", HttpStatusCode.Conflict);

            return languageId.Value;
        }
    }
}
