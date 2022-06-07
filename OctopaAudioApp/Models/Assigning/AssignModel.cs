using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OctopaAudioApp.Models.Assigning
{
    [Table("Assign")]
    public class AssignModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string SerialNo { get; set; }

        public int Quantity { get; set; }

        public string AssingedUser { get; set; }
    }
}
