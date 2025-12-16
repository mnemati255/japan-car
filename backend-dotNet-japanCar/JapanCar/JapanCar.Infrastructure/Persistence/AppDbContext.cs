using System;
using System.Collections.Generic;
using JapanCar.Infrastructure.Persistence.Models;
using Microsoft.EntityFrameworkCore;

namespace JapanCar.Infrastructure.Persistence;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Auction> Auctions { get; set; }

    public virtual DbSet<AuctionsTranslation> AuctionsTranslations { get; set; }

    public virtual DbSet<Car> Cars { get; set; }

    public virtual DbSet<CarAuctionDetail> CarAuctionDetails { get; set; }

    public virtual DbSet<CarBrand> CarBrands { get; set; }

    public virtual DbSet<CarBrandTranslation> CarBrandTranslations { get; set; }

    public virtual DbSet<CarColor> CarColors { get; set; }

    public virtual DbSet<CarColorTranslation> CarColorTranslations { get; set; }

    public virtual DbSet<CarImage> CarImages { get; set; }

    public virtual DbSet<CarModel> CarModels { get; set; }

    public virtual DbSet<CarModelTranslation> CarModelTranslations { get; set; }

    public virtual DbSet<CarPart> CarParts { get; set; }

    public virtual DbSet<CarRepairHistory> CarRepairHistories { get; set; }

    public virtual DbSet<CarRepairHistoryTranslation> CarRepairHistoryTranslations { get; set; }

    public virtual DbSet<Customer> Customers { get; set; }

    public virtual DbSet<GenericTranslation> GenericTranslations { get; set; }

    public virtual DbSet<Language> Languages { get; set; }

    public virtual DbSet<Mechanic> Mechanics { get; set; }

    public virtual DbSet<Menu> Menus { get; set; }

    public virtual DbSet<Part> Parts { get; set; }

    public virtual DbSet<PartTranslation> PartTranslations { get; set; }

    public virtual DbSet<Permission> Permissions { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<RolePermission> RolePermissions { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserRole> UserRoles { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=185.231.115.136;Database=JapanCarDB;TrustServerCertificate=true;user id=sa;password=NewPassword@1");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Auction>(entity =>
        {
            entity.HasKey(e => e.AuctionId).HasName("PK__Auctions__51004A4CBF5ED6CA");

            entity.Property(e => e.AuctionId).HasComment("شناسه حراج");
            entity.Property(e => e.CreatedBy).HasComment("ایجاد شده توسط");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasComment("تاریخ ایجاد")
                .HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy).HasComment("ویرایش شده توسط");
            entity.Property(e => e.ModifiedDate)
                .HasComment("تاریخ ویرایش")
                .HasColumnType("datetime");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.AuctionCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Auctions_CreatedBy");

            entity.HasOne(d => d.ModifiedByNavigation).WithMany(p => p.AuctionModifiedByNavigations)
                .HasForeignKey(d => d.ModifiedBy)
                .HasConstraintName("FK_Auctions_ModifiedBy");
        });

        modelBuilder.Entity<AuctionsTranslation>(entity =>
        {
            entity.HasKey(e => e.AuctionTranslationId).HasName("PK__AuctionsTranslation__51004A4CBF5ED6CA");

            entity.ToTable("AuctionsTranslation");

            entity.Property(e => e.AuctionTranslationId).HasComment("شناسه حراج");
            entity.Property(e => e.AuctionDate).HasComment("تاریخ برگزاری حراج");
            entity.Property(e => e.AuctionFee)
                .HasComment("کارمزد حراج")
                .HasColumnType("decimal(18, 2)");
            entity.Property(e => e.AuctionName)
                .HasMaxLength(400)
                .HasComment("نام حراج");

            entity.HasOne(d => d.Auction).WithMany(p => p.AuctionsTranslations)
                .HasForeignKey(d => d.AuctionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AuctionsTranslation_Auctions");

            entity.HasOne(d => d.Language).WithMany(p => p.AuctionsTranslations)
                .HasForeignKey(d => d.LanguageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AuctionsTranslation_Languages");
        });

        modelBuilder.Entity<Car>(entity =>
        {
            entity.HasKey(e => e.CarId).HasName("PK__Cars__68A0342E1EC2C699");

            entity.Property(e => e.CarId).HasComment("شناسه خودرو");
            entity.Property(e => e.ChassisNumber)
                .HasMaxLength(100)
                .HasComment("شماره شاسی");
            entity.Property(e => e.ColorId).HasComment("شناسه رنگ خودرو");
            entity.Property(e => e.CreatedBy).HasComment("ایجاد شده توسط");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasComment("تاریخ ایجاد")
                .HasColumnType("datetime");
            entity.Property(e => e.EngineVolume).HasComment("حجم موتور");
            entity.Property(e => e.FuelType)
                .HasMaxLength(100)
                .HasComment("نوع سوخت");
            entity.Property(e => e.HasInsurance).HasComment("وضعیت داشتن بیمه‌نامه (1 = دارد، 0 = ندارد)");
            entity.Property(e => e.InsuranceExpireDate)
                .HasComment("تاریخ انقضای بیمه خودرو")
                .HasColumnType("datetime");
            entity.Property(e => e.InsurancePolicyNumber)
                .HasMaxLength(100)
                .HasComment("شماره بیمه‌نامه خودرو");
            entity.Property(e => e.InsuranceStartDate)
                .HasComment("تاریخ شروع اعتبار بیمه خودرو")
                .HasColumnType("datetime");
            entity.Property(e => e.ManufactureMonth).HasComment("ماه ساخت خودرو (عدد بین 1 تا 12)");
            entity.Property(e => e.Mileage).HasComment("کارکرد خودرو");
            entity.Property(e => e.ModelId).HasComment("شناسه مدل خودرو");
            entity.Property(e => e.ModifiedBy).HasComment("ویرایش شده توسط");
            entity.Property(e => e.ModifiedDate)
                .HasComment("تاریخ ویرایش")
                .HasColumnType("datetime");
            entity.Property(e => e.PlateNumber)
                .HasMaxLength(50)
                .HasComment("Vehicle plate number (may include letters and numbers)");
            entity.Property(e => e.PlateType).HasComment("نوع پلاک خودرو (شخصی، عمومی/کار، اجاره‌ای، صادراتی و ...)");
            entity.Property(e => e.TransmissionType)
                .HasMaxLength(50)
                .HasComment("نوع گیربکس خودرو (اتوماتیک، دستی، CVT و ...)");
            entity.Property(e => e.Year).HasComment("سال ساخت");

            entity.HasOne(d => d.Color).WithMany(p => p.Cars)
                .HasForeignKey(d => d.ColorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Cars__ColorId__5629CD9C");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.CarCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_Cars_CreatedBy");

            entity.HasOne(d => d.Model).WithMany(p => p.Cars)
                .HasForeignKey(d => d.ModelId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Cars__ModelId__5535A963");

            entity.HasOne(d => d.ModifiedByNavigation).WithMany(p => p.CarModifiedByNavigations)
                .HasForeignKey(d => d.ModifiedBy)
                .HasConstraintName("FK_Cars_ModifiedBy");
        });

        modelBuilder.Entity<CarAuctionDetail>(entity =>
        {
            entity.HasKey(e => e.CarAuctionId).HasName("PK__CarAucti__9022063488849333");

            entity.Property(e => e.CarAuctionId).HasComment("شناسه حراج خودرو");
            entity.Property(e => e.AuctionId).HasComment("شناسه حراج");
            entity.Property(e => e.AuctionPrice).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CarId).HasComment("شناسه خودرو");
            entity.Property(e => e.CreatedBy).HasComment("ایجاد شده توسط");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasComment("تاریخ ایجاد")
                .HasColumnType("datetime");
            entity.Property(e => e.FinalPrice)
                .HasComment("قیمت نهایی")
                .HasColumnType("decimal(19, 2)");
            entity.Property(e => e.ModifiedBy).HasComment("ویرایش شده توسط");
            entity.Property(e => e.ModifiedDate)
                .HasComment("تاریخ ویرایش")
                .HasColumnType("datetime");
            entity.Property(e => e.PurchaseDate)
                .HasComment("تاریخ نهایی خرید خودرو در فرآیند مزایده / معامله")
                .HasColumnType("datetime");
            entity.Property(e => e.PurchasePrice)
                .HasComment("قیمت خرید")
                .HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ScrapCost).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.TaxAmount)
                .HasComment("مبلغ مالیات")
                .HasColumnType("decimal(18, 2)");
            entity.Property(e => e.TransportPrice)
                .HasComment("قیمت خرید")
                .HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Auction).WithMany(p => p.CarAuctionDetails)
                .HasForeignKey(d => d.AuctionId)
                .HasConstraintName("FK__CarAuctio__Aucti__5DCAEF64");

            entity.HasOne(d => d.Car).WithMany(p => p.CarAuctionDetails)
                .HasForeignKey(d => d.CarId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CarAuctio__CarId__5CD6CB2B");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.CarAuctionDetailCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_CarAuctionDetails_CreatedBy");

            entity.HasOne(d => d.ModifiedByNavigation).WithMany(p => p.CarAuctionDetailModifiedByNavigations)
                .HasForeignKey(d => d.ModifiedBy)
                .HasConstraintName("FK_CarAuctionDetails_ModifiedBy");
        });

        modelBuilder.Entity<CarBrand>(entity =>
        {
            entity.HasKey(e => e.BrandId).HasName("PK__CarBrand__DAD4F05E5FE11156");

            entity.Property(e => e.BrandId).HasComment("شناسه برند خودرو");
            entity.Property(e => e.CreatedBy).HasComment("ایجاد شده توسط");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasComment("تاریخ ایجاد")
                .HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy).HasComment("ویرایش شده توسط");
            entity.Property(e => e.ModifiedDate)
                .HasComment("تاریخ ویرایش")
                .HasColumnType("datetime");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.CarBrandCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_CarBrands_CreatedBy");

            entity.HasOne(d => d.ModifiedByNavigation).WithMany(p => p.CarBrandModifiedByNavigations)
                .HasForeignKey(d => d.ModifiedBy)
                .HasConstraintName("FK_CarBrands_ModifiedBy");
        });

        modelBuilder.Entity<CarBrandTranslation>(entity =>
        {
            entity.ToTable("CarBrandTranslation");

            entity.Property(e => e.BrandName)
                .HasMaxLength(200)
                .HasComment("نام برند خودرو");

            entity.HasOne(d => d.Brand).WithMany(p => p.CarBrandTranslations)
                .HasForeignKey(d => d.BrandId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CarBrandTranslation_CarBrands");

            entity.HasOne(d => d.Language).WithMany(p => p.CarBrandTranslations)
                .HasForeignKey(d => d.LanguageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CarBrandTranslation_Languages");
        });

        modelBuilder.Entity<CarColor>(entity =>
        {
            entity.HasKey(e => e.ColorId).HasName("PK__CarColor__8DA7674DCC0D73B3");

            entity.Property(e => e.ColorId).HasComment("شناسه رنگ خودرو");
            entity.Property(e => e.CreatedBy).HasComment("ایجاد شده توسط");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy).HasComment("ویرایش شده توسط");
            entity.Property(e => e.ModifiedDate)
                .HasComment("تاریخ ویرایش")
                .HasColumnType("datetime");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.CarColorCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_CarColors_CreatedBy");

            entity.HasOne(d => d.ModifiedByNavigation).WithMany(p => p.CarColorModifiedByNavigations)
                .HasForeignKey(d => d.ModifiedBy)
                .HasConstraintName("FK_CarColors_ModifiedBy");
        });

        modelBuilder.Entity<CarColorTranslation>(entity =>
        {
            entity.ToTable("CarColorTranslation");

            entity.Property(e => e.ColorName).HasMaxLength(200);

            entity.HasOne(d => d.CarColor).WithMany(p => p.CarColorTranslations)
                .HasForeignKey(d => d.CarColorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CarColorTranslation_CarColors");

            entity.HasOne(d => d.Language).WithMany(p => p.CarColorTranslations)
                .HasForeignKey(d => d.LanguageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CarColorTranslation_Languages");
        });

        modelBuilder.Entity<CarImage>(entity =>
        {
            entity.HasKey(e => e.ImageId).HasName("PK__CarImage__7516F70CEB8EB161");

            entity.Property(e => e.ImageId).HasComment("شناسه تصویر خودرو");
            entity.Property(e => e.CarId).HasComment("شناسه خودرو");
            entity.Property(e => e.CreatedBy).HasComment("ایجاد شده توسط");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasComment("تاریخ ایجاد")
                .HasColumnType("datetime");
            entity.Property(e => e.ImageUrl)
                .HasMaxLength(1000)
                .HasComment("آدرس تصویر");
            entity.Property(e => e.IsPrimary)
                .HasDefaultValue(false)
                .HasComment("آیا تصویر اصلی است؟");
            entity.Property(e => e.ModifiedBy).HasComment("ویرایش شده توسط");
            entity.Property(e => e.ModifiedDate)
                .HasComment("تاریخ ویرایش")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Car).WithMany(p => p.CarImages)
                .HasForeignKey(d => d.CarId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CarImages__CarId__628FA481");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.CarImageCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_CarImages_CreatedBy");

            entity.HasOne(d => d.ModifiedByNavigation).WithMany(p => p.CarImageModifiedByNavigations)
                .HasForeignKey(d => d.ModifiedBy)
                .HasConstraintName("FK_CarImages_ModifiedBy");
        });

        modelBuilder.Entity<CarModel>(entity =>
        {
            entity.HasKey(e => e.ModelId).HasName("PK__CarModel__E8D7A12C30C66C23");

            entity.Property(e => e.ModelId).HasComment("شناسه مدل خودرو");
            entity.Property(e => e.BrandId).HasComment("شناسه برند خودرو");
            entity.Property(e => e.CreatedBy).HasComment("ایجاد شده توسط");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasComment("تاریخ ایجاد")
                .HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy).HasComment("ویرایش شده توسط");
            entity.Property(e => e.ModifiedDate)
                .HasComment("تاریخ ویرایش")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Brand).WithMany(p => p.CarModels)
                .HasForeignKey(d => d.BrandId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CarModels__Brand__4E88ABD4");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.CarModelCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_CarModels_CreatedBy");

            entity.HasOne(d => d.ModifiedByNavigation).WithMany(p => p.CarModelModifiedByNavigations)
                .HasForeignKey(d => d.ModifiedBy)
                .HasConstraintName("FK_CarModels_ModifiedBy");
        });

        modelBuilder.Entity<CarModelTranslation>(entity =>
        {
            entity.ToTable("CarModelTranslation");

            entity.Property(e => e.ModelName)
                .HasMaxLength(300)
                .HasComment("نام مدل خودرو");

            entity.HasOne(d => d.CarModel).WithMany(p => p.CarModelTranslations)
                .HasForeignKey(d => d.CarModelId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CarModelTranslation_CarModels");

            entity.HasOne(d => d.Language).WithMany(p => p.CarModelTranslations)
                .HasForeignKey(d => d.LanguageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CarModelTranslation_Languages");
        });

        modelBuilder.Entity<CarPart>(entity =>
        {
            entity.Property(e => e.CarPartId).HasComment("CarPart Id");
            entity.Property(e => e.MechanicId).HasComment("شناسه مکانیک");
            entity.Property(e => e.PartCost)
                .HasComment("هزینه قطعه")
                .HasColumnType("decimal(18, 2)");
            entity.Property(e => e.PartCount).HasComment("تعداد قطعه");
            entity.Property(e => e.PartId).HasComment("شناسه قطعه");

            entity.HasOne(d => d.CarRepairHistory).WithMany(p => p.CarParts)
                .HasForeignKey(d => d.CarRepairHistoryId)
                .HasConstraintName("FK_CarParts_CarRepairHistory");

            entity.HasOne(d => d.Part).WithMany(p => p.CarParts)
                .HasForeignKey(d => d.PartId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CarParts_Parts");
        });

        modelBuilder.Entity<CarRepairHistory>(entity =>
        {
            entity.HasKey(e => e.RepairId).HasName("PK__CarRepai__07D0BC2DF81F562C");

            entity.ToTable("CarRepairHistory");

            entity.Property(e => e.RepairId).HasComment("شناسه تعمیر");
            entity.Property(e => e.CarId).HasComment("شناسه خودرو");
            entity.Property(e => e.CreatedBy).HasComment("ایجاد شده توسط");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasComment("تاریخ ایجاد")
                .HasColumnType("datetime");
            entity.Property(e => e.DashboardReplacerId).HasComment("تعویض‌کننده داشبورد");
            entity.Property(e => e.MechanicId).HasComment("شناسه مکانیک");
            entity.Property(e => e.ModifiedBy).HasComment("ویرایش شده توسط");
            entity.Property(e => e.ModifiedDate)
                .HasComment("تاریخ ویرایش")
                .HasColumnType("datetime");
            entity.Property(e => e.RepairDate).HasComment("تاریخ تعمیر");
            entity.Property(e => e.SteeringReplacerId).HasComment("تعویض‌کننده فرمان");

            entity.HasOne(d => d.Car).WithMany(p => p.CarRepairHistories)
                .HasForeignKey(d => d.CarId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CarRepairHistory_Cars");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.CarRepairHistoryCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_CarRepairHistory_CreatedBy");

            entity.HasOne(d => d.DashboardReplacer).WithMany(p => p.CarRepairHistoryDashboardReplacers)
                .HasForeignKey(d => d.DashboardReplacerId)
                .HasConstraintName("FK_CarRepairHistory_Mechanics2");

            entity.HasOne(d => d.Mechanic).WithMany(p => p.CarRepairHistoryMechanics)
                .HasForeignKey(d => d.MechanicId)
                .HasConstraintName("FK_CarRepairHistory_Mechanics");

            entity.HasOne(d => d.ModifiedByNavigation).WithMany(p => p.CarRepairHistoryModifiedByNavigations)
                .HasForeignKey(d => d.ModifiedBy)
                .HasConstraintName("FK_CarRepairHistory_ModifiedBy");

            entity.HasOne(d => d.SteeringReplacer).WithMany(p => p.CarRepairHistorySteeringReplacers)
                .HasForeignKey(d => d.SteeringReplacerId)
                .HasConstraintName("FK_CarRepairHistory_Mechanics1");
        });

        modelBuilder.Entity<CarRepairHistoryTranslation>(entity =>
        {
            entity.ToTable("CarRepairHistoryTranslation");

            entity.Property(e => e.CarRepairHistoryTranslationId).HasComment("CarRepairHistoryTranslation Id");
            entity.Property(e => e.LanguageId).HasComment("Language Id");
            entity.Property(e => e.MechanicTechnicalNote).HasComment("یادداشت فنی مکانیک");
            entity.Property(e => e.RepairId).HasComment("شناسه تعمیر");

            entity.HasOne(d => d.Language).WithMany(p => p.CarRepairHistoryTranslations)
                .HasForeignKey(d => d.LanguageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CarRepairHistoryTranslation_Languages");

            entity.HasOne(d => d.Repair).WithMany(p => p.CarRepairHistoryTranslations)
                .HasForeignKey(d => d.RepairId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CarRepairHistoryTranslation_CarRepairHistory");
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.CustomerId).HasName("PK__Customer__A4AE64D86BB68BC9");

            entity.Property(e => e.CustomerId).HasComment("شناسه مشتری");
            entity.Property(e => e.Address)
                .HasMaxLength(1000)
                .HasComment("آدرس مشتری");
            entity.Property(e => e.CreatedBy).HasComment("ایجاد شده توسط");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasComment("تاریخ ایجاد")
                .HasColumnType("datetime");
            entity.Property(e => e.Email)
                .HasMaxLength(400)
                .HasComment("ایمیل مشتری");
            entity.Property(e => e.FirstName)
                .HasMaxLength(200)
                .HasComment("نام مشتری");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasComment("فعال/غیرفعال");
            entity.Property(e => e.LastName)
                .HasMaxLength(200)
                .HasComment("نام خانوادگی مشتری");
            entity.Property(e => e.ModifiedBy).HasComment("ویرایش شده توسط");
            entity.Property(e => e.ModifiedDate)
                .HasComment("تاریخ ویرایش")
                .HasColumnType("datetime");
            entity.Property(e => e.Phone)
                .HasMaxLength(100)
                .HasComment("شماره تماس مشتری");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.CustomerCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_Customers_CreatedBy");

            entity.HasOne(d => d.ModifiedByNavigation).WithMany(p => p.CustomerModifiedByNavigations)
                .HasForeignKey(d => d.ModifiedBy)
                .HasConstraintName("FK_Customers_ModifiedBy");
        });

        modelBuilder.Entity<GenericTranslation>(entity =>
        {
            entity.HasKey(e => e.TranslationId).HasName("PK__GenericT__663DA04C09227C28");

            entity.ToTable("GenericTranslation");

            entity.Property(e => e.TranslationId).HasComment("شناسه ترجمه");
            entity.Property(e => e.Category).HasMaxLength(100);
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasComment("تاریخ ایجاد")
                .HasColumnType("datetime");
            entity.Property(e => e.EntityName)
                .HasMaxLength(200)
                .HasComment("نام موجودیت");
            entity.Property(e => e.FieldName)
                .HasMaxLength(200)
                .HasComment("نام فیلد");
            entity.Property(e => e.LanguageId).HasComment("شناسه زبان");
            entity.Property(e => e.ModifiedDate)
                .HasComment("تاریخ ویرایش")
                .HasColumnType("datetime");
            entity.Property(e => e.TranslatedValue).HasComment("مقدار ترجمه شده");

            entity.HasOne(d => d.Language).WithMany(p => p.GenericTranslations)
                .HasForeignKey(d => d.LanguageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_GenericTranslation_Language");
        });

        modelBuilder.Entity<Language>(entity =>
        {
            entity.HasKey(e => e.LanguageId).HasName("PK__Language__B93855AB9868BF22");

            entity.Property(e => e.LanguageId).HasComment("شناسه زبان");
            entity.Property(e => e.Code)
                .HasMaxLength(20)
                .HasComment("کد زبان");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasComment("تاریخ ایجاد")
                .HasColumnType("datetime");
            entity.Property(e => e.ModifiedDate)
                .HasComment("تاریخ ویرایش")
                .HasColumnType("datetime");
            entity.Property(e => e.Name)
                .HasMaxLength(200)
                .HasComment("نام زبان");
        });

        modelBuilder.Entity<Mechanic>(entity =>
        {
            entity.HasKey(e => e.MechanicId).HasName("PK__Mechanic__6B040DF15A87087C");

            entity.Property(e => e.MechanicId).HasComment("شناسه مکانیک");
            entity.Property(e => e.Contact)
                .HasMaxLength(200)
                .HasComment("اطلاعات تماس");
            entity.Property(e => e.CreatedBy).HasComment("کاربر ایجاد کننده");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasComment("تاریخ ایجاد")
                .HasColumnType("datetime");
            entity.Property(e => e.MechanicName)
                .HasMaxLength(400)
                .HasComment("نام مکانیک");
            entity.Property(e => e.ModifiedBy).HasComment("کاربر ویرایش کننده");
            entity.Property(e => e.ModifiedDate)
                .HasComment("تاریخ ویرایش")
                .HasColumnType("datetime");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.MechanicCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_Mechanic_CreatedBy");

            entity.HasOne(d => d.ModifiedByNavigation).WithMany(p => p.MechanicModifiedByNavigations)
                .HasForeignKey(d => d.ModifiedBy)
                .HasConstraintName("FK_Mechanic_ModifiedBy");
        });

        modelBuilder.Entity<Menu>(entity =>
        {
            entity.HasKey(e => e.MenuId).HasName("PK__Menus__C99ED230F38E6BC4");

            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Icon).HasMaxLength(50);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.MenuKey).HasMaxLength(100);
            entity.Property(e => e.Url).HasMaxLength(255);
        });

        modelBuilder.Entity<Part>(entity =>
        {
            entity.HasKey(e => e.PartId).HasName("PK__Part__7C3F0D5062CB50D8");

            entity.Property(e => e.PartId).HasComment("شناسه قطعه");
            entity.Property(e => e.CreatedBy).HasComment("کاربر ایجاد کننده");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasComment("تاریخ ایجاد")
                .HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy).HasComment("کاربر ویرایش کننده");
            entity.Property(e => e.ModifiedDate)
                .HasComment("تاریخ ویرایش")
                .HasColumnType("datetime");
            entity.Property(e => e.PartPrice)
                .HasComment("قیمت قطعه")
                .HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.PartCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_Part_CreatedBy");

            entity.HasOne(d => d.ModifiedByNavigation).WithMany(p => p.PartModifiedByNavigations)
                .HasForeignKey(d => d.ModifiedBy)
                .HasConstraintName("FK_Part_ModifiedBy");
        });

        modelBuilder.Entity<PartTranslation>(entity =>
        {
            entity.ToTable("PartTranslation");

            entity.Property(e => e.PartTranslationId).HasComment("PartTranslation Id");
            entity.Property(e => e.LanguageId).HasComment("Language Id");
            entity.Property(e => e.PartDescription).HasComment("توضیحات قطعه");
            entity.Property(e => e.PartId).HasComment("شناسه قطعه");
            entity.Property(e => e.PartName)
                .HasMaxLength(400)
                .HasComment("نام قطعه");

            entity.HasOne(d => d.Language).WithMany(p => p.PartTranslations)
                .HasForeignKey(d => d.LanguageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PartTranslation_Languages");

            entity.HasOne(d => d.Part).WithMany(p => p.PartTranslations)
                .HasForeignKey(d => d.PartId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PartTranslation_Parts");
        });

        modelBuilder.Entity<Permission>(entity =>
        {
            entity.HasKey(e => e.PermissionId).HasName("PK__Permissi__EFA6FB2F5CE7709E");

            entity.Property(e => e.PermissionId).HasComment("شناسه دسترسی");
            entity.Property(e => e.Code)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasComment("کد دسترسی");
            entity.Property(e => e.CreatedBy).HasComment("کاربر ایجاد کننده");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasComment("تاریخ ایجاد")
                .HasColumnType("datetime");
            entity.Property(e => e.Description)
                .HasMaxLength(1000)
                .HasComment("توضیحات دسترسی");
            entity.Property(e => e.ModifiedBy).HasComment("کاربر ویرایش کننده");
            entity.Property(e => e.ModifiedDate)
                .HasComment("تاریخ ویرایش")
                .HasColumnType("datetime");
            entity.Property(e => e.PermissionName)
                .HasMaxLength(200)
                .HasComment("نام دسترسی");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.PermissionCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_Permissions_CreatedBy");

            entity.HasOne(d => d.ModifiedByNavigation).WithMany(p => p.PermissionModifiedByNavigations)
                .HasForeignKey(d => d.ModifiedBy)
                .HasConstraintName("FK_Permissions_ModifiedBy");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__Roles__8AFACE1A6CFD4231");

            entity.Property(e => e.RoleId).HasComment("شناسه نقش");
            entity.Property(e => e.CreatedBy).HasComment("کاربر ایجاد کننده");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasComment("تاریخ ایجاد")
                .HasColumnType("datetime");
            entity.Property(e => e.Description)
                .HasMaxLength(1000)
                .HasComment("توضیحات نقش");
            entity.Property(e => e.ModifiedBy).HasComment("کاربر ویرایش کننده");
            entity.Property(e => e.ModifiedDate)
                .HasComment("تاریخ ویرایش")
                .HasColumnType("datetime");
            entity.Property(e => e.RoleName)
                .HasMaxLength(200)
                .HasComment("نام نقش");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.RoleCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_Roles_CreatedBy");

            entity.HasOne(d => d.ModifiedByNavigation).WithMany(p => p.RoleModifiedByNavigations)
                .HasForeignKey(d => d.ModifiedBy)
                .HasConstraintName("FK_Roles_ModifiedBy");
        });

        modelBuilder.Entity<RolePermission>(entity =>
        {
            entity.HasKey(e => e.RolePermissionId).HasName("PK__RolePerm__120F46BAC2DD8B6C");

            entity.Property(e => e.RolePermissionId).HasComment("شناسه دسترسی نقش");
            entity.Property(e => e.CreatedBy).HasComment("کاربر ایجاد کننده");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasComment("تاریخ ایجاد")
                .HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy).HasComment("کاربر ویرایش کننده");
            entity.Property(e => e.ModifiedDate)
                .HasComment("تاریخ ویرایش")
                .HasColumnType("datetime");
            entity.Property(e => e.PermissionId).HasComment("شناسه دسترسی");
            entity.Property(e => e.RoleId).HasComment("شناسه نقش");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.RolePermissionCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_RolePermissions_CreatedBy");

            entity.HasOne(d => d.ModifiedByNavigation).WithMany(p => p.RolePermissionModifiedByNavigations)
                .HasForeignKey(d => d.ModifiedBy)
                .HasConstraintName("FK_RolePermissions_ModifiedBy");

            entity.HasOne(d => d.Permission).WithMany(p => p.RolePermissions)
                .HasForeignKey(d => d.PermissionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__RolePermi__Permi__09A971A2");

            entity.HasOne(d => d.Role).WithMany(p => p.RolePermissions)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__RolePermi__RoleI__08B54D69");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4C095B0997");

            entity.Property(e => e.UserId).HasComment("شناسه کاربر");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasComment("تاریخ ایجاد")
                .HasColumnType("datetime");
            entity.Property(e => e.Email)
                .HasMaxLength(400)
                .HasComment("ایمیل کاربر");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasComment("فعال/غیرفعال");
            entity.Property(e => e.ModifiedDate)
                .HasComment("تاریخ ویرایش")
                .HasColumnType("datetime");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(1000)
                .HasComment("رمز عبور هش شده");
            entity.Property(e => e.UserName)
                .HasMaxLength(200)
                .HasComment("نام کاربری");
        });

        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasKey(e => e.UserRoleId).HasName("PK__UserRole__3D978A358D8B027F");

            entity.Property(e => e.UserRoleId).HasComment("شناسه نقش کاربر");
            entity.Property(e => e.CreatedBy).HasComment("کاربر ایجاد کننده");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasComment("تاریخ ایجاد")
                .HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy).HasComment("کاربر ویرایش کننده");
            entity.Property(e => e.ModifiedDate)
                .HasComment("تاریخ ویرایش")
                .HasColumnType("datetime");
            entity.Property(e => e.RoleId).HasComment("شناسه نقش");
            entity.Property(e => e.UserId).HasComment("شناسه کاربر");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.UserRoleCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_UserRoles_CreatedBy");

            entity.HasOne(d => d.ModifiedByNavigation).WithMany(p => p.UserRoleModifiedByNavigations)
                .HasForeignKey(d => d.ModifiedBy)
                .HasConstraintName("FK_UserRoles_ModifiedBy");

            entity.HasOne(d => d.Role).WithMany(p => p.UserRoles)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserRoles__RoleI__01142BA1");

            entity.HasOne(d => d.User).WithMany(p => p.UserRoleUsers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserRoles__UserI__00200768");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
