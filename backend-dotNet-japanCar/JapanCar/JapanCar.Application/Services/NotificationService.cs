using Common.Exceptions;
using JapanCar.Application.DTOs;
using JapanCar.Application.Helpers;
using JapanCar.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.Services
{
    public class NotificationService : BaseService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRequestContext _requestContext;


        public NotificationService(IUnitOfWork unitOfWork, IRequestContext requestContext, LanguageService languageService) : base(languageService)
        {
            _unitOfWork = unitOfWork;
            _requestContext = requestContext;
        }


        public async Task<GridDto<NotificationDto>> GetNotifications(bool isResolved, int? skip, int? take)
        {
            var languageId = await GetLanguageId(_requestContext.Locale);

            var notifications = await _unitOfWork.NotificationRepository.GetNotifications(isResolved, languageId, skip, take);

            var items = notifications.Items.Select(x => new NotificationDto
            {
                CarId = x.CarId,
                CarBrand = x.CarBrand,
                CarModel = x.CarModel,
                CarColor = x.CarColor,
                CarYear = x.CarYear,
                CreatedAt = x.CreatedDate,
                DueDate = x.DueDate,
                IsResolved = x.IsResolved,
                Message = x.Message,
                NotificationId = x.NotificationId,
                NotificationType = x.NotificationType,
                ResolvedDate = x.ResolvedDate,
                ResolvedBy = x.ResolvedBy,
            });

            var totalPage = take.HasValue ? PagingHelper.GetTotalPages(notifications.TotalCount, take.Value) : 0;

            return new GridDto<NotificationDto>
            {
                Items = items,
                TotalPage = totalPage,
            };

        }


        public async Task<bool> MarkNotificationAsDone(int id, string userName)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUserName(userName);
            if (user == null)
                throw new AppException("User not found", System.Net.HttpStatusCode.NotFound);

            return await _unitOfWork.NotificationRepository.MarkNotificationAsDone(id, user.UserId);
        }
    }
}
