import type { CapacitorConfig } from '@capacitor/cli';
import * as fs from 'fs';
import * as path from 'path';

// Helper to parse .env file in Node environment during Capacitor builds/syncs
function getEnvVariable(key: string): string | undefined {
  try {
    const envPath = path.resolve(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split(/\r?\n/);
      for (const line of lines) {
        // Skip comment lines or empty lines
        if (line.trim().startsWith('#') || !line.trim()) continue;

        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match && match[1] === key) {
          let value = match[2] ? match[2].trim() : '';
          
          // Handle inline comments (strip anything after # if it is not quoted)
          const isQuoted = (value.startsWith('"') && value.endsWith('"')) || 
                           (value.startsWith("'") && value.endsWith("'"));
          if (!isQuoted) {
            const commentIdx = value.indexOf('#');
            if (commentIdx !== -1) {
              value = value.substring(0, commentIdx).trim();
            }
          } else {
            value = value.slice(1, -1);
          }
          return value;
        }
      }
    }
  } catch (error) {
    console.error('Error reading .env file:', error);
  }
  return undefined;
}

const serverUrl = process.env.VITE_MOBILE_SERVER_URL || getEnvVariable('VITE_MOBILE_SERVER_URL');

const config: CapacitorConfig = {
  appId: 'com.godivatech.cedoimadurai',
  appName: 'Cedoi Madurai',
  webDir: 'dist',
  server: serverUrl && serverUrl.startsWith('http')
    ? {
        url: serverUrl,
        cleartext: true,
      }
    : undefined,
};

export default config;
