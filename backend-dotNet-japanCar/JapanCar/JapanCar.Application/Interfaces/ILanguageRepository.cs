namespace JapanCar.Application.Interfaces
{
    public interface ILanguageRepository
    {
        Task<int?> GetLanguageIdByCode(string langCode);
    }
}
