namespace JapanCar.Application.DTOs
{
    public class RepairDto
    {
        public int RepairId { get; set; }
        public int CarId { get; set; }
        public string RepairDate { get; set; } = null!;
        public string? MechanicTechnicalNote { get; set; }
        public int? MechanicId { get; set; }
        public int? SteeringReplacerId { get; set; }
        public int? DashboardReplacerId { get; set; }
        public List<RepairedPartDto> Parts { get; set; } = [];
        public decimal? MechanicWorkHours { get; set; }
        public decimal? MechanicLaborCost { get; set; }


        public string? MechanicName { get; set; }
        public string? SteeringReplacerName { get; set; }
        public string? DashboardReplacerName { get; set; }
        public DateTime? CreatedAt { get; set; }
    }

    public class RepairedPartDto
    {
        public int? CarPartId { get; set; }
        public int PartId { get; set; }
        public decimal PartCost { get; set; }
        public int? MechanicId { get; set; }
        public int? PartCount { get; set; }
    }
}
