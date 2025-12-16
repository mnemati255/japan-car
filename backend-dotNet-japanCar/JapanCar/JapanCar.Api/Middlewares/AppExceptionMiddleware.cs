using Common.Exceptions;
using System.Net;
using System.Text.Json;

namespace JapanCar.Api.Middlewares
{
    public class AppExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public AppExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (AppException ex)
            {
                await HandleAppExceptionAsync(httpContext, ex);
            }
            catch (Exception ex)
            {
                await HandleGenericExceptionAsync(httpContext, ex);
            }
        }

        private Task HandleAppExceptionAsync(HttpContext context, AppException exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)exception.StatusCode;

            var response = new
            {
                message = exception.Message,
                details = exception.InnerException != null ? exception.InnerException.Message : "",
                code = exception.StatusCode
            };

            return context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }

        private Task HandleGenericExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var response = new
            {
                message = exception.Message,
                details = exception.InnerException != null ? exception.InnerException.Message : "",
            };

            return context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}
