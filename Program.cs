using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ReactCRUD.Contexts;
using ReactCRUD.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services
	.AddSingleton<ITokenBuilder, TokenBuilder>()
	.AddDbContext<PersonContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("AppDb")))
	.AddDbContext<UserContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("UsersDb")));
builder.Services.AddControllersWithViews();
builder.Services
	.AddAuthentication(x =>
	{
		x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
		x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
	})
	.AddJwtBearer(x =>
	{
		x.RequireHttpsMetadata = false;
		x.SaveToken = true;
		x.TokenValidationParameters = new TokenValidationParameters
		{
			ValidateIssuerSigningKey = true,
			IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration["TokenKey"])),
			ValidateIssuer = false,
			ValidateAudience = false
		};
	});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");;

app.Run();
