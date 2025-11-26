using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace JapanCar.Api.Filters
{
    public class ValidateDtoFilter<T> : IAsyncActionFilter where T : class
    {
        private readonly IValidator<T> _validator;

        public ValidateDtoFilter(IValidator<T> validator)
        {
            _validator = validator;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var dto = context.ActionArguments.Values.OfType<T>().FirstOrDefault();

            if (dto != null)
            {
                var result = await _validator.ValidateAsync(dto);

                if (!result.IsValid)
                {
                    context.Result = new BadRequestObjectResult(
                        result.Errors.Select(x => x.ErrorMessage));
                    return;
                }
            }

            await next();
        }
    }
}
