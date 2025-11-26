using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Domain.Entities
{
    public class RolePermissionEntity
    {
        /// <summary>
        /// شناسه دسترسی نقش
        /// </summary>
        public int RolePermissionId { get; set; }

        /// <summary>
        /// شناسه نقش
        /// </summary>
        public int RoleId { get; set; }

        /// <summary>
        /// شناسه دسترسی
        /// </summary>
        public int PermissionId { get; set; }

        /// <summary>
        /// تاریخ ایجاد
        /// </summary>
        public DateTime CreatedDate { get; set; }

        /// <summary>
        /// تاریخ ویرایش
        /// </summary>
        public DateTime? ModifiedDate { get; set; }

        /// <summary>
        /// کاربر ویرایش کننده
        /// </summary>
        public int? ModifiedBy { get; set; }

        public RoleEntity Role { get; set; } = null!;
    }
}
