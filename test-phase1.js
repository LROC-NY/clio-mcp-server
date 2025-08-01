#!/usr/bin/env node
/**
 * Test script for Phase 1: Document Automation features
 */

import { loadConfig } from './src/config.js';
import { makeClioRequest } from './src/api.js';
import fs from 'fs';

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

async function runPhase1Tests() {
  log('\n🧪 Testing Phase 1: Document Automation Features', colors.bright + colors.green);
  log('=' .repeat(50), colors.green);
  
  const config = await loadConfig();
  const matterId = 74890078; // Known matter from previous tests
  
  let passedTests = 0;
  let failedTests = 0;
  
  // Test 1: List Document Templates
  log('\n📄 Test 1: List Document Templates', colors.cyan);
  try {
    const templates = await makeClioRequest(
      '/document_templates?limit=5',
      'GET',
      null,
      config.accessToken,
      config
    );
    log('✅ Success!', colors.green);
    log(`Found ${templates.data?.length || 0} template(s)`, colors.blue);
    if (templates.data?.length > 0) {
      log(`First template: ${templates.data[0].name}`, colors.blue);
    }
    passedTests++;
  } catch (error) {
    log(`❌ Failed: ${error.message}`, colors.red);
    failedTests++;
  }
  
  // Test 2: Get Court Forms
  log('\n⚖️ Test 2: Get Court Forms', colors.cyan);
  try {
    const forms = await makeClioRequest(
      '/court_forms?jurisdiction=NY&limit=5',
      'GET',
      null,
      config.accessToken,
      config
    );
    log('✅ Success!', colors.green);
    log(`Found ${forms.data?.length || 0} court form(s) for NY`, colors.blue);
    passedTests++;
  } catch (error) {
    log(`❌ Failed: ${error.message}`, colors.red);
    if (error.message.includes('404')) {
      log('Note: Court forms endpoint may not be available', colors.yellow);
    }
    failedTests++;
  }
  
  // Test 3: Create Document from Template (if templates exist)
  log('\n📝 Test 3: Create Document from Template', colors.cyan);
  try {
    // First get templates
    const templates = await makeClioRequest(
      '/document_templates?limit=1',
      'GET',
      null,
      config.accessToken,
      config
    );
    
    if (templates.data?.length > 0) {
      const templateId = templates.data[0].id;
      
      // Get matter data first
      const matterData = await makeClioRequest(
        `/matters/${matterId}?fields=id,display_number,description,client`,
        'GET',
        null,
        config.accessToken,
        config
      );
      
      const documentData = {
        data: {
          document_template: { id: templateId },
          matter: { id: matterId },
          name: `Test Document - ${new Date().toISOString()}`,
          merge_data: {
            matter: matterData.data,
            custom: {
              test_field: 'Phase 1 Testing'
            }
          }
        }
      };
      
      const document = await makeClioRequest(
        '/documents',
        'POST',
        documentData,
        config.accessToken,
        config
      );
      
      log('✅ Success!', colors.green);
      log(`Created document: ${document.data?.name}`, colors.blue);
      passedTests++;
    } else {
      log('⚠️  Skipped: No templates available', colors.yellow);
    }
  } catch (error) {
    log(`❌ Failed: ${error.message}`, colors.red);
    failedTests++;
  }
  
  // Test 4: eSignature Request (mock test)
  log('\n✍️ Test 4: eSignature Request', colors.cyan);
  try {
    // Note: This would require a real document ID
    log('⚠️  Skipped: Requires existing document with signature fields', colors.yellow);
    // In a real test, you would:
    // 1. Create or find a document suitable for signatures
    // 2. Send it for signature with the send_document_for_signature tool
    // 3. Check status with get_signature_status
  } catch (error) {
    log(`❌ Failed: ${error.message}`, colors.red);
    failedTests++;
  }
  
  // Test 5: Upload Document Template
  log('\n📤 Test 5: Upload Document Template', colors.cyan);
  try {
    // Create a simple test document
    const testContent = Buffer.from('Test document template content').toString('base64');
    
    const templateData = {
      data: {
        name: `Test Template - ${Date.now()}`,
        content: testContent,
        content_type: 'application/pdf',
        category: 'Test',
        merge_fields: ['client_name', 'matter_number', 'date']
      }
    };
    
    const template = await makeClioRequest(
      '/document_templates',
      'POST',
      templateData,
      config.accessToken,
      config
    );
    
    log('✅ Success!', colors.green);
    log(`Created template: ${template.data?.name}`, colors.blue);
    passedTests++;
  } catch (error) {
    log(`❌ Failed: ${error.message}`, colors.red);
    if (error.message.includes('422')) {
      log('Note: Template upload may require specific format/content', colors.yellow);
    }
    failedTests++;
  }
  
  // Summary
  log('\n' + '=' .repeat(50), colors.green);
  log(`\n📊 Phase 1 Test Summary:`, colors.bright + colors.cyan);
  log(`✅ Passed: ${passedTests}`, colors.green);
  log(`❌ Failed: ${failedTests}`, colors.red);
  log(`⚠️  Skipped: 1`, colors.yellow);
  
  if (failedTests === 0) {
    log('\n🎉 All active tests passed!', colors.bright + colors.green);
  } else {
    log('\n⚠️  Some tests failed. Check the output above for details.', colors.bright + colors.yellow);
  }
}

// Run tests
runPhase1Tests().catch(error => {
  log(`\n💥 Fatal error: ${error.message}`, colors.bright + colors.red);
  process.exit(1);
});