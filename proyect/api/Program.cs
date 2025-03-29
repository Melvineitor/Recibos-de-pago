using api.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Negotiate;
using System.Configuration;
using Microsoft.AspNetCore.Hosting;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

var allowedOrigins = builder.Configuration.GetValue<string>("allowedOrigins")!.Split(",");

builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

// Obtener el ConnectionString desde la configuración
var connectionString = builder.Configuration.GetConnectionString("RecibosApi");


builder.Services.AddDbContext<ApplicationDBContext>(options =>
{
    options.UseSqlServer(connectionString);
});

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = null;
});

// Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy => policy.WithOrigins("http://10.20.30.16:4200", "http://localhost:4200") // Permitir Angular
                        .AllowAnyMethod() // Permitir todos los métodos (GET, POST, etc.)
                        .AllowAnyHeader() // Permitir todos los encabezados
                        .AllowCredentials()
    );
});


builder.Services.AddAuthentication(NegotiateDefaults.AuthenticationScheme)
    .AddNegotiate();

builder.Services.AddAuthorization(options =>
{
    options.FallbackPolicy = options.DefaultPolicy;
});

var app = builder.Build();




app.UseCors("AllowAngularApp");
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/prueba", () => "Servidor en funcionamiento");

app.MapControllers();





app.Run();

public partial class Program
{
    public static void Main(string[] args)
    {
        CreateHostBuilder(args).Build().Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureAppConfiguration((context, config) =>
            {
                // Add the config.ini file to the configuration
                config.SetBasePath(Directory.GetCurrentDirectory());
                config.AddIniFile("config.ini", optional: true, reloadOnChange: true);
            })
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.ConfigureKestrel((context, options) =>
                {
                    // Read the BaseUrl from the configuration
                    var baseUrl = context.Configuration["Server:BaseUrl"];
                    if (!string.IsNullOrEmpty(baseUrl))
                    {
                        options.ListenLocalhost(new Uri(baseUrl).Port);
                    }
                });
                webBuilder.UseStartup<IStartup>();
            });
}