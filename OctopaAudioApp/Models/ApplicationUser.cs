using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OctopaAudioApp.Models
{
    public class ApplicationUser : IdentityUser
    {
        public virtual DateTime? CreateDate { get; set; }

        public virtual string LastPassWord { get; set; }
    }
}
