using JapanCar.Application.Interfaces;
using JapanCar.Domain.Entities;
using JapanCar.Infrastructure.Persistence;
using JapanCar.Infrastructure.Persistence.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Infrastructure
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;
        public ICarRepository CarRepository {  get; private set; }
        public IUserRepository UserRepository {  get; private set; }
        public IRoleRepository RoleRepository {  get; private set; }
        public IAuctionRepository AuctionRepository { get; private set; }
        public IBaseInfoRepository BaseInfoRepository { get; private set; }


        public UnitOfWork(AppDbContext context)
        {
            _context = context;
            CarRepository = new CarRepository(_context);
            UserRepository = new UserRepository(_context);
            RoleRepository = new RoleRepository(_context);
            AuctionRepository = new AuctionRepository(_context);
            BaseInfoRepository = new BaseInfoRepository(_context);
        }

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
