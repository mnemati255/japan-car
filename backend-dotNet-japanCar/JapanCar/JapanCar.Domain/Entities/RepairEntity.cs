namespace JapanCar.Domain.Entities
{
    public class RepairEntity
    {
        public int RepairId { get; set; }
        public DateOnly RepairDate { get; set; }
        public string? MechanicTechnicalNote { get; set; }
        public int? MechanicId { get; set; }
        public string? MechanicName { get; set; }
        public int? SteeringReplacerId { get; set; }
        public string? SteeringReplacerName { get; set; }
        public int? DashboardReplacerId { get; set; }
        public string? DashboardReplacerName { get; set; }
        public DateTime? CreatedDate { get; set; }       
        public int CarId { get; set; }
        public decimal? MechanicWorkHours { get; set; }
        public decimal? MechanicLaborCost { get; set; }
    }
}
