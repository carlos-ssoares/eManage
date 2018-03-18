using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Core.Objects;
using System.Linq;
using eManage.CandidateCarlosSoares.Shared.DB.Mapping;
using eManage.CandidateCarlosSoares.Shared.DB.Models;

namespace eManage.CandidateCarlosSoares.Shared.DB.Core
{
    public class eManageEntities : DbContext
    {
        static eManageEntities()
        {
            Database.SetInitializer<eManageContext>(null);
        }

        public eManageEntities()
            : base("name=eManageContext")
        {
        }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new UserMap());
        }
    }
}
