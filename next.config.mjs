/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint : {
        ignoreDuringBuilds : true
    },
    images : {
        remotePatterns : [
            {
                hostname : "lh3.googleusercontent.com"
            },
            {
                hostname : "wandering-orca-326.convex.cloud"
            },
        ]
    }
};

export default nextConfig;
