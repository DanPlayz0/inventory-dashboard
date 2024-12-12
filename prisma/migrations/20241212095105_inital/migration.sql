-- CreateEnum
CREATE TYPE "ItemFlags" AS ENUM ('ARCHIVED');

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "category" TEXT,
    "project" TEXT,
    "used_for" TEXT,
    "last_known" TEXT NOT NULL DEFAULT 'Unknown',
    "notes" TEXT,
    "flags" "ItemFlags"[] DEFAULT ARRAY[]::"ItemFlags"[],
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Item_id_key" ON "Item"("id");
