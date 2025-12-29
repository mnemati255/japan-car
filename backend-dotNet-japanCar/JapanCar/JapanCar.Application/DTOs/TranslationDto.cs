using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapanCar.Application.DTOs
{
    public class TranslationDto
    {
        public string EntityName { get; set; } = null!;

        public string? LanguageCode { get; set; }

        public string FieldName { get; set; } = null!;

        public string? TranslatedValue { get; set; }

        public string? Category { get; set; }
    }
}
