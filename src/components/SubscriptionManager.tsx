
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Subscription, User } from '@/utils/types';
import { mockSubscriptions, mockUsers } from '@/utils/mockData';
import { format, addDays } from 'date-fns';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: '15.00',
    duration: '7 days',
    features: {
      premiumEmojis: false,
      mediaMessages: false,
      watermarkRemoval: false,
      prioritySupport: false
    },
    durationDays: 7,
    allowedAccounts: 1,
    allowedMessages: 100
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '49.99',
    duration: '30 days',
    features: {
      premiumEmojis: true,
      mediaMessages: true,
      watermarkRemoval: false,
      prioritySupport: false
    },
    durationDays: 30,
    allowedAccounts: 3,
    allowedMessages: 500
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '99.99',
    duration: '30 days',
    features: {
      premiumEmojis: true,
      mediaMessages: true,
      watermarkRemoval: true,
      prioritySupport: true
    },
    durationDays: 30,
    allowedAccounts: 10,
    allowedMessages: 2000
  }
];

const SubscriptionManager: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [users] = useState<User[]>(mockUsers);
  const [showAddSubscription, setShowAddSubscription] = useState(false);
  const [newSubscription, setNewSubscription] = useState({
    userId: '',
    plan: 'basic' as 'basic' | 'premium' | 'enterprise',
    durationDays: 7
  });
  
  const handleAddSubscription = () => {
    if (!newSubscription.userId) {
      toast({
        title: "Validation Error",
        description: "Please select a user.",
        variant: "destructive"
      });
      return;
    }
    
    const selectedPlan = plans.find(p => p.id === newSubscription.plan);
    if (!selectedPlan) return;
    
    const now = new Date();
    const subscription: Subscription = {
      id: `sub-${Date.now()}`,
      userId: newSubscription.userId,
      plan: newSubscription.plan,
      startDate: now.toISOString(),
      endDate: addDays(now, newSubscription.durationDays).toISOString(),
      active: true,
      allowedAccounts: selectedPlan.allowedAccounts,
      allowedMessages: selectedPlan.allowedMessages,
      remainingMessages: selectedPlan.allowedMessages,
      features: { ...selectedPlan.features }
    };
    
    // Check if user already has a subscription
    const existingSubIndex = subscriptions.findIndex(s => s.userId === newSubscription.userId);
    
    if (existingSubIndex >= 0) {
      // Replace existing subscription
      const updatedSubscriptions = [...subscriptions];
      updatedSubscriptions[existingSubIndex] = subscription;
      setSubscriptions(updatedSubscriptions);
      
      toast({
        title: "Subscription Updated",
        description: `The subscription for user has been updated to ${selectedPlan.name}.`
      });
    } else {
      // Add new subscription
      setSubscriptions([...subscriptions, subscription]);
      
      toast({
        title: "Subscription Added",
        description: `A new ${selectedPlan.name} subscription has been created.`
      });
    }
    
    setNewSubscription({
      userId: '',
      plan: 'basic',
      durationDays: 7
    });
    setShowAddSubscription(false);
  };
  
  const handleCancelSubscription = (id: string) => {
    const subToCancel = subscriptions.find(s => s.id === id);
    if (!subToCancel) return;
    
    setSubscriptions(subscriptions.map(sub => {
      if (sub.id === id) {
        return { ...sub, active: false };
      }
      return sub;
    }));
    
    toast({
      title: "Subscription Cancelled",
      description: `The ${subToCancel.plan} subscription has been cancelled.`
    });
  };
  
  const handleActivateSubscription = (id: string) => {
    const subToActivate = subscriptions.find(s => s.id === id);
    if (!subToActivate) return;
    
    // Extend end date by 7 days from now if it's expired
    const now = new Date();
    const endDate = new Date(subToActivate.endDate);
    
    if (endDate < now) {
      const plan = plans.find(p => p.id === subToActivate.plan);
      const newEndDate = addDays(now, plan?.durationDays || 7);
      
      setSubscriptions(subscriptions.map(sub => {
        if (sub.id === id) {
          return { 
            ...sub, 
            active: true,
            endDate: newEndDate.toISOString()
          };
        }
        return sub;
      }));
    } else {
      setSubscriptions(subscriptions.map(sub => {
        if (sub.id === id) {
          return { ...sub, active: true };
        }
        return sub;
      }));
    }
    
    toast({
      title: "Subscription Activated",
      description: `The ${subToActivate.plan} subscription has been activated.`
    });
  };
  
  const getUserById = (id: string): User | undefined => {
    return users.find(user => user.id === id);
  };
  
  const getSubscriptionStatus = (subscription: Subscription): string => {
    if (!subscription.active) return 'cancelled';
    
    const now = new Date();
    const endDate = new Date(subscription.endDate);
    
    if (endDate < now) return 'expired';
    return 'active';
  };
  
  const getRemainingDays = (subscription: Subscription): number => {
    const now = new Date();
    const endDate = new Date(subscription.endDate);
    
    if (endDate < now) return 0;
    
    const diffTime = endDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-promotion-success hover:bg-promotion-success/80">Active</Badge>;
      case 'expired':
        return <Badge className="bg-promotion-warning hover:bg-promotion-warning/80">Expired</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Subscriptions</h2>
        <Dialog open={showAddSubscription} onOpenChange={setShowAddSubscription}>
          <DialogTrigger asChild>
            <Button className="bg-promotion-primary hover:bg-promotion-primary/90">
              Add Subscription
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Subscription</DialogTitle>
              <DialogDescription>
                Create a new subscription or update an existing one.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid items-center gap-2">
                <Label htmlFor="userId">Select User</Label>
                <select
                  id="userId"
                  className="w-full p-2 rounded-md border"
                  value={newSubscription.userId}
                  onChange={(e) => setNewSubscription({...newSubscription, userId: e.target.value})}
                >
                  <option value="">-- Select User --</option>
                  {users
                    .filter(user => user.role === 'user')
                    .map(user => (
                      <option key={user.id} value={user.id}>
                        {user.username} {subscriptions.some(s => s.userId === user.id) ? "(Has subscription)" : ""}
                      </option>
                    ))}
                </select>
              </div>
              
              <div className="grid gap-4">
                <Label>Select Plan</Label>
                <div className="grid gap-4 md:grid-cols-3">
                  {plans.map(plan => (
                    <Card
                      key={plan.id}
                      className={`cursor-pointer transition-all ${
                        newSubscription.plan === plan.id 
                          ? "border-primary ring-1 ring-primary" 
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => setNewSubscription({...newSubscription, plan: plan.id as any, durationDays: plan.durationDays})}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <CardDescription>${plan.price} / {plan.duration}</CardDescription>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <ul className="space-y-1 list-disc pl-5">
                          <li>{plan.allowedAccounts} account{plan.allowedAccounts > 1 ? 's' : ''}</li>
                          <li>{plan.allowedMessages} messages</li>
                          {plan.features.premiumEmojis && <li>Premium Emojis</li>}
                          {plan.features.mediaMessages && <li>Media Messages</li>}
                          {plan.features.watermarkRemoval && <li>Custom Watermark</li>}
                          {plan.features.prioritySupport && <li>Priority Support</li>}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="grid items-center gap-2">
                <Label htmlFor="duration">Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={newSubscription.durationDays}
                  onChange={(e) => setNewSubscription({...newSubscription, durationDays: parseInt(e.target.value) || 7})}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddSubscription(false)}>Cancel</Button>
              <Button onClick={handleAddSubscription}>
                {subscriptions.some(s => s.userId === newSubscription.userId) ? "Update Subscription" : "Add Subscription"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="active">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="expired">Expired/Cancelled</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <SubscriptionsTable
            subscriptions={subscriptions.filter(s => getSubscriptionStatus(s) === 'active')}
            getUserById={getUserById}
            getSubscriptionStatus={getSubscriptionStatus}
            getRemainingDays={getRemainingDays}
            getStatusBadge={getStatusBadge}
            onCancel={handleCancelSubscription}
            onActivate={handleActivateSubscription}
          />
        </TabsContent>
        
        <TabsContent value="all">
          <SubscriptionsTable
            subscriptions={subscriptions}
            getUserById={getUserById}
            getSubscriptionStatus={getSubscriptionStatus}
            getRemainingDays={getRemainingDays}
            getStatusBadge={getStatusBadge}
            onCancel={handleCancelSubscription}
            onActivate={handleActivateSubscription}
          />
        </TabsContent>
        
        <TabsContent value="expired">
          <SubscriptionsTable
            subscriptions={subscriptions.filter(s => 
              getSubscriptionStatus(s) === 'expired' || getSubscriptionStatus(s) === 'cancelled'
            )}
            getUserById={getUserById}
            getSubscriptionStatus={getSubscriptionStatus}
            getRemainingDays={getRemainingDays}
            getStatusBadge={getStatusBadge}
            onCancel={handleCancelSubscription}
            onActivate={handleActivateSubscription}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface SubscriptionsTableProps {
  subscriptions: Subscription[];
  getUserById: (id: string) => User | undefined;
  getSubscriptionStatus: (subscription: Subscription) => string;
  getRemainingDays: (subscription: Subscription) => number;
  getStatusBadge: (status: string) => React.ReactNode;
  onCancel: (id: string) => void;
  onActivate: (id: string) => void;
}

const SubscriptionsTable: React.FC<SubscriptionsTableProps> = ({
  subscriptions,
  getUserById,
  getSubscriptionStatus,
  getRemainingDays,
  getStatusBadge,
  onCancel,
  onActivate
}) => {
  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No subscriptions found in this category.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {subscriptions.map(subscription => {
        const user = getUserById(subscription.userId);
        const status = getSubscriptionStatus(subscription);
        const remainingDays = getRemainingDays(subscription);
        
        return (
          <Card key={subscription.id} className="w-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">
                  {user ? user.username : 'Unknown User'}
                </CardTitle>
                {getStatusBadge(status)}
              </div>
              <CardDescription>
                <span className="capitalize">{subscription.plan} Plan</span> - 
                Start: {format(new Date(subscription.startDate), 'yyyy-MM-dd')} | 
                End: {format(new Date(subscription.endDate), 'yyyy-MM-dd')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3 border rounded-md">
                  <h3 className="text-sm font-medium text-muted-foreground">Accounts</h3>
                  <p className="text-2xl font-semibold">{subscription.allowedAccounts}</p>
                </div>
                
                <div className="p-3 border rounded-md">
                  <h3 className="text-sm font-medium text-muted-foreground">Messages</h3>
                  <p className="text-2xl font-semibold">
                    {subscription.remainingMessages} / {subscription.allowedMessages}
                  </p>
                </div>
                
                <div className="p-3 border rounded-md">
                  <h3 className="text-sm font-medium text-muted-foreground">Time Left</h3>
                  <p className="text-2xl font-semibold">
                    {remainingDays > 0 ? `${remainingDays} days` : 'Expired'}
                  </p>
                </div>
                
                <div className="p-3 border rounded-md">
                  <h3 className="text-sm font-medium text-muted-foreground">Features</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {subscription.features.premiumEmojis && (
                      <Badge variant="outline" className="text-xs">Premium Emojis</Badge>
                    )}
                    {subscription.features.mediaMessages && (
                      <Badge variant="outline" className="text-xs">Media</Badge>
                    )}
                    {subscription.features.watermarkRemoval && (
                      <Badge variant="outline" className="text-xs">Custom Watermark</Badge>
                    )}
                    {subscription.features.prioritySupport && (
                      <Badge variant="outline" className="text-xs">Priority Support</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t flex justify-end gap-2 pt-3">
              {status === 'active' ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Cancel Subscription</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cancel Subscription</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to cancel this subscription? The user will lose access immediately.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">No, Keep Subscription</Button>
                      <Button variant="destructive" onClick={() => onCancel(subscription.id)}>
                        Yes, Cancel Now
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button variant="outline" onClick={() => onActivate(subscription.id)}>
                  Reactivate
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default SubscriptionManager;
