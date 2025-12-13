using JapanCar.Api.Filters;
using JapanCar.Api.Helpers;
using JapanCar.Api.Middlewares;
using JapanCar.Api.Services;
using JapanCar.Application;
using JapanCar.Application.Interfaces;
using JapanCar.Infrastructure;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Cors
builder.Services.AddCors(options =>
{
    options.AddPolicy("EnableCors", builder =>
    {
        builder
        .WithOrigins("http://localhost:3000", "http://localhost:3001", "http://185.231.115.136")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

// Auth
builder.Services.AddAuthorization();
builder.Services.AddAuthentication("Bearer").AddJwtBearer("Bearer", options =>
{
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey =
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]!))
    };
});

// 
builder.Services.AddScoped(typeof(ValidateDtoFilter<>));

// Infrustructure DI
builder.Services.AddInfrastructure(builder.Configuration);

// Application DI
builder.Services.AddApplication();

// Api DI
builder.Services.AddScoped<IFileStorage, FileStorageService>();
builder.Services.AddScoped<RequestContext>();
builder.Services.AddScoped<IRequestContext>(sp => sp.GetRequiredService<RequestContext>());



var app = builder.Build();
//if (app.Environment.IsDevelopment())
//{
app.UseSwagger();
app.UseSwaggerUI();
//}
app.UseHttpsRedirection();
app.UseCors("EnableCors");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.UseStaticFiles();
app.UseMiddleware<AppExceptionMiddleware>();
app.Use(async (context, next) =>
{
    var locale = context.Request.Headers["X-Locale"].ToString() ?? "en";
    var requestContext = context.RequestServices.GetRequiredService<RequestContext>();
    requestContext.Locale = locale;

    await next();
});
app.Run();
