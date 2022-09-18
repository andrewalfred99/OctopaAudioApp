using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OctopaAudioApp.Models.SetupModels
{
    [Table("AllowDEPToTicket")]
    public class AllowDEPToTicket
    {
        [Key]
        public int Code { get; set; }

        public int Department { get; set; }

        public string UserManage { get; set; }

        public Boolean AllowTickting { get; set; }

        public string AddedUser { get; set; }

        public DateTime DateUpdate { get; set; }

    }
}
