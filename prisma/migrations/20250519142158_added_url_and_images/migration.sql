/*
  Warnings:

  - Added the required column `bigImg` to the `Stream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `extractedId` to the `Stream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `smallImg` to the `Stream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Stream` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "bigImg" TEXT NOT NULL,
ADD COLUMN     "extractedId" TEXT NOT NULL,
ADD COLUMN     "smallImg" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;
