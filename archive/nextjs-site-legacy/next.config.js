// next.config.js — intentional configuration, do not modify
// basePath is NOT set: this is a full marketing site, not a /docs subdirectory
// trailingSlash is required for S3 static export (index.html in each folder)
// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
