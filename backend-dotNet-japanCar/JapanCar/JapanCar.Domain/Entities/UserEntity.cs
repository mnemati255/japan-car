using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Domain.Entities
{
    public class UserEntity
    {
        /// <summary>
        /// شناسه کاربر
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// نام کاربری
        /// </summary>
        public string UserName { get; set; } = null!;

        /// <summary>
        /// رمز عبور هش شده
        /// </summary>
        public string PasswordHash { get; set; } = null!;

        /// <summary>
        /// ایمیل کاربر
        /// </summary>
        public string? Email { get; set; }

        /// <summary>
        /// فعال/غیرفعال
        /// </summary>
        public bool IsActive { get; set; }


        /// <summary>
        /// تاریخ ویرایش
        /// </summary>
        public DateTime? ModifiedDate { get; set; }

        /// <summary>
        /// لیست شناسه نقش‌ها
        /// </summary>
        public List<int> RoleIds { get; set; } = [];

        /// <summary>
        /// تاریخ ایجاد
        /// </summary>
        public DateTime? CreatedDate { get; set; }
    }
}
