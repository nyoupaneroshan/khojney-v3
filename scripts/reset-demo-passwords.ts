/**
 * reset-demo-passwords.ts — Fix demo accounts so they can log in.
 *
 * The old seed created users with fake password hashes ("demo", "demo-hash-admin",
 * "demo-hash-user"). The security upgrade added real bcrypt verification, which
 * rejects all these hashes. This script sets real bcrypt hashes for the demo
 * accounts so you can actually log in.
 *
 * Run: `bun run scripts/reset-demo-passwords.ts`
 *
 * After running, you can log in with:
 *   admin@khojney.com / Khojney@Admin2025
 *   user@khojney.com  / Khojney@User2025
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const BCRYPT_ROUNDS = 12;

const accountsToFix = [
  {
    email: "admin@khojney.com",
    newPassword: "Khojney@Admin2025",
    role: "SUPER_ADMIN",
  },
  {
    email: "user@khojney.com",
    newPassword: "Khojney@User2025",
    role: "USER",
  },
];

async function main() {
  console.log("\n🔐 Resetting demo account passwords...\n");

  for (const account of accountsToFix) {
    const user = await db.user.findUnique({
      where: { email: account.email },
      select: { id: true, email: true, passwordHash: true, role: true },
    });

    if (!user) {
      console.log(`  ⚠ User not found: ${account.email} — skipping`);
      continue;
    }

    const hash = await bcrypt.hash(account.newPassword, BCRYPT_ROUNDS);

    await db.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hash,
        role: account.role,
        isActive: true,
      },
    });

    console.log(`  ✓ Reset password for: ${account.email}`);
    console.log(`    Email:    ${account.email}`);
    console.log(`    Password: ${account.newPassword}`);
    console.log(`    Role:     ${account.role}`);
    console.log("");
  }

  // Also fix any other users with "demo" or "demo-hash-*" passwords — set a
  // default password they can use. These are seed users (anita@example.com, etc.)
  const demoUsers = await db.user.findMany({
    where: {
      OR: [
        { passwordHash: "demo" },
        { passwordHash: { startsWith: "demo-hash-" } },
      ],
    },
    select: { id: true, email: true },
  });

  if (demoUsers.length > 0) {
    const defaultHash = await bcrypt.hash("Khojney@2025", BCRYPT_ROUNDS);
    for (const u of demoUsers) {
      await db.user.update({
        where: { id: u.id },
        data: { passwordHash: defaultHash, isActive: true },
      });
      console.log(`  ✓ Reset password for: ${u.email} (password: Khojney@2025)`);
    }
  }

  console.log("\n✅ Done! You can now log in with:");
  console.log("   admin@khojney.com / Khojney@Admin2025");
  console.log("   user@khojney.com  / Khojney@User2025");
  console.log("");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
