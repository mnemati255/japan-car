using JapanCar.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JapanCar.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TranslationController : ControllerBase
    {
        private readonly TranslationService _translationService;


        public TranslationController(TranslationService translationService)
        {
            _translationService = translationService;
        }


        [HttpGet]
        public async Task<IActionResult> GetAllTranslations()
        {
            var result = await _translationService.GetAllTranslations();
            return Ok(result);
        }
    }
}
