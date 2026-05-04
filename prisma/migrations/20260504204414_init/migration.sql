/*
  Warnings:

  - You are about to alter the column `advantages` on the `Room` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `amenities` on the `Room` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `images` on the `Room` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Room" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "conditions" TEXT NOT NULL DEFAULT '',
    "advantages" JSONB NOT NULL DEFAULT [],
    "price" REAL NOT NULL,
    "capacity" INTEGER NOT NULL,
    "amenities" JSONB NOT NULL DEFAULT [],
    "images" JSONB NOT NULL DEFAULT [],
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Room" ("advantages", "amenities", "capacity", "conditions", "createdAt", "description", "id", "images", "isAvailable", "name", "price", "updatedAt") SELECT "advantages", "amenities", "capacity", "conditions", "createdAt", "description", "id", "images", "isAvailable", "name", "price", "updatedAt" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
