using OctopaAudioApp.Models.AudioDataContext;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OctopaAudioApp.Models
{
    [Table("EmployeAsset")]
    public class EmployeAsset
    {
        public int EmployeID { get; set; }
        [Key]
       
        public string SerialNUmber { get; set; }

        public Boolean Status { get; set; }
        public string AddedUser { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime DateUpdate { get; set; }

    }
}
