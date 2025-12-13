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
        Task<int> CompleteAsync();
    }
}
