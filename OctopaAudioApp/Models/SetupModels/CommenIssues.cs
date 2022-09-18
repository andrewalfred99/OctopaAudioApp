using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OctopaAudioApp.Models.SetupModels
{
    [Table("CommenIssues")]
    public class CommenIssues
    {
        [Key]
       public int Code { get; set; }

       public int Department { get; set; }

       public string Issue { get; set; }

        public string AddUser { get; set; }

        public DateTime DateUpdate { get; set; }
    }
}
