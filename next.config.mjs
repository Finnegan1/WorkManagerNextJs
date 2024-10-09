/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    env: {
        DATABASE_URL: process.env.DATABASE_URL,
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASS: process.env.EMAIL_PASS,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXTAUTH_SALT: process.env.NEXTAUTH_SALT,
        GOTENBERG_URL: process.env.GOTENBERG_URL,
        TEMPLATES_GITHUB_REPO: process.env.TEMPLATES_GITHUB_REPO,
    }
};

export default nextConfig;
