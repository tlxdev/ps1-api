-- CreateEnum
CREATE TYPE "GameRegion" AS ENUM ('PAL', 'NA', 'JP');

-- CreateTable
CREATE TABLE "GameRelease" (
    "id" UUID NOT NULL,
    "releaseDate" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region" "GameRegion" NOT NULL,
    "gameId" UUID NOT NULL,

    CONSTRAINT "GameRelease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" UUID NOT NULL,
    "name" TEXT[],
    "developer" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameRelease_id_key" ON "GameRelease"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Game_id_key" ON "Game"("id");

-- AddForeignKey
ALTER TABLE "GameRelease" ADD CONSTRAINT "GameRelease_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
