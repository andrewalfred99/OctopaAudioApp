using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OctopaAudioApp.Models
{
    [Table("Employee")]
    public partial class Employee
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Code { get; set; }

        [StringLength(50)]
        public string ArabicName { get; set; }

        [StringLength(50)]
        public string EnglishName { get; set; }

        public int? Department { get; set; }

        [StringLength(50)]
        public string ArabicPosition { get; set; }

        [StringLength(50)]
        public string EnglishPosition { get; set; }

        [Column(TypeName = "date")]
        public DateTime? Birthdate { get; set; }

        [Column(TypeName = "date")]
        public DateTime? HireDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime? Leavedate { get; set; }

        [StringLength(50)]
        public string IDCardNO { get; set; }

        [StringLength(50)]
        public string IDCardRenewal { get; set; }

        [StringLength(50)]
        public string SocialInsuranceNO { get; set; }

        [Column(TypeName = "date")]
        public DateTime? SocialInsuranceDate { get; set; }

        [StringLength(50)]
        public string PayrollBankAccount { get; set; }

        [StringLength(50)]
        public string MilitaryService { get; set; }

        [StringLength(250)]
        public string IDAddress { get; set; }

        [StringLength(250)]
        public string CurrentAddress { get; set; }

        [StringLength(11)]
        public string PersonalMobile { get; set; }

        [StringLength(11)]
        public string CompanyMobile { get; set; }

        [StringLength(10)]
        public string HomePhone { get; set; }

        [StringLength(50)]
        public string CompanyMail { get; set; }

        [StringLength(50)]
        public string PersonalMail { get; set; }

        public bool? MaritalStatus { get; set; }

        [StringLength(50)]
        public string MedicalCare { get; set; }

        public bool? Contracts { get; set; }

        public bool? Gender { get; set; }

        public bool? isSeller { get; set; }

        [StringLength(50)]
        public string LoginUser { get; set; }

        public int? MachineCode { get; set; }

        [StringLength(50)]
        public string SpouseName { get; set; }

        [Column(TypeName = "date")]
        public DateTime? SpouseBirthdate { get; set; }

        [StringLength(50)]
        public string AddedUser { get; set; }

        public DateTime? DateUpdate { get; set; }

        [StringLength(50)]
        public string Password { get; set; }

        public int? DirectManager { get; set; }

        public byte[] Image { get; set; }
        public int? GraduationYear { get; set; }
        public int? Experience { get; set; }
        [NotMapped]
        public string FormatedDate { get; set; }
        [NotMapped]
        public string MangerName { get; set; }
        [NotMapped]
        public string DName { get; set; }
        [NotMapped]
        public string FormatedLeaveDate { get; set; }
    }
}
