using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OctopaAudioApp.Models
{
    public class AudioIdentity : IdentityDbContext
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
