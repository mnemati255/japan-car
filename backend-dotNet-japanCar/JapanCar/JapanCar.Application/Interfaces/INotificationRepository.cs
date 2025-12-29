using JapanCar.Application.Models;
using JapanCar.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.Interfaces
{
    public interface INotificationRepository
    {
        Task<PagedResult<NotificationEntity>> GetNotifications(bool isResolved, int languageId, int? skip, int? take);
        Task<bool> MarkNotificationAsDone(int id, int userId);
        Task<NotificationEntity?> GetNotificationById(int id);
    }
}
