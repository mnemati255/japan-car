using Common.Exceptions;
using JapanCar.Application.DTOs;
using JapanCar.Application.Helpers;
using JapanCar.Application.Interfaces;
using JapanCar.Common;
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


        public async Task<bool> MarkNotificationAsDone(int notifId, string userName)
        {
            var notification = await _unitOfWork.NotificationRepository.GetNotificationById(notifId);
            if (notification == null)
                throw new AppException("Notification not found", System.Net.HttpStatusCode.NotFound);

            var car = await _unitOfWork.CarRepository.GetById(notification.CarId, false, false);
            if (car == null)
                throw new AppException("Car not found", System.Net.HttpStatusCode.NotFound);

            var canResolved = true;

            switch (notification.NotificationType)
            {
                case (byte)Enums.NotificationType.Police:
                    canResolved = !(car.NeedsPoliceCertificate == true && car.PoliceCertificateReceivedDate == null);
                    break;

                case (byte)Enums.NotificationType.Action:
                    canResolved = car.AuctionSentDate != null;
                    break;

                case (byte)Enums.NotificationType.Deed:
                    canResolved = car.DeedIssuedDate != null;
                    break;

                case (byte)Enums.NotificationType.Shakend:
                    canResolved = !(car.HasInsurance == true && car.InsuranceEndDate == null);
                    break;

                case (byte)Enums.NotificationType.Vehicle:
                    canResolved = car.TransportDateReceived != null;
                    break;

                case (byte)Enums.NotificationType.Municipality:
                    canResolved = !(car.EngineVolume < 1000 && car.MunicipalitySentDate == null);
                    break;

                case (byte)Enums.NotificationType.Plate:
                    canResolved = !(car.HasInsurance == true && car.PlateRevokedDate == null);
                    break;
            }

            if (!canResolved)
            {
                var languageId = await GetLanguageId(_requestContext.Locale);
                var messages = await _unitOfWork
                    .TranslationRepository
                    .GetAllTranslations(languageId, "NotificationResolveValidation");

                var typeName = Enum.GetName(typeof(Enums.NotificationType), notification.NotificationType);
                var msg = messages.FirstOrDefault(x => x.FieldName == typeName)?.TranslatedValue ?? "";

                throw new AppException(msg, System.Net.HttpStatusCode.Conflict);
            }

            var user = await _unitOfWork.UserRepository.GetUserByUserName(userName);
            if (user == null)
                throw new AppException("User not found", System.Net.HttpStatusCode.NotFound);

            return await _unitOfWork.NotificationRepository.MarkNotificationAsDone(notifId, user.UserId);
        }
    }
}
