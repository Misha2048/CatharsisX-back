-- CreateTable
CREATE TABLE "LikedStillage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stillageId" TEXT NOT NULL,

    CONSTRAINT "LikedStillage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LikedStillage" ADD CONSTRAINT "LikedStillage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedStillage" ADD CONSTRAINT "LikedStillage_stillageId_fkey" FOREIGN KEY ("stillageId") REFERENCES "Stillage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
