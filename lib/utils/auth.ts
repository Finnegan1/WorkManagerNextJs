import { headers, cookies } from 'next/headers'
import { getToken } from 'next-auth/jwt'
import jwt from 'jsonwebtoken'
import { JWT } from 'next-auth/jwt'

/**
 * Returns the still signed JWT as a string.
 * @returns {Promise<string>}
 */
export async function tokenSigned() {
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


/**
 * Return the decoded JWT content.
 * Equivalent to getToken() but for server actions with no request object
 * @returns {Promise<JWT>}
 */
export async function tokenDecoded(): Promise<JWT> {
    const token = await tokenSigned()
    const secret = process.env.NEXTAUTH_SECRET as string
    const decoded = jwt.verify(token, secret) as JWT
    return decoded
}