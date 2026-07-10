using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ProTipsBet.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddUserPhoneNumber : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TicketRecordLegs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TicketRecordId = table.Column<int>(type: "integer", nullable: false),
                    League = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    MatchDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    HomeTeam = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    AwayTeam = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Prediction = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Odds = table.Column<decimal>(type: "numeric(6,2)", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TicketRecordLegs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TicketRecordLegs_TicketRecords_TicketRecordId",
                        column: x => x.TicketRecordId,
                        principalTable: "TicketRecords",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TicketRecordLegs_TicketRecordId",
                table: "TicketRecordLegs",
                column: "TicketRecordId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TicketRecordLegs");
        }
    }
}
