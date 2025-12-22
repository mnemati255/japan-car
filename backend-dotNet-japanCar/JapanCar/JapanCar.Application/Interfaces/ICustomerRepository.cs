using JapanCar.Application.Models;
using JapanCar.Domain.Entities;

namespace JapanCar.Application.Interfaces
{
    public interface ICustomerRepository
    {
        Task<PagedResult<CustomerEntity>> GetCustomers(string? keyword, int? skip, int? take);
        Task<CustomerEntity?> GetCustomerById(int id);
        Task CreateCustomer(CustomerEntity customer);
        Task UpdateCustomer(int id, CustomerEntity customer);
        Task<bool> DeleteCustomer(int id);
    }
}
