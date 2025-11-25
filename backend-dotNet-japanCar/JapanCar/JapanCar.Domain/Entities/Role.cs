using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Domain.Entities
{
    public class Role
    {
        /// <summary>
        /// شناسه نقش
        /// </summary>
        public int RoleId { get; set; }

        /// <summary>
        /// نام نقش
        /// </summary>
        public string RoleName { get; set; } = null!;

        /// <summary>
        /// توضیحات نقش
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// لیست دسترسی‌ها
        /// </summary>
        public List<int> PermissionIds { get; set; } = [];

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
