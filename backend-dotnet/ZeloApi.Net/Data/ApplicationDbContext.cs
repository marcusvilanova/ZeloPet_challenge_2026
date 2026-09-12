using Microsoft.EntityFrameworkCore;
using ZeloApi.Net.Models;

namespace ZeloApi.Net.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Tutor> Tutores { get; set; }
        public DbSet<Pet> Pets { get; set; }
        public DbSet<PetTutor> PetTutores { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Tutor>()
                .HasOne(t => t.Usuario)
                .WithOne(u => u.Tutor)
                .HasForeignKey<Tutor>(t => t.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Tutor>()
                .HasIndex(t => t.UsuarioId)
                .IsUnique();

            modelBuilder.Entity<PetTutor>()
                .HasKey(pt => new { pt.PetId, pt.TutorId });

            modelBuilder.Entity<PetTutor>()
                .HasOne(pt => pt.Pet)
                .WithMany(p => p.PetTutores)
                .HasForeignKey(pt => pt.PetId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PetTutor>()
                .HasOne(pt => pt.Tutor)
                .WithMany(t => t.PetTutores)
                .HasForeignKey(pt => pt.TutorId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
