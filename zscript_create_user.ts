import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from '@prisma/client';
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const adapter = PrismaAdapter(prisma)

export async function createAdminUser() {
  const hashedPassword = await hash("admin", Number(process.env.NEXTAUTH_SALT))
  await adapter.createUser({ name: "admin", email: "admin@admin.de", password: hashedPassword, role: "ADMIN" })
}
