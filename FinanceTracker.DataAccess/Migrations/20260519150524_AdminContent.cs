using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FinanceTracker.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AdminContent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Currencies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: false),
                    Symbol = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Currencies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ExpenseCategories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Key = table.Column<string>(type: "text", nullable: false),
                    Label = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExpenseCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "IncomeCategories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Key = table.Column<string>(type: "text", nullable: false),
                    Label = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IncomeCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TransactionStatuses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: false),
                    Label = table.Column<string>(type: "text", nullable: false),
                    Color = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransactionStatuses", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Currencies",
                columns: new[] { "Id", "Code", "Name", "Symbol" },
                values: new object[,]
                {
                    { new Guid("0d6b12da-4f7f-4dc2-8408-1b8b3a2f1b62"), "EUR", "Euro", "EUR" },
                    { new Guid("93e0f605-7a4a-46c7-8c24-0b029add2f2d"), "GBP", "British Pound", "GBP" },
                    { new Guid("a1f980db-7a51-4029-9f7d-0ecfd28c36d9"), "USD", "US Dollar", "$" },
                    { new Guid("b71ab74a-2dc3-4f91-9d61-dbc9a9f0f1f5"), "MDL", "Moldovan Leu", "lei" }
                });

            migrationBuilder.InsertData(
                table: "ExpenseCategories",
                columns: new[] { "Id", "Key", "Label" },
                values: new object[,]
                {
                    { new Guid("1b93ed8a-5025-4f4e-8a26-5d69f9fae3a6"), "food", "Food & Groceries" },
                    { new Guid("4765462e-b2e0-4031-8b32-4e44edfa9b65"), "transport", "Transport" },
                    { new Guid("5466d601-e99f-4d04-bebc-3d6a1f75e3db"), "travel", "Travel" },
                    { new Guid("5bd9f47d-85c7-4c81-88e1-7031c48a8de0"), "shopping", "Shopping" },
                    { new Guid("7d4097d0-28f3-4bdb-a889-2a9d6b93659c"), "health", "Health" },
                    { new Guid("8f4c9b10-44f5-4f9e-8eaa-3d19a5b241d6"), "entertainment", "Entertainment" },
                    { new Guid("c19b9f8a-dc5c-4a78-9a8a-60d7b5e0f2f4"), "bills", "Bills & Utilities" },
                    { new Guid("e0a6e7ad-7c47-42e3-8e3b-2b3d93fdd59f"), "education", "Education" },
                    { new Guid("ed1e9a1b-4d55-4e9d-b682-86c75d3b5ad1"), "other", "Other" }
                });

            migrationBuilder.InsertData(
                table: "IncomeCategories",
                columns: new[] { "Id", "Key", "Label" },
                values: new object[,]
                {
                    { new Guid("3bcb7c1b-4ab7-4c8c-9b2e-1a2dc7135e17"), "freelance", "Freelance" },
                    { new Guid("c1ab1f76-00ea-48a9-9e78-1ac9a8182fbd"), "salary", "Salary" },
                    { new Guid("c5f1b61a-2a52-4d4f-87b3-3f3e2d9f7568"), "gift", "Gift" },
                    { new Guid("c61c4b6b-9782-4c4a-b734-4f6f2945f0c2"), "investment", "Investment" },
                    { new Guid("d8a1ff0b-22bb-4d0b-9b03-2c80bf1d5a6e"), "other_income", "Other Income" },
                    { new Guid("f0c2ff2f-113a-43fb-9874-4b7b8b60c2c9"), "bonus", "Bonus" }
                });

            migrationBuilder.InsertData(
                table: "TransactionStatuses",
                columns: new[] { "Id", "Color", "Label", "Value" },
                values: new object[,]
                {
                    { new Guid("0b9b3aa5-8aa6-4a4b-8c5a-2d91c46d59b5"), "#ef4444", "Cancelled", "cancelled" },
                    { new Guid("2b64c0a2-60b4-4a3b-9f56-9f581b5b5b43"), "#f59e0b", "Pending", "pending" },
                    { new Guid("e6d8d6a6-7378-4c0d-9a16-63d7f91cd1f1"), "#10b981", "Completed", "completed" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Currencies_Code",
                table: "Currencies",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ExpenseCategories_Key",
                table: "ExpenseCategories",
                column: "Key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_IncomeCategories_Key",
                table: "IncomeCategories",
                column: "Key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TransactionStatuses_Value",
                table: "TransactionStatuses",
                column: "Value",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Currencies");

            migrationBuilder.DropTable(
                name: "ExpenseCategories");

            migrationBuilder.DropTable(
                name: "IncomeCategories");

            migrationBuilder.DropTable(
                name: "TransactionStatuses");
        }
    }
}
