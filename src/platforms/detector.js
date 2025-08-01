/**
 * Platform detection for Clio MCP Server
 */

export function detectPlatform() {
  // Check for Claude Code
  if (process.env.CLAUDE_CODE || process.env.CLAUDE_PROJECT_DIR) {
    return 'claude-code';
  }
  
  // Check for Claude Desktop
  if (process.env.CLAUDE_DESKTOP || process.env.CLAUDE_DESKTOP_CONFIG) {
    return 'claude-desktop';
  }
  
  // Check for Termux/Android
  if (process.env.PREFIX && process.env.PREFIX.includes('com.termux')) {
    return 'termux';
  }
  
  // Check for Docker
  if (process.env.DOCKER_CONTAINER || 
      (process.env.container === 'docker')) {
    return 'docker';
  }
  
  // Default to standalone
  return 'standalone';
}

export function getPlatformConfig(platform) {
  const configs = {
    'claude-code': {
      configPaths: [
        '.claude.json',
        '.claude/.clio-config.json',
      ],
      features: {
        interactiveSetup: false,
        autoTokenRefresh: true,
      },
    },
    'claude-desktop': {
      configPaths: [
        '~/.config/claude-desktop/mcp-config.json',
        '~/.claude-desktop/clio-config.json',
      ],
      features: {
        interactiveSetup: false,
        autoTokenRefresh: true,
      },
    },
    'termux': {
      configPaths: [
        '/data/data/com.termux/files/home/.clio-mcp/config.json',
        '~/.clio-mcp/config.json',
      ],
      features: {
        interactiveSetup: true,
        autoTokenRefresh: true,
      },
    },
    'standalone': {
      configPaths: [
        './clio-config.json',
        '~/.clio-mcp/config.json',
      ],
      features: {
        interactiveSetup: true,
        autoTokenRefresh: true,
      },
    },
  };
  
  return configs[platform] || configs.standalone;
}