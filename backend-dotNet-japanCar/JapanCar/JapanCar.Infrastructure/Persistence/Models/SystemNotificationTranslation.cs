using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

public partial class SystemNotificationTranslation
{
    public int SystemNotificationTranslationId { get; set; }

    public int SystemNotificationId { get; set; }

    public string Message { get; set; } = null!;

    public int LanguageId { get; set; }

    public virtual Language Language { get; set; } = null!;

    public virtual SystemNotification SystemNotification { get; set; } = null!;
}
