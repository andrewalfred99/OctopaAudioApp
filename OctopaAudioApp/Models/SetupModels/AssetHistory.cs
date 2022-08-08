using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OctopaAudioApp.Models.SetupModels
{
    [Table("AssetHistory")]
    public class AssetHistory
    {
        [Key]
        public int Code { get; set; }
        public string SerialNUmber { get; set; }
        
        [DataType(DataType.DateTime)]
        public DateTime DateUpdate { get; set; }
        public Boolean AvilabiltyStatus { get; set; }
        public string AddedUser { get; set; }
        public int AssigendEMP { get; set; }
        public int Status { get; set; }
        public string Changes {get; set;} 
    }
}
