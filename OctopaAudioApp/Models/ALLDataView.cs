using OctopaAudioApp.Models.Assigning;
using OctopaAudioApp.Models.SetupModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OctopaAudioApp.Models
{
    public class ALLDataView
    {
        public List<AssignModel> ExcelList { get; set; }
        public Inputs Data { get; set; }
        
        public List<EmployeAsset> ItemArray { get; set; }
    }
}
