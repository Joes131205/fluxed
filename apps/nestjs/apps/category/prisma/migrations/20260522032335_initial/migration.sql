-- CreateTable
CREATE TABLE "areas" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#00cdfd',
    "weight" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subareas" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "area_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "allocated_minutes" INTEGER NOT NULL DEFAULT 0,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "color" TEXT NOT NULL DEFAULT '#00cdfd',

    CONSTRAINT "subareas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "subareas" ADD CONSTRAINT "subareas_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
