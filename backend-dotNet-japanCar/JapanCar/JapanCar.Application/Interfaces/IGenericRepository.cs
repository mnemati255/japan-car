using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        Task<List<T>> FindAsync(Expression<Func<T, bool>>? filter = null);
        Task<T?> FindById(int id);
    }
}
