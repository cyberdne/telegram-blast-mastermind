
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from 'date-fns';
import { TelegramAccount } from '@/utils/types';
import { mockTelegramAccounts } from '@/utils/mockData';

const AccountsManager: React.FC = () => {
  const [accounts, setAccounts] = useState<TelegramAccount[]>(mockTelegramAccounts);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({
    phoneNumber: '',
    apiId: '',
    apiHash: '',
  });
  const [authStep, setAuthStep] = useState(1);
  const [authCode, setAuthCode] = useState('');

  const handleAddAccount = () => {
    if (authStep === 1) {
      // Simulate sending authentication code
      toast({
        title: "Verification code sent",
        description: `A code has been sent to ${newAccount.phoneNumber}`,
      });
      setAuthStep(2);
      return;
    }
    
    if (authStep === 2) {
      // Simulate verification
      const id = `acc-${Date.now()}`;
      const newAccountData: TelegramAccount = {
        id,
        phoneNumber: newAccount.phoneNumber,
        username: `user${id.slice(0, 4)}`,
        apiId: newAccount.apiId,
        apiHash: newAccount.apiHash,
        connected: true,
        lastActive: new Date().toISOString(),
        premiumStatus: Math.random() > 0.5
      };
      
      setAccounts([...accounts, newAccountData]);
      toast({
        title: "Account added successfully",
        description: "Your Telegram account has been connected.",
      });
      
      // Reset form
      setNewAccount({
        phoneNumber: '',
        apiId: '',
        apiHash: '',
      });
      setAuthCode('');
      setAuthStep(1);
      setShowAddAccount(false);
    }
  };

  const handleToggleConnection = (id: string) => {
    setAccounts(accounts.map(account => {
      if (account.id === id) {
        const newConnected = !account.connected;
        toast({
          title: newConnected ? "Account connected" : "Account disconnected",
          description: `${account.username} is now ${newConnected ? 'connected' : 'disconnected'}`
        });
        return {
          ...account,
          connected: newConnected,
          lastActive: newConnected ? new Date().toISOString() : account.lastActive
        };
      }
      return account;
    }));
  };

  const handleDeleteAccount = (id: string) => {
    const accountToDelete = accounts.find(a => a.id === id);
    if (accountToDelete) {
      setAccounts(accounts.filter(account => account.id !== id));
      toast({
        title: "Account removed",
        description: `${accountToDelete.username} has been removed from your accounts.`,
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Telegram Accounts</h2>
        <Dialog open={showAddAccount} onOpenChange={setShowAddAccount}>
          <DialogTrigger asChild>
            <Button className="bg-promotion-primary hover:bg-promotion-primary/90">
              Add New Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect Telegram Account</DialogTitle>
              <DialogDescription>
                {authStep === 1 
                  ? "Enter your Telegram API credentials to connect a new account."
                  : "Enter the verification code sent to your Telegram account."}
              </DialogDescription>
            </DialogHeader>
            
            {authStep === 1 ? (
              <>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phoneNumber" className="text-right">Phone</Label>
                    <Input
                      id="phoneNumber"
                      className="col-span-3"
                      placeholder="+628123456789"
                      value={newAccount.phoneNumber}
                      onChange={(e) => setNewAccount({...newAccount, phoneNumber: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="apiId" className="text-right">API ID</Label>
                    <Input
                      id="apiId"
                      className="col-span-3"
                      placeholder="12345678"
                      value={newAccount.apiId}
                      onChange={(e) => setNewAccount({...newAccount, apiId: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="apiHash" className="text-right">API Hash</Label>
                    <Input
                      id="apiHash"
                      className="col-span-3"
                      placeholder="a1b2c3d4e5f6g7h8i9j0"
                      value={newAccount.apiHash}
                      onChange={(e) => setNewAccount({...newAccount, apiHash: e.target.value})}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="authCode" className="text-right">Code</Label>
                  <Input
                    id="authCode"
                    className="col-span-3"
                    placeholder="12345"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            <DialogFooter>
              {authStep === 2 && (
                <Button variant="outline" onClick={() => setAuthStep(1)}>Back</Button>
              )}
              <Button onClick={handleAddAccount}>
                {authStep === 1 ? "Send Code" : "Connect Account"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Accounts</TabsTrigger>
          <TabsTrigger value="all">All Accounts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <div className="grid gap-4 md:grid-cols-2">
            {accounts.filter(account => account.connected).length > 0 ? accounts
              .filter(account => account.connected)
              .map(account => (
                <AccountCard
                  key={account.id}
                  account={account}
                  onToggleConnection={handleToggleConnection}
                  onDelete={handleDeleteAccount}
                />
              )) : (
                <div className="col-span-2 text-center py-8">
                  <p className="text-muted-foreground">No active accounts found. Connect an account to start sending messages.</p>
                </div>
              )}
          </div>
        </TabsContent>
        
        <TabsContent value="all">
          <div className="grid gap-4 md:grid-cols-2">
            {accounts.length > 0 ? accounts
              .map(account => (
                <AccountCard
                  key={account.id}
                  account={account}
                  onToggleConnection={handleToggleConnection}
                  onDelete={handleDeleteAccount}
                />
              )) : (
                <div className="col-span-2 text-center py-8">
                  <p className="text-muted-foreground">No accounts found. Add an account to get started.</p>
                </div>
              )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface AccountCardProps {
  account: TelegramAccount;
  onToggleConnection: (id: string) => void;
  onDelete: (id: string) => void;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, onToggleConnection, onDelete }) => {
  return (
    <Card className="telegram-card overflow-hidden">
      <CardHeader className="bg-muted/50 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-telegram flex items-center justify-center text-white font-bold">
              {account.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <CardTitle className="text-lg">@{account.username}</CardTitle>
              <CardDescription>{account.phoneNumber}</CardDescription>
            </div>
          </div>
          {account.premiumStatus && (
            <Badge className="premium-badge">Premium</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm">
            <span className="text-muted-foreground">Status:</span>
            <Badge variant={account.connected ? "success" : "secondary"} className="ml-2">
              {account.connected ? "Online" : "Offline"}
            </Badge>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Last active:</span>{" "}
            <span className={account.connected ? "active-now" : ""}>
              {account.connected
                ? "Now"
                : formatDistanceToNow(new Date(account.lastActive), { addSuffix: true })}
            </span>
          </div>
        </div>
        <div className="text-sm mb-2">
          <span className="text-muted-foreground">API ID:</span> {account.apiId}
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/30 flex justify-between">
        <div className="flex items-center gap-2">
          <Switch 
            checked={account.connected} 
            onCheckedChange={() => onToggleConnection(account.id)}
            aria-label="Toggle connection"
          />
          <Label htmlFor="connection">
            {account.connected ? "Connected" : "Disconnected"}
          </Label>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm">Remove</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Removal</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove @{account.username}? This will delete all associated data and cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button variant="destructive" onClick={() => onDelete(account.id)}>Remove Account</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default AccountsManager;
