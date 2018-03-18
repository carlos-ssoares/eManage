using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace eManage.CandidateCarlosSoares.Shared.DB.Models
{
    public class User
    {
        //Id int NOT NULL (IDENTITY)
        //Name VARCHAR(50) NOT NULL
        //Age INT NOT NULL
        //Address VARCHAR(50) NULL

        [Required]
        [Display(Name = "Id")]
        public int UserId { get; set; }

        [Required]
        [Display(Name = "Name")]
        public string Name { get; set; }

        [Required]
        [Display(Name = "Age")]
        public int Age { get; set; }

        [Display(Name = "Address")]
        public string Address { get; set; }
    }
}
