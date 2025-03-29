
using api.Models;
using Microsoft.EntityFrameworkCore;
using tutorial.Models;

namespace api.Services
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions options) : base(options) { }
        public DbSet<Recibos> Recibos { get; set; }
        public DbSet<RecibosRecientesDTO> RecibosRecientesDTO { get; set; }

        public DbSet<LINDA_TBL_APP_USUARIOS> LINDA_TBL_APP_USUARIOS { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)

        {
            modelBuilder.Entity<Recibos>(entity =>
            {
                entity.HasNoKey();
            });
            modelBuilder.Entity<RecibosRecientesDTO>(entity => { entity.HasNoKey(); });

        }
    }
}
