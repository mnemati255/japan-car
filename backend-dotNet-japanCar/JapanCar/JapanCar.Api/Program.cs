using JapanCar.Api.Filters;
using JapanCar.Api.Middlewares;
using JapanCar.Application;
using JapanCar.Application.DTOs;
using JapanCar.Infrastructure;

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
        .WithOrigins("http://localhost:3000")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
        .Build();
    });
});

builder.Services.AddScoped(typeof(ValidateDtoFilter<>));

// Infrustructure DI
builder.Services.AddInfrastructure(builder.Configuration);

// Application DI
builder.Services.AddApplication();



var app = builder.Build();
//if (app.Environment.IsDevelopment())
//{
app.UseSwagger();
app.UseSwaggerUI();
//}
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.UseStaticFiles();
app.UseCors("EnableCors");
app.UseMiddleware<AppExceptionMiddleware>();
app.Run();
