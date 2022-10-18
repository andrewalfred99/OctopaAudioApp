using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OctopaAudioApp.Models
{
    [Table("Tickets")]
    public class Tickets
    {
        [Key]
        public int Code { get; set; }

        public int Department { get; set; }
        
        public int ComminIssue { get; set; }

        public string Discription { get; set; }

        public string Notes { get; set; }

        public int status { get; set; }

        public int AssignTOEMP { get; set; }

        public string Manager { get; set; }
        
        public string AddedUser { get; set; }

        public DateTime DateUpdate { get; set; }
    }
}
