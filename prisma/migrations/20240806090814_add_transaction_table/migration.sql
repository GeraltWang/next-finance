/*
  Warnings:

  - You are about to drop the column `plaid_Id` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `user_Id` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `plaid_Id` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `user_Id` on the `Category` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "plaid_Id",
DROP COLUMN "user_Id",
ADD COLUMN     "plaid_id" TEXT,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "plaid_Id",
DROP COLUMN "user_Id",
ADD COLUMN     "plaid_id" TEXT,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "payee" TEXT NOT NULL,
    "notes" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "account_id" TEXT NOT NULL,
    "category_id" TEXT,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
