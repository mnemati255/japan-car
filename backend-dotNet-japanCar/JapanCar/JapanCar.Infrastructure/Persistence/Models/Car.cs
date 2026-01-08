using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

public partial class Car
{
    /// <summary>
    /// شناسه خودرو
    /// </summary>
    public int CarId { get; set; }

    /// <summary>
    /// شناسه مدل خودرو
    /// </summary>
    public int ModelId { get; set; }

    /// <summary>
    /// شناسه رنگ خودرو
    /// </summary>
    public int ColorId { get; set; }

    /// <summary>
    /// شماره شاسی
    /// </summary>
    public string ChassisNumber { get; set; } = null!;

    /// <summary>
    /// سال ساخت
    /// </summary>
    public int Year { get; set; }

    /// <summary>
    /// کارکرد خودرو
    /// </summary>
    public int Mileage { get; set; }

    /// <summary>
    /// حجم موتور
    /// </summary>
    public int? EngineVolume { get; set; }

    /// <summary>
    /// نوع سوخت
    /// </summary>
    public string? FuelType { get; set; }

    /// <summary>
    /// تاریخ ایجاد
    /// </summary>
    public DateTime CreatedDate { get; set; }

    /// <summary>
    /// تاریخ ویرایش
    /// </summary>
    public DateTime? ModifiedDate { get; set; }

    /// <summary>
    /// ایجاد شده توسط
    /// </summary>
    public int? CreatedBy { get; set; }

    /// <summary>
    /// ویرایش شده توسط
    /// </summary>
    public int? ModifiedBy { get; set; }

    /// <summary>
    /// نوع گیربکس خودرو (اتوماتیک، دستی، CVT و ...)
    /// </summary>
    public string? TransmissionType { get; set; }

    /// <summary>
    /// تاریخ انقضای بیمه خودرو
    /// </summary>
    public DateTime? InsuranceExpireDate { get; set; }

    /// <summary>
    /// وضعیت داشتن بیمه‌نامه (1 = دارد، 0 = ندارد)
    /// </summary>
    public bool HasInsurance { get; set; }

    /// <summary>
    /// ماه ساخت خودرو (عدد بین 1 تا 12)
    /// </summary>
    public byte? ManufactureMonth { get; set; }

    /// <summary>
    /// نوع پلاک خودرو (شخصی، عمومی/کار، اجاره‌ای، صادراتی و ...)
    /// </summary>
    public byte? PlateType { get; set; }

    /// <summary>
    /// Vehicle plate number (may include letters and numbers)
    /// </summary>
    public string? PlateNumber { get; set; }

    /// <summary>
    /// For Sale
    /// </summary>
    public byte? ForSale { get; set; }

    /// <summary>
    /// Police Certificate Requested Date
    /// </summary>
    public DateTime? PoliceCertificateRequestedDate { get; set; }

    /// <summary>
    /// Police Certificate Received Date
    /// </summary>
    public DateTime? PoliceCertificateReceivedDate { get; set; }

    /// <summary>
    /// Deed Requested Date
    /// </summary>
    public DateTime? DeedRequestedDate { get; set; }

    /// <summary>
    /// Deed Issued Date
    /// </summary>
    public DateTime? DeedIssuedDate { get; set; }

    /// <summary>
    /// Plate Registere dDate
    /// </summary>
    public DateTime? PlateRegisteredDate { get; set; }

    /// <summary>
    /// Needs Police Certificate
    /// </summary>
    public bool? NeedsPoliceCertificate { get; set; }

    /// <summary>
    /// Sukura Number
    /// </summary>
    public int? SukuraNumber { get; set; }

    /// <summary>
    /// 1-Toyota R 2-Zero R 3- Self Transport
    /// </summary>
    public byte? TransportFrom { get; set; }

    /// <summary>
    /// 1-Osaka -Own yard 3- Hakata
    /// </summary>
    public byte? TransportTo { get; set; }

    /// <summary>
    /// Transport Confirm
    /// </summary>
    public bool? TransportConfirm { get; set; }

    /// <summary>
    /// Transport Date
    /// </summary>
    public DateTime? TransportDate { get; set; }

    /// <summary>
    /// Transport Date
    /// </summary>
    public DateTime? TransportDateReceived { get; set; }

    /// <summary>
    /// SentToMunicipality
    /// </summary>
    public bool SentToMunicipality { get; set; }

    /// <summary>
    /// MunicipalitySentDate
    /// </summary>
    public DateTime? MunicipalitySentDate { get; set; }

    /// <summary>
    /// MunicipalitySentToPerson
    /// </summary>
    public string? MunicipalitySentToPerson { get; set; }

    /// <summary>
    /// MunicipalitySentByUserId
    /// </summary>
    public int? MunicipalitySentByUserId { get; set; }

    /// <summary>
    /// SentToAction
    /// </summary>
    public bool SentToAction { get; set; }

