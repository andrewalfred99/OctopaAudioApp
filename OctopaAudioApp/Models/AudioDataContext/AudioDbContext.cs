﻿
using Microsoft.EntityFrameworkCore;
using OctopaAudioApp.Models.Assigning;
using OctopaAudioApp.Models.SetupModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OctopaAudioApp.Models.AudioDataContext
{
    public class AudioDbContext : DbContext    {
        //public AudioDataContext() { }
        public AudioDbContext(DbContextOptions<AudioDbContext> options):base(options)
        {
            //this.Database.SetCommandTimeout(180);
        }
        public virtual DbSet<AssetBrand> AssetBrands { get; set; }

        public virtual DbSet<AssetType> AssetTypes { get; set; }

        public virtual DbSet<AssetStatus> AssetStatuses { get; set; }
        public virtual DbSet<Inputs> Inputs { get; set; }
        public virtual DbSet<ApplicationUser> ApplicationUsers { get; set; }

        public virtual DbSet<AssignModel> Assigns { get; set; }

        public virtual DbSet<EmployeAsset> EmployeAssets { get; set; }
        
        public virtual DbSet<Employee> Employees { get; set; }
        public virtual DbSet<ItemView> ItemViews { get; set; }

        public virtual DbSet<Department> Departments { get; set; }
        public virtual DbSet<AssetHistory> AssetHistories { get; set; }
        public virtual DbSet<AssignedTicketToEMP> AssignedTicketToEMPs { get; set; }
        public virtual DbSet<AllowDEPToTicket> AllowDEPToTickets { get; set; }
        public virtual DbSet<CommenIssues> CommenIssues { get; set; }
        public virtual DbSet<Tickets> Tickets { get; set; }
        public virtual DbSet<TicketsStatus> TicketsStatuses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //modelBuilder.Entity<ass>
        }
    }
}
