#!/usr/bin/env node
/**
 * Direct API test for Phase 2 features
 */

import { loadConfig } from './src/config.js';
import { makeClioRequest } from './src/api.js';

// ANSI color codes
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

async function runTests() {
  log('\n🧪 Testing Phase 2 Features Directly', colors.bright + colors.green);
  log('=' .repeat(50), colors.green);
  
  const config = await loadConfig();
  const contactId = 330298962; // Known contact from previous tests
  
  try {
    // Test 1: Get contact emails
    log('\n📧 Testing: Get Contact Emails', colors.cyan);
    try {
      const emails = await makeClioRequest(
        `/contacts/${contactId}/email_addresses`,
        'GET',
        null,
        config.accessToken,
        config
      );
      log('✅ Success!', colors.green);
      log(`Found ${emails.email_addresses?.length || 0} email(s)`, colors.blue);
      if (emails.email_addresses?.length > 0) {
        log(`Primary: ${emails.email_addresses[0].address}`, colors.blue);
      }
    } catch (error) {
      log(`❌ Failed: ${error.message}`, colors.red);
    }
    
    // Test 2: Get contact phones
    log('\n📞 Testing: Get Contact Phones', colors.cyan);
    try {
      const phones = await makeClioRequest(
        `/contacts/${contactId}/phone_numbers`,
        'GET',
        null,
        config.accessToken,
        config
      );
      log('✅ Success!', colors.green);
      log(`Found ${phones.phone_numbers?.length || 0} phone(s)`, colors.blue);
      if (phones.phone_numbers?.length > 0) {
        log(`Primary: ${phones.phone_numbers[0].number}`, colors.blue);
      }
    } catch (error) {
      log(`❌ Failed: ${error.message}`, colors.red);
    }
    
    // Test 3: Add a test email
    log('\n✉️ Testing: Add Contact Email', colors.cyan);
    try {
      const newEmail = await makeClioRequest(
        `/contacts/${contactId}/email_addresses`,
        'POST',
        {
          data: {
            address: `test-${Date.now()}@example.com`,
            name: 'Test Email',
            default_email: false,
          }
        },
        config.accessToken,
        config
      );
      log('✅ Success!', colors.green);
      log(`Added: ${newEmail.data?.address}`, colors.blue);
    } catch (error) {
      log(`❌ Failed: ${error.message}`, colors.red);
    }
    
    // Test 4: Get communications
    log('\n📋 Testing: Get Communications', colors.cyan);
    try {
      const comms = await makeClioRequest(
        `/communications?contact_id=${contactId}&limit=5`,
        'GET',
        null,
        config.accessToken,
        config
      );
      log('✅ Success!', colors.green);
      log(`Found ${comms.data?.length || 0} communication(s)`, colors.blue);
    } catch (error) {
      log(`❌ Failed: ${error.message}`, colors.red);
    }
    
    // Test 5: Test Clio Grow endpoints
    log('\n🌱 Testing: Clio Grow Lead Submission', colors.cyan);
    try {
      // Note: This might fail if Clio Grow is not enabled
      const leadData = {
        data: {
          first_name: 'Test',
          last_name: `Lead-${Date.now()}`,
          email: `testlead-${Date.now()}@example.com`,
          phone: '555-0123',
          practice_area: 'Personal Injury',
          referral_source: 'Website',
          message: 'Testing Phase 2 lead submission',
          urgency: 'medium',
          submitted_at: new Date().toISOString(),
        }
      };
      
      // Try US Grow endpoint
      const growConfig = { ...config };
      growConfig.apiBase = 'https://grow.clio.com/api/v1';
      
      const lead = await makeClioRequest(
        '/leads',
        'POST',
        leadData,
        config.accessToken,
        growConfig
      );
      log('✅ Success!', colors.green);
      log(`Lead created with ID: ${lead.data?.id}`, colors.blue);
    } catch (error) {
      log(`❌ Failed: ${error.message}`, colors.red);
      if (error.message.includes('404') || error.message.includes('401')) {
        log('Note: Clio Grow may not be enabled for this account', colors.yellow);
      }
    }
    
  } catch (error) {
    log(`\n💥 Test error: ${error.message}`, colors.bright + colors.red);
  }
  
  log('\n' + '=' .repeat(50), colors.green);
  log('✅ Direct API tests completed', colors.bright + colors.green);
}

// Run tests
runTests().catch(error => {
  log(`\n💥 Fatal error: ${error.message}`, colors.bright + colors.red);
  process.exit(1);
});