using System.Data.Entity.ModelConfiguration;
using eManage.CandidateCarlosSoares.Shared.DB.Models;

namespace eManage.CandidateCarlosSoares.Shared.DB.Mapping
{
    public class UserMap : EntityTypeConfiguration<User>
    {
        public UserMap()
        {
            // Primary Key
            this.HasKey(t => t.UserId);

            // Properties
            this.Property(t => t.Name).HasMaxLength(50);            
            this.Property(t => t.Address).HasMaxLength(50);


            // Table & Column Mappings
            this.ToTable("Users");
            this.Property(t => t.UserId).HasColumnName("Id");
        }
    }
}
