namespace JapanCar.Domain.Entities
{
    public class GenericTranslationEntity
    {
        public string EntityName { get; set; } = null!;

        public string LanguageCode { get; set; } = null!;

        public string FieldName { get; set; } = null!;

        public string? TranslatedValue { get; set; }

        public string? Category { get; set; }
    }
}
