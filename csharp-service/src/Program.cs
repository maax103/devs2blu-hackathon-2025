using Microsoft.AspNetCore.Server.Kestrel.Core;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Disable HTTPS in development
if (builder.Environment.IsDevelopment())
{
    builder.Services.Configure<KestrelServerOptions>(options =>
    {
        options.ListenAnyIP(5000); // HTTP port
    });
}

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Only use HTTPS redirection in production
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();

app.MapControllers();

// Add a simple endpoint
app.MapGet("/", () => {
    const string message = "Hello from C# Service!";

    return message;
});

app.Run();