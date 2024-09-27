import { headers, cookies } from 'next/headers'
import { getToken } from 'next-auth/jwt'
import jwt from 'jsonwebtoken'
import { CustomJWT } from 'next-auth'

export async function getSignedToken() {
    // Obtain headers and cookies
    const reqHeaders = Object.fromEntries(headers())
    const reqCookies = Object.fromEntries(
        cookies()
            .getAll()
            .map((c) => [c.name, c.value])
    )

    const token = await getToken({
        // @ts-expect-error Create a custom request object
        req: {
            headers: reqHeaders,
            cookies: reqCookies
        }
    })

    if (token == null) {
        throw new Error('Token not found')
    }

    // Sign the token using the secret key
    const secret = process.env.NEXTAUTH_SECRET as string
    return jwt.sign(token, secret)
}

//equivalent to getToken() => get decoded token
export async function getDecodedToken(): Promise<CustomJWT> {
    const token = await getSignedToken()
    const secret = process.env.NEXTAUTH_SECRET as string
    const decoded = jwt.verify(token, secret) as CustomJWT
    return decoded
}