using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OctopaAudioApp.Models.SetupModels
{
    [Table("Inputs")]
    public class Inputs
    {
        [Key]
        public string SerialNUmber { get; set; }
        public int Brands { get; set; }
        public int Types { get; set; }
        public int Status { get; set; }
        public string Notes { get; set; }
        public string Description { get; set; }
        public string Cpu { get; set; }
        public string GPU { get; set; }
        public string Ram { get; set; }
        public string Storage { get; set; }
        public string AddedUser { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime DateUpdate { get; set; }
        public Boolean AvilabiltyStatus { get; set; }
    }
}
