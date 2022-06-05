using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OctopaAudioApp.Models.SetupModels
{
    [Table("AssetBrand")]
    public class AssetBrand
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Code { get; set; }
        public string BrandName { get; set; }
        public string AddedUser { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime DateUpdate { get; set; }

    }
}
