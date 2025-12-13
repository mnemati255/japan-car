using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

public partial class Menu
{
    public int MenuId { get; set; }

    public int? ParentId { get; set; }

    public string? MenuKey { get; set; }

    public string? Url { get; set; }

    public string? Icon { get; set; }

    public int? OrderIndex { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedDate { get; set; }
}
