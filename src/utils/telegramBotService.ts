interface TelegramBotConfig {
  autoSchedule: boolean;
  delayBetweenMessages: number;
  delayBetweenGroups: number;
  maxMessagesPerHour: number;
  useRandomDelay: boolean;
  activeHours: {
    start: number;
    end: number;
  };
  activeDays: string[];
  termuxSupport: boolean; // Flag for Termux support
}

export interface TelegramAccount {
  id: string;
  username: string;
  phoneNumber: string;
  apiId?: number;
  apiHash?: string;
  isActive: boolean;
  isConnected: boolean;
  lastActivity?: string;
  status: 'online' | 'offline' | 'connecting' | 'error';
  error?: string;
  platform?: 'web' | 'termux'; // Platform indicator
}

export const defaultBotConfig: TelegramBotConfig = {
  autoSchedule: true,
  delayBetweenMessages: 60, // seconds
  delayBetweenGroups: 180, // seconds
  maxMessagesPerHour: 20,
  useRandomDelay: true,
  activeHours: {
    start: 9, // 9 AM
    end: 18, // 6 PM
  },
  activeDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  termuxSupport: true, // Enable Termux support by default
};

// Check if we're running in Termux environment
export const isTermuxEnvironment = (): boolean => {
  try {
    // Check for common Termux environment indicators
    return (
      typeof window === 'undefined' || // Not in browser
      (typeof process !== 'undefined' && 
       process.env.TERMUX_VERSION !== undefined) || // Termux version env variable
      (typeof navigator !== 'undefined' && 
       navigator.userAgent.includes('Android')) // Android user agent
    );
  } catch (e) {
    console.log('Error detecting environment:', e);
    return false;
  }
};

// Helper function to safely execute shell commands in Termux
const executeTermuxCommand = async (command: string): Promise<string> => {
  // In a real implementation with Termux, we would use a Node.js child_process
  // or a custom API to execute shell commands
  console.log(`[Termux] Executing command: ${command}`);
  
  // Simulate command execution delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock success response
  return `[Termux] Command executed successfully: ${command}`;
};

