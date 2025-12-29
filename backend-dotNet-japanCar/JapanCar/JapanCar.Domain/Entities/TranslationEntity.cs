namespace JapanCar.Domain.Entities
{
    public class TranslationEntity
    {
        public string EntityName { get; set; } = null!;

        public string? LanguageCode { get; set; }

        public string FieldName { get; set; } = null!;

        public string? TranslatedValue { get; set; }

        public string? Category { get; set; }
    }
}
