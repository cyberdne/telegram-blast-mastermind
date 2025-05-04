
/**
 * Termux runner utility for Telegram Bot
 * This file provides functions to run the bot in a Termux environment
 */

import { TelegramAccount, runInHeadlessMode, defaultBotConfig } from './telegramBotService';

// Sample account for testing - in production, this would be loaded from storage
const sampleAccount: TelegramAccount = {
  id: 'termux-1',
  username: 'termux_bot',
  phoneNumber: '+1234567890',
  isActive: true,
  isConnected: false,
  status: 'offline',
  platform: 'termux'
};

// Sample groups to send messages to - in production, this would be loaded from storage
const sampleGroups = [
  'telegram_group_1',
  'telegram_group_2'
];

// Sample message to send - in production, this would be loaded from storage
const sampleMessage = 'This is an automated message sent from Termux!';

/**
 * Main entry point for running the bot in Termux
 */
export const runTermuxBot = async (): Promise<void> => {
  console.log("=== Telegram Bot Termux Runner ===");
  console.log("Starting bot in headless mode...");
  
  try {
    await runInHeadlessMode(
      sampleAccount,
      sampleGroups,
      sampleMessage,
      defaultBotConfig
    );
    console.log("Bot execution completed successfully");
  } catch (error) {
    console.error("Error running bot:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
};

// Execute the runner if this file is run directly
if (require.main === module) {
  runTermuxBot()
    .then(() => console.log("Termux runner completed"))
    .catch(err => console.error("Termux runner error:", err));
}