// This function would connect to the Telegram client in a real implementation
export const connectTelegramAccount = async (
  account: TelegramAccount
): Promise<{ success: boolean; error?: string }> => {
  console.log(`Connecting to Telegram account: @${account.username}`);
  
  // Check if we're running in Termux
  const isTermux = isTermuxEnvironment();
  if (isTermux) {
    console.log('Running in Termux environment, using Termux-specific connection method');
    
    try {
      // In a real implementation, we would use the Telegram CLI or a Python script with Telethon
      await executeTermuxCommand(`telegram-cli -p ${account.phoneNumber} --json -e "connect"`);
      
      console.log(`Successfully connected to @${account.username} via Termux`);
      return { success: true };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown connection error in Termux";
      console.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  }
  
  // Web implementation (unchanged)
  // Simulate API connection delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate successful connection (90% chance)
  const isSuccessful = Math.random() > 0.1;
  
  if (isSuccessful) {
    console.log(`Successfully connected to @${account.username}`);
    return { success: true };
  } else {
    const error = "Failed to connect: authentication error or network issue";
    console.error(error);
    return { success: false, error };
  }
};

// This function would send messages to groups in a real implementation
export const sendMessageToGroups = async (
  account: TelegramAccount,
  groups: string[],
  message: string,
  config: TelegramBotConfig
): Promise<{ success: boolean; sentTo: string[]; failed: string[]; errors: Record<string, string> }> => {
  console.log(`Preparing to send message to ${groups.length} groups using @${account.username}`);
  
  if (!account.isConnected) {
    console.error("Account not connected. Please connect first.");
    return { success: false, sentTo: [], failed: groups, errors: { general: "Account not connected" } };
  }
  
  const sentTo: string[] = [];
  const failed: string[] = [];
  const errors: Record<string, string> = {};
  
  // Check if we're in Termux environment
  const isTermux = isTermuxEnvironment();
  
  // In a real implementation, this would iterate through groups and send messages
  // with proper delays according to the config
  for (const group of groups) {
    try {
      console.log(`Sending message to ${group}...`);
      
      if (isTermux) {
        // Termux-specific implementation
        try {
          await executeTermuxCommand(`telegram-cli -W -e "msg ${group} ${message.replace(/"/g, '\\"')}"`);
          sentTo.push(group);
          console.log(`✓ Message sent to ${group} via Termux`);
        } catch (termuxError) {
          failed.push(group);
          const errorMsg = termuxError instanceof Error ? termuxError.message : "Termux command execution failed";
          errors[group] = errorMsg;
          console.error(`✗ ${errorMsg} for ${group}`);
        }
      } else {
        // Web implementation (unchanged)
        // Simulate sending (with 95% success rate)
        const isSuccess = Math.random() > 0.05;
        
        if (isSuccess) {
          sentTo.push(group);
          console.log(`✓ Message sent to ${group}`);
        } else {
          failed.push(group);
          const errorMsg = "Failed to send: message blocked or group restrictions";
          errors[group] = errorMsg;
          console.error(`✗ ${errorMsg} for ${group}`);
        }
      }
      
      // Apply delay between messages
      const delay = config.useRandomDelay
        ? Math.floor(config.delayBetweenMessages * (0.8 + Math.random() * 0.4) * 1000)
        : config.delayBetweenMessages * 1000;
      
      // In Termux, use a more reliable delay method
      if (isTermux) {
        console.log(`[Termux] Applying delay of ${delay/1000} seconds between messages`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        await new Promise(resolve => setTimeout(resolve, 50)); // Short delay for simulation in web
      }
    } catch (error) {
      failed.push(group);
      errors[group] = error instanceof Error ? error.message : "Unknown error";
      console.error(`Error sending to ${group}: ${errors[group]}`);
    }
  }
  
  console.log(`Message sending complete. Success: ${sentTo.length}, Failed: ${failed.length}`);
  return {
    success: sentTo.length > 0,
    sentTo,
    failed,
    errors
  };
};

// Check if current time is within active hours and days
export const isWithinActiveSchedule = (config: TelegramBotConfig): boolean => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  
  const isActiveHour = currentHour >= config.activeHours.start && currentHour < config.activeHours.end;
  const isActiveDay = config.activeDays.includes(currentDay);
  
  return isActiveHour && isActiveDay;
};

// Calculate next message time based on configuration
export const calculateNextMessageTime = (config: TelegramBotConfig): Date => {
  const now = new Date();
  let delaySeconds = config.useRandomDelay
    ? config.delayBetweenMessages * (0.8 + Math.random() * 0.4)
    : config.delayBetweenMessages;
  
  const nextTime = new Date(now.getTime() + delaySeconds * 1000);
  
  const currentHour = now.getHours();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  
  // If next time is outside active hours, adjust to next active period
  if (!isWithinActiveSchedule({ ...config, activeHours: { start: config.activeHours.start, end: config.activeHours.end } })) {
    // Find next active day and set time to start of active hours
    // This is simplified - a real implementation would be more robust
    nextTime.setHours(config.activeHours.start, 0, 0, 0);
    
    // If today is not an active day or current time is past active hours, move to next day
    if (currentHour >= config.activeHours.end || !config.activeDays.includes(currentDay)) {
      nextTime.setDate(nextTime.getDate() + 1);
    }
  }
  
  return nextTime;
};

// New function to check Termux requirements
export const checkTermuxRequirements = async (): Promise<{
  satisfied: boolean;
  missing: string[];
}> => {
  if (!isTermuxEnvironment()) {
    return { satisfied: true, missing: [] }; // Not in Termux, so no requirements to check
  }
  
  const requirements = [
    { name: 'telegram-cli', command: 'which telegram-cli' },
    { name: 'Node.js', command: 'node --version' },
    { name: 'Python', command: 'python --version' },
  ];
  
  const missing: string[] = [];
  
  for (const req of requirements) {
    try {
      await executeTermuxCommand(req.command);
      console.log(`✓ ${req.name} is installed`);
    } catch (e) {
      console.error(`✗ ${req.name} is not installed or not working`);
      missing.push(req.name);
    }
  }
  
  return {
    satisfied: missing.length === 0,
    missing
  };
};

// New function for Termux installation instructions
export const getTermuxSetupInstructions = (): string[] => {
  return [
    "1. Install Termux from F-Droid (preferred) or Google Play Store",
    "2. Run 'pkg update && pkg upgrade'",
    "3. Run 'pkg install nodejs python git'",
    "4. Run 'pip install telethon'",
    "5. Clone this repository: 'git clone https://github.com/yourusername/telegram-blast.git'",
    "6. Navigate to the project: 'cd telegram-blast'",
    "7. Install dependencies: 'npm install'",
    "8. Start the application: 'npm start'"
  ];
};

// New function to run the application in headless mode (for Termux)
export const runInHeadlessMode = async (
  account: TelegramAccount,
  groups: string[],
  message: string,
  config: TelegramBotConfig
): Promise<void> => {
  console.log("Starting Telegram Bot in headless mode for Termux...");
  
  // Check requirements
  const reqCheck = await checkTermuxRequirements();
  if (!reqCheck.satisfied) {
    console.error("Missing required dependencies:", reqCheck.missing);
    console.log("Please install the missing dependencies:");
    getTermuxSetupInstructions().forEach(instruction => console.log(instruction));
    return;
  }
  
  // Connect account
  console.log(`Connecting to account: @${account.username}`);
  const connectionResult = await connectTelegramAccount(account);
  
  if (!connectionResult.success) {
    console.error("Failed to connect account:", connectionResult.error);
    return;
  }
  
  console.log("Account connected successfully!");
  
  // Start message sending loop
  let messagesSent = 0;
  const maxMessages = config.maxMessagesPerHour * 24; // Let's say we run for 24 hours max
  
  while (messagesSent < maxMessages) {
    // Check if we're within active schedule
    if (config.autoSchedule && !isWithinActiveSchedule(config)) {
      console.log("Outside of active hours or days. Waiting for next active period...");
      
      // Calculate time until next active period
      const nextMessageTime = calculateNextMessageTime(config);
      const waitTime = nextMessageTime.getTime() - new Date().getTime();
      
      console.log(`Resuming at ${nextMessageTime.toLocaleString()}`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      continue;
    }
    
    // Send messages
    console.log(`Sending batch of messages to ${groups.length} groups...`);
    const result = await sendMessageToGroups(
      { ...account, isConnected: true },
      groups,
      message,
      config
    );
    
    messagesSent += result.sentTo.length;
    
    console.log(`Messages sent: ${messagesSent}/${maxMessages}`);
    console.log(`Success: ${result.sentTo.length}, Failed: ${result.failed.length}`);
    
    // Wait between groups
    const groupDelay = config.useRandomDelay
      ? Math.floor(config.delayBetweenGroups * (0.8 + Math.random() * 0.4) * 1000)
      : config.delayBetweenGroups * 1000;
    
    console.log(`Waiting ${groupDelay/1000} seconds before the next batch...`);
    await new Promise(resolve => setTimeout(resolve, groupDelay));
  }
  
  console.log("Message sending complete! Maximum messages sent.");
};
