using JapanCar.Application.DTOs;
using JapanCar.Application.Interfaces;
using JapanCar.Domain.Entities;
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


        public async Task<List<TranslationDto>> GetAllTranslations()
        {
            var entities = await _unitOfWork.TranslationRepository.GetAllTranslations();

            return entities.Select(x => new TranslationDto
            {
                Category = x.Category,
                EntityName = x.EntityName,
                FieldName = x.FieldName,
                LanguageCode = x.LanguageCode,
                TranslatedValue = x.TranslatedValue,
            }).ToList();
        }


        public async Task CreateTranslation(List<TranslationDto> dtos)
        {
            var entities = dtos.Select(x => new TranslationEntity
            {
                EntityName = x.EntityName,
                FieldName = x.FieldName,
                TranslatedValue = x.TranslatedValue,
                Category = x.Category
            }).ToList();

            await _unitOfWork.TranslationRepository.CreateTranslation(entities);
        }
    }
}
