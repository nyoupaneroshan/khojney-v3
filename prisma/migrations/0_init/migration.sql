-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "phone" TEXT,
    "bio" TEXT,
    "location" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "parentId" TEXT,
    "module" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'INFO',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "query" TEXT NOT NULL,
    "module" TEXT,
    "results" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" TEXT,
    "examType" TEXT NOT NULL,
    "durationMin" INTEGER NOT NULL,
    "totalMarks" INTEGER NOT NULL,
    "passingMarks" INTEGER,
    "difficulty" TEXT NOT NULL DEFAULT 'MEDIUM',
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT,
    "coverImage" TEXT,
    "parentId" TEXT,
    "isParent" BOOLEAN NOT NULL DEFAULT false,
    "shuffleQuestions" BOOLEAN NOT NULL DEFAULT true,
    "shuffleOptions" BOOLEAN NOT NULL DEFAULT true,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoContent" TEXT,
    "keywords" TEXT,
    "canonicalUrl" TEXT,
    "featuredImage" TEXT,
    "heroTitle" TEXT,
    "heroDescription" TEXT,
    "benefits" TEXT,
    "instructions" TEXT,
    "faqs" TEXT,
    "ctaText" TEXT,
    "relatedResources" TEXT,
    "negativeMarking" BOOLEAN NOT NULL DEFAULT false,
    "negativeMarkValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamQuestion" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'MCQ',
    "question" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "correctIdx" INTEGER NOT NULL,
    "explanation" TEXT,
    "marks" INTEGER NOT NULL DEFAULT 1,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ExamQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "score" INTEGER NOT NULL DEFAULT 0,
    "totalMarks" INTEGER NOT NULL,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "wrongCount" INTEGER NOT NULL DEFAULT 0,
    "durationSec" INTEGER,
    "answers" TEXT,
    "rank" INTEGER,

    CONSTRAINT "ExamAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "College" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" TEXT,
    "province" TEXT,
    "district" TEXT,
    "city" TEXT,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "affiliation" TEXT,
    "type" TEXT NOT NULL DEFAULT 'PRIVATE',
    "establishedYear" INTEGER,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "logo" TEXT,
    "coverImage" TEXT,
    "gallery" TEXT,
    "programs" TEXT,
    "facilities" TEXT,
    "admissionProcess" TEXT,
    "feesRange" TEXT,
    "scholarshipsAvailable" BOOLEAN NOT NULL DEFAULT false,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "College_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" TEXT,
    "province" TEXT,
    "district" TEXT,
    "city" TEXT,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "level" TEXT,
    "type" TEXT NOT NULL DEFAULT 'PRIVATE',
    "affiliation" TEXT,
    "establishedYear" INTEGER,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "logo" TEXT,
    "coverImage" TEXT,
    "gallery" TEXT,
    "facilities" TEXT,
    "programs" TEXT,
    "feesRange" TEXT,
    "admissionProcess" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "University" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "establishedYear" INTEGER,
    "province" TEXT,
    "city" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "logo" TEXT,
    "coverImage" TEXT,
    "type" TEXT NOT NULL DEFAULT 'PUBLIC',
    "ranking" INTEGER,
    "totalCampuses" INTEGER NOT NULL DEFAULT 0,
    "totalStudents" INTEGER,
    "programs" TEXT,
    "faculties" TEXT,
    "admissionProcess" TEXT,
    "notices" TEXT,
    "results" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "University_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scholarship" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "provider" TEXT,
    "providerUrl" TEXT,
    "categoryId" TEXT,
    "level" TEXT,
    "field" TEXT,
    "amount" TEXT,
    "eligibility" TEXT,
    "deadline" TIMESTAMP(3),
    "applicationOpen" TIMESTAMP(3),
    "applicationUrl" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Nepal',
    "province" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "coverImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scholarship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "categoryId" TEXT,
    "authorId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "readTimeMin" INTEGER NOT NULL DEFAULT 5,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrendingSearch" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "module" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrendingSearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bank" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'COMMERCIAL',
    "establishedYear" INTEGER,
    "headquarters" TEXT,
    "website" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "logo" TEXT,
    "swiftCode" TEXT,
    "savingsRateMin" DOUBLE PRECISION,
    "savingsRateMax" DOUBLE PRECISION,
    "fixedDepositRateMin" DOUBLE PRECISION,
    "fixedDepositRateMax" DOUBLE PRECISION,
    "branchCount" INTEGER,
    "atmCount" INTEGER,
    "mobileBanking" BOOLEAN NOT NULL DEFAULT false,
    "internetBanking" BOOLEAN NOT NULL DEFAULT false,
    "cards" TEXT,
    "loans" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "companyLogo" TEXT,
    "location" TEXT,
    "jobType" TEXT NOT NULL DEFAULT 'FULL_TIME',
    "category" TEXT,
    "experienceLevel" TEXT NOT NULL DEFAULT 'ENTRY',
    "salaryMin" INTEGER,
    "salaryMax" INTEGER,
    "salaryCurrency" TEXT NOT NULL DEFAULT 'NPR',
    "applicationUrl" TEXT,
    "applicationEmail" TEXT,
    "deadline" TIMESTAMP(3),
    "skills" TEXT,
    "qualifications" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GovernmentService" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'CITIZENSHIP',
    "ministry" TEXT,
    "department" TEXT,
    "office" TEXT,
    "applicationUrl" TEXT,
    "applicationFee" TEXT,
    "processingTime" TEXT,
    "requiredDocuments" TEXT,
    "steps" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GovernmentService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Webhook" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "events" TEXT NOT NULL,
    "secret" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastTriggered" TIMESTAMP(3),
    "lastStatus" TEXT,
    "lastResponse" TEXT,
    "triggerCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Webhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookLog" (
    "id" TEXT NOT NULL,
    "webhookId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "statusCode" INTEGER,
    "response" TEXT,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiChatSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionUuid" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'New Conversation',
    "messageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiChatSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiChatMessage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tokensUsed" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuestPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "categoryId" TEXT,
    "authorId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorBio" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuestPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityQuestion" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "optionA" TEXT NOT NULL,
    "optionB" TEXT NOT NULL,
    "optionC" TEXT NOT NULL,
    "optionD" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "explanation" TEXT,
    "examId" TEXT,
    "categoryId" TEXT,
    "submitterId" TEXT NOT NULL,
    "submitterName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "parentId" TEXT,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BlogPostToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BlogPostToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expires_idx" ON "Session"("expires");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_email_idx" ON "PasswordResetToken"("email");

-- CreateIndex
CREATE INDEX "PasswordResetToken_token_expires_idx" ON "PasswordResetToken"("token", "expires");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_entity_entityId_key" ON "Bookmark"("userId", "entity", "entityId");

-- CreateIndex
CREATE INDEX "Notification_userId_read_createdAt_idx" ON "Notification"("userId", "read", "createdAt");

-- CreateIndex
CREATE INDEX "SearchHistory_userId_idx" ON "SearchHistory"("userId");

-- CreateIndex
CREATE INDEX "SearchHistory_createdAt_idx" ON "SearchHistory"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_entity_entityId_key" ON "Review"("userId", "entity", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "Exam_slug_key" ON "Exam"("slug");

-- CreateIndex
CREATE INDEX "Exam_parentId_idx" ON "Exam"("parentId");

-- CreateIndex
CREATE INDEX "Exam_isParent_isPublished_idx" ON "Exam"("isParent", "isPublished");

-- CreateIndex
CREATE INDEX "Exam_categoryId_isPublished_order_idx" ON "Exam"("categoryId", "isPublished", "order");

-- CreateIndex
CREATE INDEX "Exam_slug_isPublished_idx" ON "Exam"("slug", "isPublished");

-- CreateIndex
CREATE INDEX "ExamQuestion_examId_order_idx" ON "ExamQuestion"("examId", "order");

-- CreateIndex
CREATE INDEX "ExamAttempt_examId_score_idx" ON "ExamAttempt"("examId", "score");

-- CreateIndex
CREATE INDEX "ExamAttempt_userId_finishedAt_idx" ON "ExamAttempt"("userId", "finishedAt");

-- CreateIndex
CREATE INDEX "ExamAttempt_userId_idx" ON "ExamAttempt"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "College_slug_key" ON "College"("slug");

-- CreateIndex
CREATE INDEX "College_isPublished_isFeatured_rating_idx" ON "College"("isPublished", "isFeatured", "rating");

-- CreateIndex
CREATE INDEX "College_province_idx" ON "College"("province");

-- CreateIndex
CREATE INDEX "College_categoryId_idx" ON "College"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "School_slug_key" ON "School"("slug");

-- CreateIndex
CREATE INDEX "School_isPublished_isFeatured_rating_idx" ON "School"("isPublished", "isFeatured", "rating");

-- CreateIndex
CREATE INDEX "School_province_idx" ON "School"("province");

-- CreateIndex
CREATE INDEX "School_categoryId_idx" ON "School"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "University_slug_key" ON "University"("slug");

-- CreateIndex
CREATE INDEX "University_isPublished_isFeatured_rating_idx" ON "University"("isPublished", "isFeatured", "rating");

-- CreateIndex
CREATE INDEX "University_city_idx" ON "University"("city");

-- CreateIndex
CREATE UNIQUE INDEX "Scholarship_slug_key" ON "Scholarship"("slug");

-- CreateIndex
CREATE INDEX "Scholarship_isPublished_deadline_idx" ON "Scholarship"("isPublished", "deadline");

-- CreateIndex
CREATE INDEX "Scholarship_isPublished_isFeatured_idx" ON "Scholarship"("isPublished", "isFeatured");

-- CreateIndex
CREATE INDEX "Scholarship_categoryId_idx" ON "Scholarship"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_status_publishedAt_idx" ON "BlogPost"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "BlogPost_slug_idx" ON "BlogPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TrendingSearch_query_key" ON "TrendingSearch"("query");

-- CreateIndex
CREATE UNIQUE INDEX "Bank_slug_key" ON "Bank"("slug");

-- CreateIndex
CREATE INDEX "Bank_isPublished_isFeatured_rating_idx" ON "Bank"("isPublished", "isFeatured", "rating");

-- CreateIndex
CREATE INDEX "Bank_type_idx" ON "Bank"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Job_slug_key" ON "Job"("slug");

-- CreateIndex
CREATE INDEX "Job_jobType_isPublished_idx" ON "Job"("jobType", "isPublished");

-- CreateIndex
CREATE INDEX "Job_category_isPublished_idx" ON "Job"("category", "isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "GovernmentService_slug_key" ON "GovernmentService"("slug");

-- CreateIndex
CREATE INDEX "GovernmentService_category_isPublished_idx" ON "GovernmentService"("category", "isPublished");

-- CreateIndex
CREATE INDEX "Webhook_isActive_idx" ON "Webhook"("isActive");

-- CreateIndex
CREATE INDEX "WebhookLog_webhookId_createdAt_idx" ON "WebhookLog"("webhookId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AiChatSession_sessionUuid_key" ON "AiChatSession"("sessionUuid");

-- CreateIndex
CREATE INDEX "AiChatSession_userId_idx" ON "AiChatSession"("userId");

-- CreateIndex
CREATE INDEX "AiChatMessage_sessionId_createdAt_idx" ON "AiChatMessage"("sessionId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "GuestPost_slug_key" ON "GuestPost"("slug");

-- CreateIndex
CREATE INDEX "GuestPost_status_createdAt_idx" ON "GuestPost"("status", "createdAt");

-- CreateIndex
CREATE INDEX "CommunityQuestion_status_createdAt_idx" ON "CommunityQuestion"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Comment_entity_entityId_createdAt_idx" ON "Comment"("entity", "entityId", "createdAt");

-- CreateIndex
CREATE INDEX "_BlogPostToTag_B_index" ON "_BlogPostToTag"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchHistory" ADD CONSTRAINT "SearchHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamQuestion" ADD CONSTRAINT "ExamQuestion_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAttempt" ADD CONSTRAINT "ExamAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAttempt" ADD CONSTRAINT "ExamAttempt_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "College" ADD CONSTRAINT "College_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scholarship" ADD CONSTRAINT "Scholarship_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebhookLog" ADD CONSTRAINT "WebhookLog_webhookId_fkey" FOREIGN KEY ("webhookId") REFERENCES "Webhook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiChatSession" ADD CONSTRAINT "AiChatSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiChatMessage" ADD CONSTRAINT "AiChatMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AiChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestPost" ADD CONSTRAINT "GuestPost_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestPost" ADD CONSTRAINT "GuestPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityQuestion" ADD CONSTRAINT "CommunityQuestion_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityQuestion" ADD CONSTRAINT "CommunityQuestion_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityQuestion" ADD CONSTRAINT "CommunityQuestion_submitterId_fkey" FOREIGN KEY ("submitterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogPostToTag" ADD CONSTRAINT "_BlogPostToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogPostToTag" ADD CONSTRAINT "_BlogPostToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

