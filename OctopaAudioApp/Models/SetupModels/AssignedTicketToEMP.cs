using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OctopaAudioApp.Models.SetupModels
{
    [Table("AssignedTicketToEMP")]
    public class AssignedTicketToEMP
    {
        [Key]
        public int Code { get; set; }

        public string HeadEMP { get; set; }

        public string EMP { get; set; }

        public int Ticket { get; set; }

        public string Comment { get; set; }
    }
}
