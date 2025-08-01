#!/usr/bin/env node
/**
 * Exchange authorization code for access token
 */

import { loadConfig } from './src/config.js';
import { exchangeCodeForToken } from './src/auth.js';
import fs from 'fs';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function exchange() {
  const code = process.argv[2];
  
  if (!code) {
    log('\n❌ Usage: node exchange-code.js YOUR_AUTH_CODE', colors.red);
    log('Example: node exchange-code.js 3QXfDkp2sO1XScdAykjf', colors.yellow);
    process.exit(1);
  }
  
  log('\n🔄 Exchanging authorization code for access token...', colors.cyan);
  
  try {
    const config = await loadConfig();
    const redirectUri = 'http://localhost:3000/callback';
    
    const result = await exchangeCodeForToken(code, redirectUri, config);
    
    log('\n✅ Success!', colors.bright + colors.green);
    log(`Access Token: ${result.access_token}`, colors.green);
    
    if (result.refresh_token) {
      log(`Refresh Token: ${result.refresh_token}`, colors.green);
    }
    
    // Update config file
    const newConfig = {
      ...config,
      accessToken: result.access_token,
      refreshToken: result.refresh_token
    };
    
    fs.writeFileSync(
      'clio-config.json',
      JSON.stringify(newConfig, null, 2)
    );
    
    log('\n💾 Configuration saved to clio-config.json', colors.green);
    log('✅ You can now run the test scripts!', colors.bright + colors.green);
    
  } catch (error) {
    log(`\n❌ Error: ${error.message}`, colors.red);
    if (error.message.includes('invalid_grant')) {
      log('The authorization code may have expired or been used already.', colors.yellow);
      log('Please run get-auth-url.js again to get a new code.', colors.yellow);
    }
  }
}

exchange().catch(error => {
  log(`\n💥 Fatal error: ${error.message}`, colors.bright + colors.red);
  process.exit(1);
});