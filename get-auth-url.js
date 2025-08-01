#!/usr/bin/env node
/**
 * Get OAuth URL for Clio
 */

import { loadConfig } from './src/config.js';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function getAuthUrl() {
  const config = await loadConfig();
  const redirectUri = 'http://localhost:3000/callback';
  
  const authUrl = `https://app.clio.com/oauth/authorize?` +
    `response_type=code&` +
    `client_id=${config.clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}`;
  
  log('\n🔐 Clio OAuth Authorization', colors.bright + colors.cyan);
  log('=' .repeat(60), colors.cyan);
  
  log('\n1️⃣  Visit this URL in your browser:', colors.yellow);
  log(authUrl, colors.bright + colors.blue);
  
  log('\n2️⃣  After authorizing, you\'ll be redirected to:', colors.yellow);
  log(`${redirectUri}?code=YOUR_AUTH_CODE`, colors.blue);
  
  log('\n3️⃣  Copy the code from the URL and use it with exchange-code.js', colors.yellow);
  
  log('\n' + '=' .repeat(60), colors.cyan);
}

getAuthUrl().catch(error => {
  log(`\n💥 Error: ${error.message}`, colors.bright + colors.red);
  process.exit(1);
});