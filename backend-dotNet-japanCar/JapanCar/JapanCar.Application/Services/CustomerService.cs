using Common.Exceptions;
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
    public class CustomerService
    {
        private readonly IUnitOfWork _unitOfWork;


        public CustomerService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }


        public async Task<GridDto<CustomerDto>> GetCustomers(string? keyword, int? skip, int? take)
        {
            var result = await _unitOfWork.CustomerRepository.GetCustomers(keyword, skip, take);

            var totalPage = take.HasValue ? PagingHelper.GetTotalPages(result.TotalCount, take.Value) : 0;

            var items = result.Items.Select(x => new CustomerDto
            {
                Address = x.Address,
                CreatedAt = x.CreatedDate,
                CustomerId = x.CustomerId,
                Email = x.Email,
                FirstName = x.FirstName,
                IsActive = x.IsActive,
                LastName = x.LastName,
                Phone = x.Phone
            });

            return new GridDto<CustomerDto>
            {
                Items = items,
                TotalPage = totalPage,
            };
        }


        public async Task<CustomerDto?> GetCustomerById(int id)
        {
            var entity = await _unitOfWork.CustomerRepository.GetCustomerById(id);

            if (entity == null)
                throw new AppException("Not found", System.Net.HttpStatusCode.NotFound);

            return new CustomerDto
            {
                Address = entity.Address,
                CreatedAt = entity.CreatedDate,
                CustomerId = entity.CustomerId,
                Email = entity.Email,
                FirstName = entity.FirstName,
                IsActive = entity.IsActive,
                LastName = entity.LastName,
                Phone = entity.Phone
            };
        }


        public async Task CreateCustomer(CustomerDto dto)
        {
            var entity = new CustomerEntity
            {
                Address = dto.Address,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                IsActive = dto.IsActive,
                Phone = dto.Phone
            };

            await _unitOfWork.CustomerRepository.CreateCustomer(entity);
        }


        public async Task UpdateCustomer(int id, CustomerDto dto)
        {
            var entity = await _unitOfWork.CustomerRepository.GetCustomerById(id);

            if (entity == null)
                throw new AppException("Not found", System.Net.HttpStatusCode.NotFound);

            entity = new CustomerEntity
            {
                Address = dto.Address,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                IsActive = dto.IsActive,
                Phone = dto.Phone
            };

            await _unitOfWork.CustomerRepository.UpdateCustomer(id, entity);
        }


        public async Task DeleteCustomer(int id)
        {
            var deleted = await _unitOfWork.CustomerRepository.DeleteCustomer(id);
            if(!deleted)
                throw new AppException("Not found", System.Net.HttpStatusCode.NotFound);
        }
    }
}
