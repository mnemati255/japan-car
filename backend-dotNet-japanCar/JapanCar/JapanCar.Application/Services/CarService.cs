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
    public class CarService
    {
        private readonly IUnitOfWork _unitOfWork;

        public CarService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<CarDto>> GetAllCars()
        {
            var cars = await _unitOfWork.CarRepository.GetAllCars();
            return cars.Select(x => new CarDto
            {
                ColorName = x.Color.ColorName,
                Mileage = x.Mileage,
                ModelName = x.Model.ModelName,
                Year = x.Year
            });
        }
    }
}
