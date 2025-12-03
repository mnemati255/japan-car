using JapanCar.Application.DTOs;
using JapanCar.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.Services
{
    public class BaseInfoService
    {
        private readonly IUnitOfWork _unitOfWork;

        public BaseInfoService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<ColorDto>> GetColors()
        {
            var colors = await _unitOfWork.BaseInfoRepository.GetCarColors();
            return colors.Select(x => new ColorDto
            {
                ColorId = x.ColorId,
                ColorName = x.ColorName,
            });
        }

        public async Task<IEnumerable<ModelDto>> GetModels()
        {
            var models = await _unitOfWork.BaseInfoRepository.GetCarModels();
            return models.Select(x => new ModelDto
            {
                ModelId = x.ModelId,
                BrandId = x.BrandId,
                ModelName = x.ModelName,
            });
        }
    }
}
