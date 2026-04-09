/*
  Warnings:

  - The `emailCodeExpiries` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `telCodeExpiries` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailCodeExpiries",
ADD COLUMN     "emailCodeExpiries" TIMESTAMP(3),
DROP COLUMN "telCodeExpiries",
ADD COLUMN     "telCodeExpiries" TIMESTAMP(3);
