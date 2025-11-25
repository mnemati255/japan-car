using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Common.Exceptions
{
    public class AppException : System.Exception
    {
        public HttpStatusCode StatusCode { get; init; }
        public override string Message { get; }

        public AppException(string message, HttpStatusCode httpStatusCode)
        {
            Message = message;
            StatusCode = httpStatusCode;
        }
    }
}
