using System;
using System.Collections.Generic;

namespace JapanCar.Infrastructure.Persistence.Models;

public partial class User
{
    /// <summary>
    /// شناسه کاربر
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// نام کاربری
    /// </summary>
    public string UserName { get; set; } = null!;

    /// <summary>
    /// رمز عبور هش شده
    /// </summary>
    public string PasswordHash { get; set; } = null!;

    /// <summary>
    /// ایمیل کاربر
    /// </summary>
    public string? Email { get; set; }

    /// <summary>
    /// فعال/غیرفعال
    /// </summary>
    public bool IsActive { get; set; }

    /// <summary>
    /// تاریخ ایجاد
    /// </summary>
    public DateTime CreatedDate { get; set; }

    /// <summary>
    /// تاریخ ویرایش
    /// </summary>
    public DateTime? ModifiedDate { get; set; }

    public virtual ICollection<Auction> AuctionCreatedByNavigations { get; set; } = new List<Auction>();

    public virtual ICollection<Auction> AuctionModifiedByNavigations { get; set; } = new List<Auction>();

    public virtual ICollection<Car> CarActionSentByUsers { get; set; } = new List<Car>();

    public virtual ICollection<CarAuctionDetail> CarAuctionDetailCreatedByNavigations { get; set; } = new List<CarAuctionDetail>();

    public virtual ICollection<CarAuctionDetail> CarAuctionDetailModifiedByNavigations { get; set; } = new List<CarAuctionDetail>();

    public virtual ICollection<CarBrand> CarBrandCreatedByNavigations { get; set; } = new List<CarBrand>();

    public virtual ICollection<CarBrand> CarBrandModifiedByNavigations { get; set; } = new List<CarBrand>();

    public virtual ICollection<CarColor> CarColorCreatedByNavigations { get; set; } = new List<CarColor>();

    public virtual ICollection<CarColor> CarColorModifiedByNavigations { get; set; } = new List<CarColor>();

    public virtual ICollection<Car> CarCreatedByNavigations { get; set; } = new List<Car>();

    public virtual ICollection<CarImage> CarImageCreatedByNavigations { get; set; } = new List<CarImage>();

    public virtual ICollection<CarImage> CarImageModifiedByNavigations { get; set; } = new List<CarImage>();

    public virtual ICollection<CarModel> CarModelCreatedByNavigations { get; set; } = new List<CarModel>();

    public virtual ICollection<CarModel> CarModelModifiedByNavigations { get; set; } = new List<CarModel>();

    public virtual ICollection<Car> CarModifiedByNavigations { get; set; } = new List<Car>();

    public virtual ICollection<Car> CarMunicipalitySentByUsers { get; set; } = new List<Car>();

    public virtual ICollection<Car> CarPlateRevokedByUsers { get; set; } = new List<Car>();

    public virtual ICollection<CarRepairHistory> CarRepairHistoryCreatedByNavigations { get; set; } = new List<CarRepairHistory>();

    public virtual ICollection<CarRepairHistory> CarRepairHistoryModifiedByNavigations { get; set; } = new List<CarRepairHistory>();

    public virtual ICollection<Customer> CustomerCreatedByNavigations { get; set; } = new List<Customer>();

    public virtual ICollection<Customer> CustomerModifiedByNavigations { get; set; } = new List<Customer>();

    public virtual ICollection<Mechanic> MechanicCreatedByNavigations { get; set; } = new List<Mechanic>();

    public virtual ICollection<Mechanic> MechanicModifiedByNavigations { get; set; } = new List<Mechanic>();

    public virtual ICollection<Part> PartCreatedByNavigations { get; set; } = new List<Part>();

    public virtual ICollection<Part> PartModifiedByNavigations { get; set; } = new List<Part>();

    public virtual ICollection<Permission> PermissionCreatedByNavigations { get; set; } = new List<Permission>();

    public virtual ICollection<Permission> PermissionModifiedByNavigations { get; set; } = new List<Permission>();

    public virtual ICollection<Role> RoleCreatedByNavigations { get; set; } = new List<Role>();

    public virtual ICollection<Role> RoleModifiedByNavigations { get; set; } = new List<Role>();

    public virtual ICollection<RolePermission> RolePermissionCreatedByNavigations { get; set; } = new List<RolePermission>();

    public virtual ICollection<RolePermission> RolePermissionModifiedByNavigations { get; set; } = new List<RolePermission>();

    public virtual ICollection<SystemNotification> SystemNotifications { get; set; } = new List<SystemNotification>();

    public virtual ICollection<UserRole> UserRoleCreatedByNavigations { get; set; } = new List<UserRole>();

    public virtual ICollection<UserRole> UserRoleModifiedByNavigations { get; set; } = new List<UserRole>();

    public virtual ICollection<UserRole> UserRoleUsers { get; set; } = new List<UserRole>();
}
