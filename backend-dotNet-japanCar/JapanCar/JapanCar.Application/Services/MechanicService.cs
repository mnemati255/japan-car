using JapanCar.Application.DTOs;
using JapanCar.Application.Helpers;
using JapanCar.Application.Interfaces;
using JapanCar.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.Services
{
    public class MechanicService
    {
        private readonly IUnitOfWork _unitOfWork;


        public MechanicService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }


        public async Task<GridDto<MechanicDto>> GetMechanics(string? keyword, int? skip, int? take)
        {
            var entities = await _unitOfWork.MechanicRepository.GetMechanics(keyword, skip, take);

            var items = entities.Items.Select(x => new MechanicDto
            {
                Contact = x.Contact,
                CreatedAt = x.CreatedDate,
                MechanicId = x.MechanicId,
                MechanicName = x.MechanicName
            });

            var totalPage = take.HasValue ? PagingHelper.GetTotalPages(entities.TotalCount, take.Value) : 0;

            return new GridDto<MechanicDto>
            {
                Items = items,
                TotalPage = totalPage
            };
        }


        public async Task<MechanicDto?> GetMechanicById(int id)
        {
            var entity = await _unitOfWork.MechanicRepository.GetMechanicById(id);
            if(entity == null)
                return null;

            return new MechanicDto
            {
                Contact = entity.Contact,
                CreatedAt = entity.CreatedDate,
                MechanicId = entity.MechanicId,
                MechanicName = entity.MechanicName
            };
        }


        public async Task CreateUpdateMechanic(MechanicDto dto, int? id)
        {
            var entity = new MechanicEntity
            {
                Contact = dto.Contact,
                MechanicName = dto.MechanicName,
            };

            if(!id.HasValue)
                await _unitOfWork.MechanicRepository.CreateMechanic(entity);
            else
                await _unitOfWork.MechanicRepository.UpdateMechanic((int)id, entity);
        }


        public async Task DeleteMechanic(int id)
        {
            await _unitOfWork.MechanicRepository.DeleteMechanic(id);
        }
    }
}
