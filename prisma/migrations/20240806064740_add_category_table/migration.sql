-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "user_Id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "plaid_Id" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "user_Id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "plaid_Id" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);
