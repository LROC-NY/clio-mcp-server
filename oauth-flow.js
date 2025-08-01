#!/usr/bin/env node
/**
 * OAuth flow helper for Clio MCP Server
 * Run this to get a fresh access token
 */

import { loadConfig } from './src/config.js';
import readline from 'readline';
import { spawn } from 'child_process';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

async function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function runOAuthFlow() {
  log('\n🔐 Clio OAuth Flow Setup', colors.bright + colors.cyan);
  log('=' .repeat(50), colors.cyan);
  
  const config = await loadConfig();
  
  // Step 1: Generate auth URL
  const redirectUri = 'http://localhost:3000/callback';
  const authUrl = `https://app.clio.com/oauth/authorize?` +
    `response_type=code&` +
    `client_id=${config.clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}`;
  
  log('\n📋 Step 1: Authorization', colors.yellow);
  log('Visit this URL in your browser:', colors.reset);
  log(authUrl, colors.bright + colors.blue);
  
  log('\n📋 Step 2: After authorizing, you\'ll be redirected to:', colors.yellow);
  log(`${redirectUri}?code=YOUR_AUTH_CODE`, colors.blue);
  
  const code = await question('\n✏️  Enter the authorization code from the URL: ');
  
  if (!code) {
    log('❌ No code provided', colors.red);
    process.exit(1);
  }
  
  log('\n📋 Step 3: Exchanging code for access token...', colors.yellow);
  
  // Use the exchange_code tool
  const server = spawn('node', ['src/index.js'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env },
  });
  
  let output = '';
  let error = '';
  
  server.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  server.stderr.on('data', (data) => {
    error += data.toString();
  });
  
  // Send exchange_code request
  const request = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'exchange_code',
      arguments: {
        code: code.trim(),
        redirect_uri: redirectUri
      },
    },
  };
  
  server.stdin.write(JSON.stringify(request) + '\n');
  
  // Wait for response
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      server.kill();
      reject(new Error('Timeout'));
    }, 10000);
    
    server.on('close', () => {
      resolve();
    });
  });
  
  // Parse response
  try {
    const lines = output.split('\n').filter(line => line.trim());
    const responseLine = lines.find(line => line.includes('"jsonrpc"'));
    
    if (responseLine) {
      const response = JSON.parse(responseLine);
      if (response.result?.content?.[0]?.text) {
        const text = response.result.content[0].text;
        
        // Extract access token from response
        const tokenMatch = text.match(/Access Token: ([^\s\n]+)/);
        if (tokenMatch) {
          const accessToken = tokenMatch[1];
          
          log('\n✅ Success! Access token obtained', colors.green);
          log(`Access Token: ${accessToken}`, colors.bright + colors.green);
          
          // Save to config file
          const newConfig = {
            ...config,
            accessToken: accessToken
          };
          
          const fs = await import('fs');
          fs.writeFileSync(
            'clio-config.json',
            JSON.stringify(newConfig, null, 2)
          );
          
          log('\n💾 Configuration saved to clio-config.json', colors.green);
          log('You can now run the test scripts!', colors.bright + colors.green);
        } else {
          log('❌ Could not extract access token from response', colors.red);
          log('Response:', colors.yellow);
          log(text, colors.reset);
        }
      } else if (response.error) {
        log(`❌ Error: ${response.error.message}`, colors.red);
      }
    } else {
      log('❌ No valid response received', colors.red);
      if (error) {
        log('Server error:', colors.red);
        log(error, colors.reset);
      }
    }
  } catch (err) {
    log(`❌ Error parsing response: ${err.message}`, colors.red);
  }
  
  rl.close();
}

// Run the flow
runOAuthFlow().catch(error => {
  log(`\n💥 Error: ${error.message}`, colors.bright + colors.red);
  rl.close();
  process.exit(1);
});