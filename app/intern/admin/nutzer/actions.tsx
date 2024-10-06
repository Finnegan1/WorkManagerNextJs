"use server"
import prisma from '@/lib/prisma'
import { sendAccountCreatedEmail } from '@/lib/email'
import { Role } from '@prisma/client'
import { hash } from 'bcryptjs'

export async function CreateUser(formData: FormData) {
    const email = formData.get('email') as string
    const role = (formData.get('role') as string).toUpperCase()

    if (!Object.values(Role).includes(role as Role)) {
        console.error('Invalid role')
        return
    }

    const password = Math.random().toString(36).slice(-8)
    const hashedPassword = await hash(password, Number(process.env.NEXTAUTH_SALT))
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role: role as Role
        }
    })

    await sendAccountCreatedEmail(email, password)

    return {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
    }
}

export async function DeleteUser(id: string) {
    await prisma.user.delete({
        where: {
            id
        }
    })
}