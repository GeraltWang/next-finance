'use server'
import prisma from "@/lib/prisma"

export const getUserByClerkUserId = async (clerkUserId: string) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: clerkUserId
      }
    })

    return existingUser
  } catch {
    return null
  }
}