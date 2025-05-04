
/**
 * Entry script for npm start command
 * This script detects the environment and runs the appropriate version
 */

import { isTermuxEnvironment } from '../utils/telegramBotService';

// Determine if we're in Termux
const isTermux = isTermuxEnvironment();

async function main() {
  console.log(`Starting Telegram Bot in ${isTermux ? 'Termux' : 'web'} mode...`);
  
  if (isTermux) {
    // In Termux, run the headless bot
    console.log('Running in headless mode for Termux');
    // Dynamic import to avoid loading unnecessary modules in web mode
    const { runTermuxBot } = await import('../utils/termuxRunner');
    await runTermuxBot();
  } else {
    // In web environment, start the web server
    console.log('Running in web mode');
    // This would typically start a web server, but we'll just log for now
    console.log('Web server would start here. Use npm run dev for development.');
  }
}

// Run the main function
main()
  .then(() => console.log('Bot started successfully'))
  .catch(err => {
    console.error('Failed to start bot:', err);
    process.exit(1);
  });
