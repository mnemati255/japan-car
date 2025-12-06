namespace JapanCar.Application.DTOs
{
    public class ColorDto
    {
        public int ColorId { get; set; }
        public string ColorName { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
    }
}
