/**
 * Configuration loader for Clio MCP Server
 * Loads configuration from multiple sources in priority order
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { config as dotenv } from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Region configurations
const REGION_CONFIG = {
  US: {
    apiBase: 'https://app.clio.com/api/v4',
    authBase: 'https://app.clio.com',
  },
  EU: {
    apiBase: 'https://eu.app.clio.com/api/v4',
    authBase: 'https://eu.app.clio.com',
  },
  CA: {
    apiBase: 'https://ca.app.clio.com/api/v4',
    authBase: 'https://ca.app.clio.com',
  },
};

export async function loadConfig() {
  // 1. Try environment variables first
  dotenv({ path: path.join(__dirname, '..', '.env') });
  
  let config = {
    clientId: process.env.CLIO_CLIENT_ID,
    clientSecret: process.env.CLIO_CLIENT_SECRET,
    accessToken: process.env.CLIO_ACCESS_TOKEN,
    refreshToken: process.env.CLIO_REFRESH_TOKEN,
    region: process.env.CLIO_REGION || 'US',
  };

  // 2. Try local config file
  const configPaths = [
    path.join(process.cwd(), 'clio-config.json'),
    path.join(process.env.HOME || '', '.clio-mcp', 'config.json'),
    path.join(__dirname, '..', 'clio-config.json'),
  ];

  for (const configPath of configPaths) {
    try {
      const fileConfig = JSON.parse(await fs.readFile(configPath, 'utf8'));
      config = { ...config, ...fileConfig };
      console.error(`Loaded config from: ${configPath}`);
      break;
    } catch (e) {
      // File doesn't exist or isn't readable, continue
    }
  }

  // 3. Try Claude Desktop configuration
  if (process.env.CLAUDE_DESKTOP_CONFIG) {
    try {
      const claudeConfig = JSON.parse(process.env.CLAUDE_DESKTOP_CONFIG);
      if (claudeConfig.clio) {
        config = { ...config, ...claudeConfig.clio };
      }
    } catch (e) {
      console.error('Failed to parse Claude Desktop config:', e);
    }
  }

  // 4. Command line arguments override
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--client-id':
        config.clientId = args[++i];
        break;
      case '--client-secret':
        config.clientSecret = args[++i];
        break;
      case '--access-token':
        config.accessToken = args[++i];
        break;
      case '--region':
        config.region = args[++i];
        break;
    }
  }

  // Apply region configuration
  const regionConfig = REGION_CONFIG[config.region.toUpperCase()] || REGION_CONFIG.US;
  config.apiBase = regionConfig.apiBase;
  config.authBase = regionConfig.authBase;

  // Validate configuration
  if (!config.clientId) {
    console.error('Warning: No Client ID configured. Set CLIO_CLIENT_ID or use --client-id');
  }

  return config;
}

export async function saveConfig(config, configPath) {
  const dir = path.dirname(configPath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(configPath, JSON.stringify(config, null, 2));
}