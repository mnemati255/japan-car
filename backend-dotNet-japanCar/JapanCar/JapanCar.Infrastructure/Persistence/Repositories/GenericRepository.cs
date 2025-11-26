using JapanCar.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace JapanCar.Infrastructure.Persistence.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly AppDbContext _context;

        public GenericRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<T>> FindAsync(Expression<Func<T, bool>>? where = null)
        {
            IQueryable<T> query = _context.Set<T>();

            if(where != null)
                query = query.Where(where);

            return await query.ToListAsync();
        }

        public async Task<T?> FindById(int id)
        {
            var dbSet = _context.Set<T>();
            return await dbSet.FindAsync(id);
        }
    }
}
