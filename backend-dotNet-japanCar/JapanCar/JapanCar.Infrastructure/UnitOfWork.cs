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
        public ILanguageRepository LanguageRepository { get; private set; }
        public ITranslationRepository GenericTranslationRepository { get; private set; }
        public IPartRepository PartRepository { get; private set; }
        public IRepairRepository RepairRepository { get; private set; }
        public IMechanicRepository MechanicRepository { get; private set; }
        public ICarPartRepository CarPartRepository { get; private set; }
        public ICustomerRepository CustomerRepository { get; private set; }
        public INotificationRepository NotificationRepository { get; private set; }


        public UnitOfWork(AppDbContext context)
        {
            _context = context;
            CarRepository = new CarRepository(_context);
            UserRepository = new UserRepository(_context);
            RoleRepository = new RoleRepository(_context);
            AuctionRepository = new AuctionRepository(_context);
            BaseInfoRepository = new BaseInfoRepository(_context);
            LanguageRepository = new LanguageRepository(_context);
            GenericTranslationRepository = new TranslationRepository(_context);
            PartRepository = new PartRepository(_context);
            RepairRepository = new RepairRepository(_context);
            MechanicRepository = new MechanicRepository(_context);
            CarPartRepository = new CarPartRepository(_context);
            CustomerRepository = new CustomerRepository(_context);
            NotificationRepository = new Notificationrepository(_context);
        }


        public async Task ExecuteInTransactionAsync(Func<Task> action)
        {
            await using var transaction =
                await _context.Database.BeginTransactionAsync();

            try
            {
                await action();
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }


        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }


        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
