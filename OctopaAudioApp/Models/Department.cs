using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OctopaAudioApp.Models
{
    [Table("Department")]
    public class Department
    {
        [Key]
        public int Code { get; set; }

        public string Name { get; set; }

        public string AddUser { get; set; }

        public DateTime? DateUpdate { get; set; }

        public string REF { get; set; }
    }
}
