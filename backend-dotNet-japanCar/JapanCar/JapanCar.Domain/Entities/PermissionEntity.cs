using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Domain.Entities
{
    public class PermissionEntity
    {
        /// <summary>
        /// شناسه دسترسی
        /// </summary>
        public int PermissionId { get; set; }

        /// <summary>
        /// نام دسترسی
        /// </summary>
        public string PermissionName { get; set; } = null!;

        /// <summary>
        /// کد دسترسی
        /// </summary>
        public string Code { get; set; } = null!;

        /// <summary>
        /// توضیحات دسترسی
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// تاریخ ویرایش
        /// </summary>
        public DateTime? ModifiedDate { get; set; }

        /// <summary>
        /// کاربر ایجاد کننده
        /// </summary>
        public int? CreatedBy { get; set; }

        /// <summary>
        /// کاربر ویرایش کننده
        /// </summary>
        public int? ModifiedBy { get; set; }
    }
}
