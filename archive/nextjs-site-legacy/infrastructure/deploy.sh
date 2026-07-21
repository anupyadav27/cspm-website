#!/usr/bin/env bash
# deploy.sh — full deploy pipeline for cspm-docs-website
#
# Prerequisites:
#   - AWS CLI configured (aws sts get-caller-identity should succeed)
#   - AWS SAM CLI installed (brew install aws-sam-cli)
#   - Node.js 20+ installed
#   - SES sender email verified in the target region
#
# Usage:
#   FROM_EMAIL=noreply@yourdomain.com \
#   NOTIFY_EMAIL=team@yourdomain.com  \
#   ./infrastructure/deploy.sh
#
# Optional env vars:
#   STACK_NAME  (default: cspm-docs)
#   AWS_REGION  (default: ap-south-1)

set -euo pipefail

STACK_NAME="${STACK_NAME:-cspm-docs}"
REGION="${AWS_REGION:-ap-south-1}"
FROM_EMAIL="${FROM_EMAIL:-sales@lgtech.in}"
NOTIFY_EMAIL="${NOTIFY_EMAIL:-sales@lgtech.in}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

sep() { echo; echo "──────────────────────────────────────────"; echo "▶ $1"; echo "──────────────────────────────────────────"; }

# ── Step 1: Build Next.js static export ──────────────────────────────────────
sep "Building Next.js static export"
cd "$ROOT_DIR"
npm ci --prefer-offline
npm run build
echo "Static export written to: $ROOT_DIR/out/"

# ── Step 2: Package & deploy SAM stack ───────────────────────────────────────
sep "Deploying SAM stack: $STACK_NAME ($REGION)"
cd "$SCRIPT_DIR"
sam deploy \
  --template-file template.yaml \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
    "AppName=${STACK_NAME}" \
    "FromEmail=${FROM_EMAIL}" \
    "NotifyEmail=${NOTIFY_EMAIL}" \
  --resolve-s3 \
  --no-fail-on-empty-changeset

# ── Step 3: Read stack outputs ────────────────────────────────────────────────
sep "Reading stack outputs"
get_output() {
  aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --query "Stacks[0].Outputs[?OutputKey=='$1'].OutputValue" \
    --output text
}

BUCKET=$(get_output BucketName)
DIST_ID=$(get_output DistributionId)
SITE_URL=$(get_output DistributionDomain)
API_URL=$(get_output ApiEndpoint)

echo "  Bucket:  $BUCKET"
echo "  Dist ID: $DIST_ID"
echo "  Site:    $SITE_URL"
echo "  API:     $API_URL"

# ── Step 4: Sync static files to S3 ──────────────────────────────────────────
sep "Syncing static files to s3://$BUCKET"

# Long-lived cache for immutable assets (JS, CSS, images, fonts)
aws s3 sync "$ROOT_DIR/out/" "s3://$BUCKET/" \
  --delete \
  --region "$REGION" \
  --exclude "*.html" \
  --cache-control "public,max-age=31536000,immutable"

# No cache for HTML (always fetch latest)
aws s3 sync "$ROOT_DIR/out/" "s3://$BUCKET/" \
  --delete \
  --region "$REGION" \
  --exclude "*" \
  --include "*.html" \
  --cache-control "public,max-age=0,must-revalidate"

echo "Sync complete."

# ── Step 5: Index docs content into DynamoDB ──────────────────────────────────
sep "Indexing docs content for search"
SEARCH_TABLE="${STACK_NAME}-search" \
AWS_REGION="$REGION" \
  node "$SCRIPT_DIR/index-content.mjs"

# ── Step 6: CloudFront cache invalidation ─────────────────────────────────────
sep "Invalidating CloudFront cache ($DIST_ID)"
INV_ID=$(aws cloudfront create-invalidation \
  --distribution-id "$DIST_ID" \
  --paths "/*" \
  --query 'Invalidation.Id' \
  --output text)
echo "Invalidation created: $INV_ID"

# ── Done ──────────────────────────────────────────────────────────────────────
echo
echo "╔══════════════════════════════════════════════╗"
echo "  Deploy complete!"
echo "  Site:  $SITE_URL"
echo "  API:   $API_URL (proxied via CloudFront at /api/*)"
echo "╚══════════════════════════════════════════════╝"
