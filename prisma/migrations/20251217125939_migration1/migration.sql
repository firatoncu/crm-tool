-- CreateEnum
CREATE TYPE "CustomerType" AS ENUM ('DEALER', 'AUTHORIZED_SERVICE', 'ACTIVE', 'POTENTIAL', 'CORPORATE_END_USER', 'PROJECT_CUSTOMER', 'INDIVIDUAL', 'EXPORT_DISTRIBUTOR', 'EXPORT_PROJECT');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('INTRO_CALL', 'WHATSAPP_MESSAGE', 'EMAIL', 'QUOTE_SENT', 'SHIPMENT', 'INSTALLATION', 'NOTE');

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "city" TEXT,
    "district" TEXT,
    "address" TEXT,
    "customer_type" "CustomerType" NOT NULL DEFAULT 'POTENTIAL',
    "notes" TEXT,
    "contact_person" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attachments" JSONB,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "customers_phone_idx" ON "customers"("phone");

-- CreateIndex
CREATE INDEX "customers_company_name_idx" ON "customers"("company_name");

-- CreateIndex
CREATE INDEX "activities_customer_id_created_at_idx" ON "activities"("customer_id", "created_at");

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
