using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

public partial class SystemNotification
{
    /// <summary>
    /// Notification Id
    /// </summary>
    public int NotificationId { get; set; }

    /// <summary>
    /// Car Id
    /// </summary>
    public int CarId { get; set; }

    /// <summary>
    /// Notification Type
    /// </summary>
    public byte NotificationType { get; set; }

    /// <summary>
    /// Is Resolved
    /// </summary>
    public bool IsResolved { get; set; }

    /// <summary>
    /// Due Date
    /// </summary>
    public DateTime DueDate { get; set; }

    /// <summary>
    /// Created Date
    /// </summary>
    public DateTime CreatedDate { get; set; }

    /// <summary>
    /// Resolved Date
    /// </summary>
    public DateTime? ResolvedDate { get; set; }

    public int? ResolvedBy { get; set; }

    public virtual Car Car { get; set; } = null!;

    public virtual User? ResolvedByNavigation { get; set; }

    public virtual ICollection<SystemNotificationTranslation> SystemNotificationTranslations { get; set; } = new List<SystemNotificationTranslation>();
}
