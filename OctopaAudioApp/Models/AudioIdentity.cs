using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OctopaAudioApp.Models.SetupModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OctopaAudioApp.Models
{
    public class AudioIdentity : IdentityDbContext<ApplicationUser>
    {
        public AudioIdentity( ) { }

        public AudioIdentity(DbContextOptions Options) : base(Options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)

        {

            if (!optionsBuilder.IsConfigured)

            {

            }

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)

        {



            base.OnModelCreating(modelBuilder);
        }
    }
}
