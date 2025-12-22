using JapanCar.Application.Interfaces;
using JapanCar.Application.Models;
using JapanCar.Domain.Entities;
using JapanCar.Infrastructure.Persistence.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Infrastructure.Persistence.Repositories
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly AppDbContext _context;


        public CustomerRepository(AppDbContext context)
        {
            _context = context;
        }


        public async Task CreateCustomer(CustomerEntity customer)
        {
            var newCustomer = new Customer
            {
                FirstName = customer.FirstName,
                LastName = customer.LastName,
                Email = customer.Email,
                Phone = customer.Phone,
                IsActive = customer.IsActive,
                Address = customer.Address,
            };

            _context.Customers.Add(newCustomer);

            await _context.SaveChangesAsync();
        }


        public async Task<bool> DeleteCustomer(int id)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(x => x.CustomerId == id);

            if (customer == null)
                return false;

            _context.Customers.Remove(customer);

            await _context.SaveChangesAsync();

            return true;
        }


        public async Task<CustomerEntity?> GetCustomerById(int id)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(x => x.CustomerId == id);

            if (customer == null)
                return null;

            return new CustomerEntity
            {
                CustomerId = customer.CustomerId,
                FirstName = customer.FirstName,
                LastName = customer.LastName,
                Email = customer.Email,
                Phone = customer.Phone,
                IsActive = customer.IsActive,
                Address = customer.Address,
                CreatedDate = customer.CreatedDate,
            };
        }


        public async Task<PagedResult<CustomerEntity>> GetCustomers(string? keyword, int? skip, int? take)
        {
            var customers = _context.Customers.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(keyword))
                customers = customers.Where(x => x.FirstName.Contains(keyword) || x.LastName.Contains(keyword) ||
                (!string.IsNullOrEmpty(x.Email) && x.Email.Contains(keyword)) || (!string.IsNullOrEmpty(x.Phone) && x.Phone.Contains(keyword)) ||
                (!string.IsNullOrEmpty(x.Address) && x.Address.Contains(keyword)));

            var totalCount = await customers.CountAsync();

            if(skip.HasValue)
                customers = customers.Skip(skip.Value);

            if(take.HasValue)
                customers = customers.Take(take.Value);

            var items = await customers.Select(x => new CustomerEntity
            {
                CustomerId = x.CustomerId,
                FirstName = x.FirstName,
                LastName = x.LastName,
                Email = x.Email,
                Phone = x.Phone,
                IsActive = x.IsActive,
                Address = x.Address,
                CreatedDate = x.CreatedDate,
            }).ToListAsync();

            return new PagedResult<CustomerEntity>
            {
                Items = items,
                TotalCount = totalCount,
            };
        }


        public async Task UpdateCustomer(int id, CustomerEntity customer)
        {
            var item = await _context.Customers.FirstAsync(x => x.CustomerId == id);

            item.FirstName = customer.FirstName;
            item.LastName = customer.LastName;
            item.Email = customer.Email;
            item.Phone = customer.Phone;
            item.IsActive = customer.IsActive;
            item.Address = customer.Address;
            item.ModifiedDate = DateTime.Now;

            await _context.SaveChangesAsync();
        }
    }
}
