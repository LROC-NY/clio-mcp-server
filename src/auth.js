/**
 * OAuth authentication functions
 */

import https from 'https';
import { URL, URLSearchParams } from 'url';

export async function exchangeCodeForToken(code, redirectUri, config) {
  const tokenData = {
    grant_type: 'authorization_code',
    code: code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: redirectUri,
  };

  const tokenUrl = `${config.authBase}/oauth/token`;
  const params = new URLSearchParams(tokenData);
  
  return new Promise((resolve, reject) => {
    const req = https.request(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(result);
          } else {
            reject(new Error(`Token Error: ${res.statusCode} - ${result.error || body}`));
          }
        } catch (e) {
          reject(new Error(`Parse Error: ${e.message}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(params.toString());
    req.end();
  });
}

export async function refreshAccessToken(refreshToken, config) {
  const tokenData = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: config.clientId,
    client_secret: config.clientSecret,
  };

  const tokenUrl = `${config.authBase}/oauth/token`;
  const params = new URLSearchParams(tokenData);
  
  return new Promise((resolve, reject) => {
    const req = https.request(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(result);
          } else {
            reject(new Error(`Refresh Error: ${res.statusCode} - ${result.error || body}`));
          }
        } catch (e) {
          reject(new Error(`Parse Error: ${e.message}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(params.toString());
    req.end();
  });
}