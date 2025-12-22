using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Domain.Entities
{
    public class NotificationEntity
    {
        public int NotificationId { get; set; }
        public int CarId { get; set; }
        public string CarModel { get; set; } = null!;
        public string CarBrand { get; set; } = null!;
        public string CarColor { get; set; } = null!;
        public int CarYear { get; set; }
        public byte NotificationType { get; set; }
        public string Message { get; set; } = null!;
        public bool IsResolved { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ResolvedDate { get; set; }
        public string? ResolvedBy { get; set; }
    }
}
