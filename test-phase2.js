#!/usr/bin/env node
/**
 * Test script for Phase 2: Client Communication features
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test configuration
const testConfig = {
  contactId: 330298962, // Using a known contact ID from previous tests
  matterId: 74890078,   // Using a known matter ID
};

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

async function runTest(toolName, args) {
  return new Promise((resolve, reject) => {
    log(`\n${colors.bright}Testing: ${toolName}${colors.reset}`, colors.cyan);
    log(`Args: ${JSON.stringify(args)}`, colors.blue);
    
    const server = spawn('node', [join(__dirname, 'src', 'index.js')], {
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
    
    // Send request
    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args,
      },
    };
    
    server.stdin.write(JSON.stringify(request) + '\n');
    
    // Set timeout
    setTimeout(() => {
      server.kill();
      reject(new Error('Test timeout'));
    }, 30000);
    
    server.on('close', (code) => {
      try {
        const lines = output.split('\n').filter(line => line.trim());
        const responseLine = lines.find(line => line.includes('"jsonrpc"'));
        
        if (responseLine) {
          const response = JSON.parse(responseLine);
          if (response.result) {
            resolve(response.result);
          } else if (response.error) {
            reject(new Error(response.error.message));
          }
        } else {
          reject(new Error('No valid response'));
        }
      } catch (err) {
        reject(err);
      }
    });
  });
}

async function runTests() {
  log('\n🧪 Starting Phase 2 Client Communication Tests', colors.bright + colors.green);
  log('=' .repeat(50), colors.green);
  
  const tests = [
    // Enhanced Contact Management Tests
    {
      name: 'get_contact_emails',
      args: { contact_id: testConfig.contactId },
      description: 'Get email addresses for a contact',
    },
    {
      name: 'get_contact_phones',
      args: { contact_id: testConfig.contactId },
      description: 'Get phone numbers for a contact',
    },
    {
      name: 'add_contact_email',
      args: {
        contact_id: testConfig.contactId,
        address: `test-${Date.now()}@example.com`,
        name: 'Test Email',
        default_email: false,
      },
      description: 'Add new email to contact',
    },
    {
      name: 'add_contact_phone',
      args: {
        contact_id: testConfig.contactId,
        number: `555-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        name: 'Test Phone',
        default_number: false,
      },
      description: 'Add new phone to contact',
    },
    {
      name: 'get_contact_communications',
      args: {
        contact_id: testConfig.contactId,
        limit: 5,
      },
      description: 'Get communication history',
    },
    {
      name: 'log_communication',
      args: {
        contact_id: testConfig.contactId,
        matter_id: testConfig.matterId,
        type: 'phone_call',
        subject: 'Test Call - Phase 2 Testing',
        body: 'This is a test communication logged during Phase 2 feature testing.',
        date: new Date().toISOString().split('T')[0],
        duration: 15,
      },
      description: 'Log a test communication',
    },
    
    // Clio Grow Lead Management Tests
    {
      name: 'submit_lead',
      args: {
        first_name: 'Test',
        last_name: `Lead-${Date.now()}`,
        email: `testlead-${Date.now()}@example.com`,
        phone: '555-0123',
        practice_area: 'Personal Injury',
        referral_source: 'Website',
        message: 'Testing Phase 2 lead submission functionality',
        urgency: 'medium',
      },
      description: 'Submit a test lead to Clio Grow',
    },
    {
      name: 'get_leads',
      args: {
        limit: 5,
        status: 'new',
      },
      description: 'Get recent leads',
    },
    {
      name: 'get_lead_analytics',
      args: {
        date_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        date_to: new Date().toISOString().split('T')[0],
        group_by: 'source',
      },
      description: 'Get lead analytics for last 30 days',
    },
  ];
  
  let passedTests = 0;
  let failedTests = 0;
  
  for (const test of tests) {
    try {
      log(`\n📋 ${test.description}`, colors.yellow);
      const result = await runTest(test.name, test.args);
      
      if (result.content && result.content[0]) {
        const data = JSON.parse(result.content[0].text);
        log('✅ Test passed', colors.green);
        
        // Show relevant results
        if (test.name === 'get_contact_emails' && data.email_addresses) {
          log(`Found ${data.email_addresses.length} email(s)`, colors.cyan);
        } else if (test.name === 'get_contact_phones' && data.phone_numbers) {
          log(`Found ${data.phone_numbers.length} phone(s)`, colors.cyan);
        } else if (test.name === 'add_contact_email' && data.data) {
          log(`Added email: ${data.data.address}`, colors.cyan);
        } else if (test.name === 'add_contact_phone' && data.data) {
          log(`Added phone: ${data.data.number}`, colors.cyan);
        } else if (test.name === 'log_communication' && data.data) {
          log(`Logged communication: ${data.data.subject}`, colors.cyan);
        } else if (test.name === 'submit_lead') {
          log(`Lead submitted successfully`, colors.cyan);
        } else if (test.name === 'get_leads' && data.data) {
          log(`Found ${data.data.length} lead(s)`, colors.cyan);
        }
        
        passedTests++;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      log(`❌ Test failed: ${error.message}`, colors.red);
      failedTests++;
      
      // For Clio Grow tests, note if it's an expected API limitation
      if (test.name.includes('lead') && error.message.includes('404')) {
        log('Note: Clio Grow endpoints may require additional setup or permissions', colors.yellow);
      }
    }
  }
  
  // Summary
  log('\n' + '=' .repeat(50), colors.green);
  log(`\n📊 Test Summary:`, colors.bright + colors.cyan);
  log(`✅ Passed: ${passedTests}`, colors.green);
  log(`❌ Failed: ${failedTests}`, colors.red);
  log(`📈 Total: ${tests.length}`, colors.blue);
  
  if (failedTests === 0) {
    log('\n🎉 All tests passed!', colors.bright + colors.green);
  } else {
    log('\n⚠️  Some tests failed. Check the output above for details.', colors.bright + colors.yellow);
  }
}

// Run tests
runTests().catch(error => {
  log(`\n💥 Test runner error: ${error.message}`, colors.bright + colors.red);
  process.exit(1);
});