    /// <summary>
    /// ActionSentDate
    /// </summary>
    public DateTime? ActionSentDate { get; set; }

    /// <summary>
    /// ActionSentToPerson
    /// </summary>
    public string? ActionSentToPerson { get; set; }

    /// <summary>
    /// ActionSentByUserId
    /// </summary>
    public int? ActionSentByUserId { get; set; }

    /// <summary>
    /// PlateRevoked
    /// </summary>
    public bool PlateRevoked { get; set; }

    /// <summary>
    /// PlateRevokedDate
    /// </summary>
    public DateTime? PlateRevokedDate { get; set; }

    public int? PlateRevokedByUserId { get; set; }

    /// <summary>
    /// Car grade or classification level (e.g., Standard, Premium, Luxury, etc.)
    /// </summary>
    public string? Grad { get; set; }

    /// <summary>
    /// Numeric score representing the overall evaluation of the car based on technical condition, appearance, brand value, and other system-defined criteria.
    /// </summary>
    public string? Point { get; set; }

    public int? ActionId { get; set; }

    public int? TransportConfirmUserId { get; set; }

    /// <summary>
    /// Police certificate number associated with the vehicle.
    /// </summary>
    public int? PoliceCertificateNumber { get; set; }

    /// <summary>
    /// Action Number
    /// </summary>
    public int? ActionNumber { get; set; }

    /// <summary>
    /// katashaki
    /// </summary>
    public string? Katashaki { get; set; }

    /// <summary>
    /// Municipality Deadline Date
    /// </summary>
    public DateOnly? MunicipalityDeadlineDate { get; set; }

    /// <summary>
    /// Action Deadline Date
    /// </summary>
    public DateOnly? ActionDeadlineDate { get; set; }

    /// <summary>
    /// Plate Revoked DeadLine
    /// </summary>
    public DateOnly? PlateRevokedDeadLine { get; set; }

    /// <summary>
    /// Indicates whether the vehicle has Shaken (technical inspection).
    /// </summary>
    public bool HasShakend { get; set; }

    /// <summary>
    /// Third-party insurance policy number.
    /// </summary>
    public string? ThirdPartyInsuranceNumber { get; set; }

    /// <summary>
    /// Vehicle deed number.
    /// </summary>
    public string? DeedNumber { get; set; }

    /// <summary>
    /// Drive type of the vehicle (e.g. F or S).
    /// </summary>
    public string? CommandType { get; set; }

    /// <summary>
    /// Date when the transport company submitted its request.
    /// </summary>
    public DateTime? TransportCompanyRequestDate { get; set; }

    /// <summary>
    /// New license plate number assigned to the vehicle.
    /// </summary>
    public string? NewPlateNumber { get; set; }

    /// <summary>
    /// Optional description or notes related to the vehicle.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Date when the insurance policy was cancelled.
    /// </summary>
    public DateTime? InsuranceCancellationDate { get; set; }

    /// <summary>
    /// Indicates whether the insurance policy has been cancelled.
    /// </summary>
    public bool IsInsuranceCancelled { get; set; }

    /// <summary>
    /// Indicates whether the deed copy for vehicles under 1000cc has been uploaded to the system.
    /// </summary>
    public bool IsUnder1000CcdeedCopyUploaded { get; set; }

    /// <summary>
    /// Date when the deed certificate was delivered to the police.
    /// </summary>
    public DateTime? PoliceDeedCertificateDeliveryDate { get; set; }

    /// <summary>
    /// Date when the new deed copy was sent to the buyer.
    /// </summary>
    public DateTime? NewDeedCopySentToBuyerDate { get; set; }

    /// <summary>
    /// تاریخ انقضای بیمه
    /// </summary>
    public DateTime? ThirdPartyInsuranceExpireDate { get; set; }

    /// <summary>
    /// شرکت صادرکننده بیمه
    /// </summary>
    public string? ThirdPartyInsuranceCompany { get; set; }

    public virtual Auction? Action { get; set; }

    public virtual User? ActionSentByUser { get; set; }

    public virtual ICollection<CarAuctionDetail> CarAuctionDetails { get; set; } = new List<CarAuctionDetail>();

    public virtual ICollection<CarImage> CarImages { get; set; } = new List<CarImage>();

    public virtual ICollection<CarRepairHistory> CarRepairHistories { get; set; } = new List<CarRepairHistory>();

    public virtual ICollection<CarSale> CarSales { get; set; } = new List<CarSale>();

    public virtual CarColor Color { get; set; } = null!;

    public virtual User? CreatedByNavigation { get; set; }

    public virtual CarModel Model { get; set; } = null!;

    public virtual User? ModifiedByNavigation { get; set; }

    public virtual User? MunicipalitySentByUser { get; set; }

    public virtual User? PlateRevokedByUser { get; set; }

    public virtual ICollection<SystemNotification> SystemNotifications { get; set; } = new List<SystemNotification>();

    public virtual User? TransportConfirmUser { get; set; }
}
