
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Clock, Settings, Bell } from "lucide-react";
import { TelegramAccount, connectTelegramAccount } from '@/utils/telegramBotService';

interface BotConnectionStatusProps {
  account: TelegramAccount;
  onStatusChange?: (isConnected: boolean) => void;
}

const BotConnectionStatus: React.FC<BotConnectionStatusProps> = ({ 
  account,
  onStatusChange 
}) => {
  const [status, setStatus] = useState<'online' | 'offline' | 'connecting' | 'error'>(
    account.isConnected ? 'online' : 'offline'
  );
  const [error, setError] = useState<string | undefined>(account.error);
  const [lastAttempt, setLastAttempt] = useState<Date | null>(null);
  const [reconnectCountdown, setReconnectCountdown] = useState<number | null>(null);

  // Function to connect to Telegram
  const handleConnect = async () => {
    setStatus('connecting');
    setError(undefined);
    setLastAttempt(new Date());
    
    try {
      const result = await connectTelegramAccount(account);
      
      if (result.success) {
        setStatus('online');
        toast({
          title: "Connection Successful",
          description: `Bot is now connected to @${account.username}`,
          variant: "default", // Changed from "success" to "default"
        });
        if (onStatusChange) onStatusChange(true);
      } else {
        setStatus('error');
        setError(result.error);
        toast({
          title: "Connection Failed",
          description: result.error || "Could not connect to Telegram",
          variant: "destructive",
        });
        setReconnectCountdown(60);
        if (onStatusChange) onStatusChange(false);
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "Unknown connection error";
      setStatus('error');
      setError(errorMsg);
      toast({
        title: "Connection Error",
        description: errorMsg,
        variant: "destructive",
      });
      setReconnectCountdown(60);
      if (onStatusChange) onStatusChange(false);
    }
  };

  // Auto-reconnect countdown
  useEffect(() => {
    if (reconnectCountdown === null || reconnectCountdown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setReconnectCountdown(prev => prev !== null ? prev - 1 : null);
    }, 1000);

    return () => clearInterval(timer);
  }, [reconnectCountdown]);

  // Auto-reconnect when countdown reaches zero
  useEffect(() => {
    if (reconnectCountdown === 0) {
      handleConnect();
    }
  }, [reconnectCountdown]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${
            status === 'online' ? 'bg-promotion-success animate-pulse' : 
            status === 'connecting' ? 'bg-promotion-warning animate-pulse' :
            status === 'error' ? 'bg-destructive' : 'bg-neutral-gray'
          }`} />
          Bot Connection Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">@{account.username}</p>
              <p className="text-sm text-muted-foreground">{account.phoneNumber}</p>
            </div>
            <Badge 
              variant={
                status === 'online' ? 'success' :
                status === 'connecting' ? 'secondary' :
                status === 'error' ? 'destructive' : 'outline'
              }
            >
              {status.toUpperCase()}
            </Badge>
          </div>
          
          {error && (
            <div className="text-sm text-destructive mt-2">
              Error: {error}
            </div>
          )}
          
          {lastAttempt && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Last attempt: {lastAttempt.toLocaleTimeString()}
            </div>
          )}
          
          <div className="flex gap-2">
            {status !== 'connecting' ? (
              <Button 
                onClick={handleConnect} 
                variant={status === 'online' ? 'outline' : 'success'}
                className="w-full"
              >
                {status === 'online' ? 'Reconnect' : 'Connect to Telegram'}
              </Button>
            ) : (
              <Button disabled className="w-full">
                Connecting...
              </Button>
            )}
            
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
          
          {reconnectCountdown !== null && reconnectCountdown > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              Auto-reconnect in {reconnectCountdown}s
              <Button 
                variant="link" 
                className="h-auto p-0 ml-1" 
                onClick={() => setReconnectCountdown(null)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BotConnectionStatus;
