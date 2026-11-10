
-- AlterTable
ALTER TABLE `products` ADD COLUMN `externalId` VARCHAR(50) NULL,
    ADD COLUMN `externalUcode` VARCHAR(50) NULL,
    ADD COLUMN `needsReview` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `syncedAt` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `products_externalId_key` ON `products`(`externalId`);

