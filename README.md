# OctopaAudioApp

## Root cause of the `AudioDB` exception
If you see an error similar to:

- `Cannot open database "AudioDB" requested by the login. The login failed.`

The root cause is that the connection string points to SQL Server database `AudioDB`, but **`AudioDB` does not exist yet**.

`AudioDbContext` is queried on `HomeController.Index()` (for example `_Context.AllowDEPToTickets.ToList()`), so the first request triggers the DB connection and fails when `AudioDB` is missing.

## Fix: create databases + seed accounts automatically
This app is configured to create/update the databases using EF Core migrations and to seed:

- Roles: `Admin`, `User`
- Admin account
- Regular user account

### Connection strings
Located in `OctopaAudioApp/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=ANDREW-PC\\DBWRK;Database=AudioIdentity;User Id=sa;Password=andrew;Trusted_Connection=False;Encrypt=True;TrustServerCertificate=True;MultipleActiveResultSets=True;",
    "AudioConn": "Server=ANDREW-PC\\DBWRK;Database=AudioDB;User Id=sa;Password=andrew;Trusted_Connection=False;Encrypt=True;TrustServerCertificate=True;MultipleActiveResultSets=True;"
  }
}
```

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
    "UserPassword": "User123$"
  }
}
```

### How it works
On application startup (see `OctopaAudioApp/Program.cs`), the app runs the seeding routine (`OctopaAudioApp/Data/DbSeeder.cs`) which:

1. Runs `Database.Migrate()` for:
   - `AudioDbContext` (creates/updates `AudioDB`)
   - `AudioIdentity` (creates/updates `AudioIdentity`)
2. Ensures roles exist.
3. Ensures the admin and user accounts exist and are assigned to their roles.

### Manual database creation (optional)
If you prefer to create/update the databases manually:

```powershell
# Run from the `OctopaAudioApp` project directory

# Identity DB
dotnet-ef database update -c AudioIdentity

# App DB (AudioDB)
dotnet-ef database update -c AudioDbContext
```

## Related Work Items
None found.
