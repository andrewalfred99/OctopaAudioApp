using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OctopaAudioApp.Models.SetupModels
{
    public class ItemView
    {
        [Key]
        public string SerialNUmber { get; set; }
        public string BrandName { get; set; }
        public string TypeName { get; set; }
        public string StatusName { get; set; }
        public string Notes { get; set; }
        public string Description { get; set; }
        public string Cpu { get; set; }
        public string GPU { get; set; }
        public string Ram { get; set; }
        public string Storage { get; set; }


    }
}
