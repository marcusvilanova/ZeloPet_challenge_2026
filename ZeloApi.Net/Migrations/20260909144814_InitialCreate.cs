using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZeloApi.Net.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ZELO_PET",
                columns: table => new
                {
                    PET_ID = table.Column<long>(type: "NUMBER(19)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    NOME = table.Column<string>(type: "NVARCHAR2(100)", maxLength: 100, nullable: false),
                    ESPECIE = table.Column<string>(type: "NVARCHAR2(30)", maxLength: 30, nullable: false),
                    RACA = table.Column<string>(type: "NVARCHAR2(80)", maxLength: 80, nullable: true),
                    SEXO = table.Column<string>(type: "NVARCHAR2(1)", nullable: true),
                    DATA_NASCIMENTO = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: true),
                    PESO_KG = table.Column<decimal>(type: "NUMBER(6,2)", nullable: true),
                    CASTRADO = table.Column<string>(type: "NVARCHAR2(1)", nullable: true),
                    CRIADO_EM = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZELO_PET", x => x.PET_ID);
                });

            migrationBuilder.CreateTable(
                name: "ZELO_USUARIO",
                columns: table => new
                {
                    USUARIO_ID = table.Column<long>(type: "NUMBER(19)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    NOME = table.Column<string>(type: "NVARCHAR2(120)", maxLength: 120, nullable: false),
                    EMAIL = table.Column<string>(type: "NVARCHAR2(160)", maxLength: 160, nullable: false),
                    SENHA_HASH = table.Column<string>(type: "NVARCHAR2(2000)", nullable: true),
                    TIPO_USUARIO = table.Column<string>(type: "NVARCHAR2(20)", maxLength: 20, nullable: false),
                    ATIVO = table.Column<string>(type: "NVARCHAR2(1)", nullable: false),
                    CRIADO_EM = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZELO_USUARIO", x => x.USUARIO_ID);
                });

            migrationBuilder.CreateTable(
                name: "ZELO_TUTOR",
                columns: table => new
                {
                    TUTOR_ID = table.Column<long>(type: "NUMBER(19)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    USUARIO_ID = table.Column<long>(type: "NUMBER(19)", nullable: false),
                    TELEFONE = table.Column<string>(type: "NVARCHAR2(25)", maxLength: 25, nullable: true),
                    CIDADE = table.Column<string>(type: "NVARCHAR2(80)", maxLength: 80, nullable: true),
                    ESTADO = table.Column<string>(type: "NVARCHAR2(2)", maxLength: 2, nullable: true),
                    CRIADO_EM = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZELO_TUTOR", x => x.TUTOR_ID);
                    table.ForeignKey(
                        name: "FK_ZELO_TUTOR_ZELO_USUARIO_USUARIO_ID",
                        column: x => x.USUARIO_ID,
                        principalTable: "ZELO_USUARIO",
                        principalColumn: "USUARIO_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ZELO_PET_TUTOR",
                columns: table => new
                {
                    PET_ID = table.Column<long>(type: "NUMBER(19)", nullable: false),
                    TUTOR_ID = table.Column<long>(type: "NUMBER(19)", nullable: false),
                    RESPONSAVEL_PRINCIPAL = table.Column<string>(type: "NVARCHAR2(1)", nullable: false),
                    DATA_VINCULO = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZELO_PET_TUTOR", x => new { x.PET_ID, x.TUTOR_ID });
                    table.ForeignKey(
                        name: "FK_ZELO_PET_TUTOR_ZELO_PET_PET_ID",
                        column: x => x.PET_ID,
                        principalTable: "ZELO_PET",
                        principalColumn: "PET_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ZELO_PET_TUTOR_ZELO_TUTOR_TUTOR_ID",
                        column: x => x.TUTOR_ID,
                        principalTable: "ZELO_TUTOR",
                        principalColumn: "TUTOR_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ZELO_PET_TUTOR_TUTOR_ID",
                table: "ZELO_PET_TUTOR",
                column: "TUTOR_ID");

            migrationBuilder.CreateIndex(
                name: "IX_ZELO_TUTOR_USUARIO_ID",
                table: "ZELO_TUTOR",
                column: "USUARIO_ID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ZELO_USUARIO_EMAIL",
                table: "ZELO_USUARIO",
                column: "EMAIL",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ZELO_PET_TUTOR");

            migrationBuilder.DropTable(
                name: "ZELO_PET");

            migrationBuilder.DropTable(
                name: "ZELO_TUTOR");

            migrationBuilder.DropTable(
                name: "ZELO_USUARIO");
        }
    }
}
