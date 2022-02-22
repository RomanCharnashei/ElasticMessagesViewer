using Elasticsearch.Net;
using Nest;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();

builder.Services.AddSingleton<ElasticClient>((svcProvider) =>
{
    var pool = new SingleNodeConnectionPool(new Uri("http://localhost:9200"));
    var settings = new ConnectionSettings(pool).DefaultIndex("vkmessages");

    return new ElasticClient(settings);
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        builder =>
        {
            builder.WithOrigins("http://localhost:44423");
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
}

app.UseStaticFiles();
app.UseRouting();

app.UseCors();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html"); ;

app.Run();
