using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OctopaAudioApp.Models.SetupModels
{
    [Table("TicketsStatus")]
    public class TicketsStatus
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        public int Code { get; set; }
        public String StatusName { get; set; }
        public string AddedUser { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime DateUpdate { get; set; }
    }
}
