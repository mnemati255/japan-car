using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Domain.Entities
{
    public class AuctionEntity
    {
        /// <summary>
        /// شناسه حراج
        /// </summary>
        public int AuctionId { get; set; }

        /// <summary>
        /// نام حراج
        /// </summary>
        public string AuctionName { get; set; } = null!;

        /// <summary>
        /// تاریخ برگزاری حراج
        /// </summary>
        public DateOnly AuctionDate { get; set; }

        /// <summary>
        /// کارمزد حراج
        /// </summary>
        public decimal? AuctionFee { get; set; }

        /// <summary>
        /// تاریخ ایجاد
        /// </summary>
        public DateTime? CreatedDate { get; set; }

        /// <summary>
        /// تاریخ ویرایش
        /// </summary>
        public DateTime? ModifiedDate { get; set; }

        /// <summary>
        /// ایجاد شده توسط
        /// </summary>
        public int? CreatedBy { get; set; }

        /// <summary>
        /// ویرایش شده توسط
        /// </summary>
        public int? ModifiedBy { get; set; }
    }
}
