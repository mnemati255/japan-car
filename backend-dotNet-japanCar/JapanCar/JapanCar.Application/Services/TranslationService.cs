using JapanCar.Application.DTOs;
using JapanCar.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.Services
{
    public class TranslationService
    {
        private readonly IUnitOfWork _unitOfWork;


        public TranslationService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }


        public async Task<List<GenericTranslationDto>> GetAllTranslations()
        {
            var entities = await _unitOfWork.GenericTranslationRepository.GetAllTranslations();

            return entities.Select(x => new GenericTranslationDto
            {
                Category = x.Category,
                EntityName = x.EntityName,
                FieldName = x.FieldName,
                LanguageCode = x.LanguageCode,
                TranslatedValue = x.TranslatedValue,
            }).ToList();
        }
    }
}
