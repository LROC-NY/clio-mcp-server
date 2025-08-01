/**
 * Clio API client functions
 */

import https from 'https';
import { URL } from 'url';

export async function makeClioRequest(endpoint, method = 'GET', data = null, accessToken = null, config = {}) {
  if (!accessToken) {
    throw new Error('No access token provided. Use get_auth_url and exchange_code to obtain one.');
  }

  const url = new URL(`${config.apiBase}${endpoint}`);
  
  const options = {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  };

  // Add proxy support if configured
  if (process.env.HTTPS_PROXY || process.env.https_proxy) {
    const proxyUrl = process.env.HTTPS_PROXY || process.env.https_proxy;
    // Add proxy configuration here if needed
    console.error(`Using proxy: ${proxyUrl}`);
  }
  
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(result);
          } else {
            reject(new Error(`API Error: ${res.statusCode} - ${result.error || body}`));
          }
        } catch (e) {
          reject(new Error(`Parse Error: ${e.message}`));
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}