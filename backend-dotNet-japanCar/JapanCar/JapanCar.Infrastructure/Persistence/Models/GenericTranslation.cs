using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

public partial class GenericTranslation
{
    /// <summary>
    /// شناسه ترجمه
    /// </summary>
    public int TranslationId { get; set; }

    /// <summary>
    /// نام موجودیت
    /// </summary>
    public string EntityName { get; set; } = null!;

    /// <summary>
    /// شناسه موجودیت
    /// </summary>
    public int EntityId { get; set; }

    /// <summary>
    /// شناسه زبان
    /// </summary>
    public int LanguageId { get; set; }

    /// <summary>
    /// نام فیلد
    /// </summary>
    public string FieldName { get; set; } = null!;

    /// <summary>
    /// مقدار ترجمه شده
    /// </summary>
    public string? TranslatedValue { get; set; }

    /// <summary>
    /// تاریخ ایجاد
    /// </summary>
    public DateTime CreatedDate { get; set; }

    /// <summary>
    /// تاریخ ویرایش
    /// </summary>
    public DateTime? ModifiedDate { get; set; }

    public virtual Language Language { get; set; } = null!;
}
