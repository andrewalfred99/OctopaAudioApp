# OctopaAudioApp

An **ERP skeleton** built with ASP.NET Core (controllers + Razor views) and EF Core.

The project is organized into 3 core modules:

1. **Asset Management (IT Department)**
2. **Account Security**
3. **Ticket Support System**

This repository can be used as a starting point to build additional ERP modules following the same patterns.

## Modules

### 1) Asset Management (IT Department)
Goal: help IT track devices and assign them to employees without paper hassle.

Main features implemented in `SetupAssetd` (and related views/models):

- Asset master data:
  - Brands (`CreateNewBrand`)
  - Types (`CreateNewType`)
  - Statuses (`CreateNewStatus`)
- Asset inventory list (`Assets`) backed by `Inputs`
- Device assignment to employee (`SaveEMPAndItemData`) using `EmployeAsset`
- Full change log/history (`AssetHistory`) for actions like:
  - "Asset Created"
  - "Assigned To Employee"

Related controllers:

- `OctopaAudioApp/Controllers/SetupPages/SetupAssetd.cs`
- `OctopaAudioApp/Controllers/Assigning/AssignController.cs` (Excel import list)

### 2) Account Security
Goal: enforce basic password security controls for ERP accounts.

Implemented in `AccountController`:

- Login flow checks for:
  - default password (`Audio@123`)
  - expired password (older than 90 days using `ApplicationUser.CreateDate`)
  - redirects to `ChangePassword` when required
- Change password rules:
  - can't set the default password again
  - can't reuse the last password (tracked via `ApplicationUser.LastPassWord`)
- Updates `CreateDate` when password changes (to restart the 90-day window)

Related controller:

- `OctopaAudioApp/Controllers/AccountController.cs`

### 3) Ticket Support System
Goal: simple internal support ticketing where each department can configure their own support setup.

Implemented in `SetupTickets`:

- Department ticket enablement & manager mapping (`DEPFilter`, `AllowDEPToTicket`)
  - ability to enable/disable ticketing per department
- Department-specific common issues (`CommenIssues`)
  - including auto-creating an "Others" issue on department setup
- Ticket creation and tracking (`Tickets`)
  - create ticket with department, common issue, description
  - assign ticket to employee, add notes, cancel/finish
- Ticket statuses (`TicketsStatus`)

Related controller:

- `OctopaAudioApp/Controllers/SetupPages/SetupTickets.cs`

## Solution structure

- `OctopaAudioApp/Controllers` - MVC controllers
- `OctopaAudioApp/Views` - Razor views
- `OctopaAudioApp/Models` - EF Core entity models + view models
- `OctopaAudioApp/Models/AudioDataContext/AudioDbContext.cs` - application DB context (`AudioDB`)
- `OctopaAudioApp/Models/AudioIdentity.cs` - Identity DB context (`AudioIdentity`)
- `OctopaAudioApp/Data/DbSeeder.cs` - migration + seed routine

## Database setup (EF Core Migrations)

This solution uses **two SQL Server databases**:

- `AudioDB` - application data (assets, employees, tickets, ...)
- `AudioIdentity` - ASP.NET Core Identity users/roles

### Connection strings
Located in `OctopaAudioApp/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=...;Database=AudioIdentity;...",
    "AudioConn": "Server=...;Database=AudioDB;..."
  }
}
```

### Common error: `AudioDB` does not exist
If you see an error like:

- `Cannot open database "AudioDB" requested by the login. The login failed.`

It usually means the connection string points to `AudioDB`, but it hasn't been created yet.
The app touches `AudioDbContext` early (e.g. `HomeController.Index()` reads `_Context.AllowDEPToTickets`), so the first request may fail if the DB isn't created.

### Automatic migrate + seed on startup
On application startup (see `OctopaAudioApp/Program.cs`), the app runs `DbSeeder.SeedAsync(...)` (`OctopaAudioApp/Data/DbSeeder.cs`) which:

1. Runs `Database.MigrateAsync()` for:
   - `AudioDbContext` (creates/updates `AudioDB`)
   - `AudioIdentity` (creates/updates `AudioIdentity`)
2. Seeds basic reference data:
   - employees (default 25, configurable)
3. Ensures Identity roles exist:
   - `Admin`, `User`
4. Ensures an admin and a regular user exist and are assigned to the roles.

### Seed settings
Located in `OctopaAudioApp/appsettings.json`:

```json
{
  "Seed": {
    "AdminRole": "Admin",
    "UserRole": "User",
    "AdminEmail": "admin@local",
    "AdminPassword": "Admin123$",
    "UserEmail": "user@local",
    "UserPassword": "User123$",
    "EmployeesCount": 25
  }
}
```

### Manual database creation/update (optional)
If you prefer to run migrations manually:

```powershell
# Run from the `OctopaAudioApp` project directory

# Identity DB
dotnet-ef database update -c AudioIdentity

# App DB
dotnet-ef database update -c AudioDbContext
```

## Running the app

```powershell
dotnet run --project OctopaAudioApp
```

Then open the URL printed by the app (typically `https://localhost:xxxx`).

