using JapanCar.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.Interfaces
{
    public interface IUnitOfWork:IDisposable
    {
        ICarRepository CarRepository { get; }
        IUserRepository UserRepository { get; }
        IRoleRepository RoleRepository { get; }
        IAuctionRepository AuctionRepository { get; }
        IBaseInfoRepository BaseInfoRepository { get; }
        ILanguageRepository LanguageRepository { get; }
        ITranslationRepository GenericTranslationRepository { get; }
        IPartRepository PartRepository { get; }
        IRepairRepository RepairRepository { get; }
        IMechanicRepository MechanicRepository { get; }
        ICarPartRepository CarPartRepository { get; }

        Task ExecuteInTransactionAsync(Func<Task> action);
        Task<int> SaveChangesAsync();
    }
}
