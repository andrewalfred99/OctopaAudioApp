using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace OctopaAudioApp.Models
{
    public class RegisterViewModel
    {
        [Key]

        [DatabaseGenerated(DatabaseGeneratedOption.None)]



        public int id { get; set; }

        [Required]



        public string UserName { get; set; }

        [Required]

        [EmailAddress]

        public string Email { get; set; }

        [Required]

        [DataType(DataType.Password)]

        public string Password { get; set; }


        [DataType(DataType.Password)]

        [Display(Name = "Confirm password")]

        [Compare("Password",

            ErrorMessage = "Password and confirmation password do not match.")]

        public string ConfirmPassword { get; set; }

        public DateTime PasswordCreationStamp { get; set; }

        public DateTime CreateDate { get; set; }
    }
}
