using JapanCar.Application.Interfaces;

namespace JapanCar.Api.Helpers
{
    public class RequestContext : IRequestContext
    {
        public string Locale { get; set; } = null!;
    }

}
