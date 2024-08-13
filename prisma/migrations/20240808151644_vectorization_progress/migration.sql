-- DropForeignKey
ALTER TABLE "Collaborator" DROP CONSTRAINT "Collaborator_documentId_fkey";

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "vectorizationProgress" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT;

-- AddForeignKey
ALTER TABLE "Collaborator" ADD CONSTRAINT "Collaborator_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
