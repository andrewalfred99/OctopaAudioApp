using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OctopaAudioApp.Models
{
    public class LoginViewModel
    {
        [Key]

        [DatabaseGenerated(DatabaseGeneratedOption.None)]



        public int id { get; set; }

        [Required]



        public string UserName { get; set; }



        [Required]

        [DataType(DataType.Password)]

        public string Password { get; set; }



        [Display(Name = "Remember me")]

        public bool RememberMe { get; set; }
    }
}
