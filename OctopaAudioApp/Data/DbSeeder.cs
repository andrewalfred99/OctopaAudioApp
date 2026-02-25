using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OctopaAudioApp.Models;
using OctopaAudioApp.Models.AudioDataContext;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace OctopaAudioApp.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider services, IConfiguration configuration)
    {
        using var scope = services.CreateScope();

        var audioDb = scope.ServiceProvider.GetRequiredService<AudioDbContext>();
        await audioDb.Database.MigrateAsync();

        await SeedEmployeesAsync(audioDb, configuration);

        var identityDb = scope.ServiceProvider.GetRequiredService<AudioIdentity>();
        await identityDb.Database.MigrateAsync();

        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        var adminRole = configuration["Seed:AdminRole"] ?? "Admin";
        var userRole = configuration["Seed:UserRole"] ?? "User";

        if (!await roleManager.RoleExistsAsync(adminRole))
            await roleManager.CreateAsync(new IdentityRole(adminRole));

        if (!await roleManager.RoleExistsAsync(userRole))
            await roleManager.CreateAsync(new IdentityRole(userRole));

        var adminEmail = configuration["Seed:AdminEmail"] ?? "admin@local";
        var adminPassword = configuration["Seed:AdminPassword"] ?? "Admin123$";

        var userEmail = configuration["Seed:UserEmail"] ?? "user@local";
        var userPassword = configuration["Seed:UserPassword"] ?? "User123$";

        await EnsureUserAsync(userManager, adminEmail, adminPassword, adminRole);
        await EnsureUserAsync(userManager, userEmail, userPassword, userRole);
    }

    private static async Task SeedEmployeesAsync(AudioDbContext audioDb, IConfiguration configuration)
    {
        var desiredCount = 25;
        var configured = configuration["Seed:EmployeesCount"];
        if (int.TryParse(configured, out var parsed) && parsed > 0)
            desiredCount = parsed;

        var existingCount = await audioDb.Employees.CountAsync();
        if (existingCount >= desiredCount)
            return;

        var startCode = await audioDb.Employees.Select(e => (int?)e.Code).MaxAsync() ?? 1000;

        var toAdd = desiredCount - existingCount;
        var now = DateTime.UtcNow;

        for (var i = 1; i <= toAdd; i++)
        {
            var code = startCode + i;
            var first = $"Employee{code}";

            audioDb.Employees.Add(new Employee
            {
                Code = code,
                EnglishName = first,
                ArabicName = first,
                Department = (code % 5) + 1,
                EnglishPosition = (code % 2 == 0) ? "Technician" : "Support",
                ArabicPosition = (code % 2 == 0) ? "Technician" : "Support",
                Birthdate = now.AddYears(-25).AddDays(-(code % 365)).Date,
                HireDate = now.AddYears(-2).AddDays(-(code % 365)).Date,
                CompanyMail = $"employee{code}@local",
                PersonalMobile = "01000000000",
                CompanyMobile = "01100000000",
                AddedUser = "seed",
                DateUpdate = now
            });
        }

        await audioDb.SaveChangesAsync();
    }

    private static async Task EnsureUserAsync(UserManager<ApplicationUser> userManager, string email, string password, string role)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user is null)
        {
            user = new ApplicationUser
            {
                UserName = email,
                Email = email,
                EmailConfirmed = true,
                CreateDate = DateTime.UtcNow
            };

            var createResult = await userManager.CreateAsync(user, password);
            if (!createResult.Succeeded)
                throw new InvalidOperationException("Failed to create seeded user: " + string.Join("; ", createResult.Errors.Select(e => e.Description)));
        }

        if (!await userManager.IsInRoleAsync(user, role))
        {
            var addToRoleResult = await userManager.AddToRoleAsync(user, role);
            if (!addToRoleResult.Succeeded)
                throw new InvalidOperationException("Failed to add seeded user to role: " + string.Join("; ", addToRoleResult.Errors.Select(e => e.Description)));
        }
    }
}
