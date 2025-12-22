using JapanCar.Application.Interfaces;
using JapanCar.Application.Models;
using JapanCar.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Infrastructure.Persistence.Repositories
{
    public class Notificationrepository : INotificationRepository
    {
        private readonly AppDbContext _context;


        public Notificationrepository(AppDbContext context)
        {
            _context = context;
        }


        public async Task<PagedResult<NotificationEntity>> GetNotifications(bool isResolved, int languageId, int? skip, int? take)
        {
            var query = _context.SystemNotifications
                .Where(x => x.IsResolved == isResolved)
                .AsNoTracking()
                .OrderByDescending(x => x.CreatedDate)
                .AsQueryable();

            var totalCount = await query.CountAsync();

            if (skip.HasValue)
                query = query.Skip(skip.Value);

            if (take.HasValue)
                query = query.Take(take.Value);

            var items = await query.Select(x => new NotificationEntity
            {
                CarId = x.CarId,
                CarModel = x.Car.Model.CarModelTranslations
                    .Where(t => t.LanguageId == languageId)
                    .Select(t => t.ModelName)
                    .FirstOrDefault() ?? "",
                CarBrand = x.Car.Model.Brand.CarBrandTranslations.Where(t => t.LanguageId == languageId)
                    .Select(t => t.BrandName)
                    .FirstOrDefault() ?? "",
                CarColor = x.Car.Color.CarColorTranslations.Where(t => t.LanguageId == languageId)
                    .Select(t => t.ColorName)
                    .FirstOrDefault() ?? "",
                CarYear = x.Car.Year,
                CreatedDate = x.CreatedDate,
                DueDate = x.DueDate,
                IsResolved = x.IsResolved,
                Message = x.SystemNotificationTranslations.Where(t => t.LanguageId == languageId)
                    .Select(t => t.Message)
                    .FirstOrDefault() ?? "",
                NotificationId = x.NotificationId,
                NotificationType = x.NotificationType,
                ResolvedDate = x.ResolvedDate,
                ResolvedBy = x.ResolvedByNavigation != null ? x.ResolvedByNavigation.UserName : null
            }).ToListAsync();

            return new PagedResult<NotificationEntity>
            {
                Items = items,
                TotalCount = totalCount
            };
        }


        public async Task<bool> MarkNotificationAsDone(int id, int userId)
        {
            var notification = await _context.SystemNotifications
                .FirstOrDefaultAsync(x => x.NotificationId == id);

            if (notification == null)
                return false;

            notification.IsResolved = true;
            notification.ResolvedDate = DateTime.Now;
            notification.ResolvedBy = userId;

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
