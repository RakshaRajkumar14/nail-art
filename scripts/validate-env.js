#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 * Run this before deployment to verify all required environment variables are set
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_ENV = {
  production: [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'ADMIN_SECRET',
    'ADMIN_EMAIL',
    'NEXT_PUBLIC_IMAGE_DOMAIN',
  ],
  preview: [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'ADMIN_SECRET',
    'ADMIN_EMAIL',
    'NEXT_PUBLIC_IMAGE_DOMAIN',
  ],
  development: [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ],
};

const OPTIONAL_ENV = {
  production: [
    'NEXT_PUBLIC_ANALYTICS_ID',
    'NEXT_PUBLIC_SENTRY_DSN',
    'NEXT_PUBLIC_RESEND_API_KEY',
    'NEXT_PUBLIC_WHATSAPP_BUSINESS_PHONE_ID',
  ],
  preview: [
    'NEXT_PUBLIC_ANALYTICS_ID',
    'NEXT_PUBLIC_SENTRY_DSN',
    'NEXT_PUBLIC_RESEND_API_KEY',
  ],
  development: [],
};

function validateEnvironment() {
  const env = process.env.NODE_ENV || 'development';
  const envFile = env === 'production'
    ? '.env.production'
    : env === 'preview'
    ? '.env.preview'
    : '.env.development';

  console.log(`\n🔍 Validating ${env.toUpperCase()} environment variables...\n`);

  const required = REQUIRED_ENV[env] || [];
  const optional = OPTIONAL_ENV[env] || [];

  let missing = [];
  let warnings = [];
  let success = [];

  // Check required variables
  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
      console.log(`❌ MISSING (Required): ${key}`);
    } else {
      success.push(key);
      console.log(`✅ SET: ${key}`);
    }
  }

  // Check optional variables
  for (const key of optional) {
    if (!process.env[key]) {
      warnings.push(key);
      console.log(`⚠️  NOT SET (Optional): ${key}`);
    } else {
      console.log(`✅ SET: ${key}`);
    }
  }

  console.log(`\n📊 Summary:\n`);
  console.log(`✅ Required Variables Set: ${required.length - missing.length}/${required.length}`);
  console.log(`⚠️  Optional Variables Set: ${optional.length - warnings.length}/${optional.length}`);
  console.log(`❌ Missing Variables: ${missing.length}`);

  if (missing.length > 0) {
    console.log(`\n❌ VALIDATION FAILED!\n`);
    console.log(`Missing required environment variables:`);
    missing.forEach(m => console.log(`  - ${m}`));
    console.log(`\nPlease set these variables before deploying.\n`);
    process.exit(1);
  }

  if (warnings.length > 0 && env === 'production') {
    console.log(`\n⚠️  WARNING: Optional variables missing in production:\n`);
    warnings.forEach(w => console.log(`  - ${w}`));
  }

  console.log(`\n✅ VALIDATION PASSED!\n`);
  console.log(`All required variables are set for ${env} deployment.\n`);
}

validateEnvironment();
