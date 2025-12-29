using JapanCar.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JapanCar.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly NotificationService _notificationService;


        public NotificationController(NotificationService notificationService)
        {
            _notificationService = notificationService;
        }


        [HttpGet]
        public async Task<IActionResult> GetNotifications(bool isResolved, int? skip, int? take)
        {
            var result = await _notificationService.GetNotifications(isResolved, skip, take);
            return Ok(result);
        }


        [HttpPut("mark-as-done/{notifId}")]
        public async Task<IActionResult> MarkNotificationAsDone(int notifId)
        {
            var userName = User.Identity?.Name ?? "";
            await _notificationService.MarkNotificationAsDone(notifId, userName);
            return Ok();
        }
    }
}
