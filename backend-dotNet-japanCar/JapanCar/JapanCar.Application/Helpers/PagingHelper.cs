using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.Helpers
{
    public static class PagingHelper
    {
        public static int GetTotalPages(int totalCount, int take)
        {
            return (int)Math.Ceiling((double)totalCount / take);
        }
    }
}
