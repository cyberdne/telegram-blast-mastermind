
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Check, X, Search, UserPlus, Filter } from "lucide-react";
import { GroupTarget } from '@/utils/types';
import { mockGroupTargets } from '@/utils/mockData';
import { formatDistanceToNow } from 'date-fns';

const TargetSelector: React.FC = () => {
  const [groups, setGroups] = useState<GroupTarget[]>(mockGroupTargets);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    username: '',
    memberCount: 0,
    isChannel: false
  });
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [importingGroups, setImportingGroups] = useState(false);

  const filteredGroups = groups.filter(group => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    
    return (
      group.name.toLowerCase().includes(query) ||
      group.username.toLowerCase().includes(query)
    );
  });
  
  const handleAddGroup = () => {
    if (!newGroup.name || !newGroup.username) {
      toast({
        title: "Validation Error",
        description: "Both name and username are required.",
        variant: "destructive"
      });
      return;
    }
    
    const id = `group-${Date.now()}`;
    const newGroupData: GroupTarget = {
      id,
      name: newGroup.name,
      username: newGroup.username,
      memberCount: newGroup.memberCount || 0,
      lastMessageSent: null,
      isChannel: newGroup.isChannel,
      status: 'pending'
    };
    
    setGroups([...groups, newGroupData]);
    
    toast({
      title: "Group Added",
      description: `${newGroup.name} has been added to your target groups.`
    });
    
    setNewGroup({
      name: '',
      username: '',
      memberCount: 0,
      isChannel: false
    });
    setShowAddGroup(false);
  };
  
  const handleDeleteGroup = (id: string) => {
    const groupToDelete = groups.find(g => g.id === id);
    if (groupToDelete) {
      setGroups(groups.filter(group => group.id !== id));
      setSelectedGroups(selectedGroups.filter(groupId => groupId !== id));
      
      toast({
        title: "Group Removed",
        description: `${groupToDelete.name} has been removed from your target groups.`
      });
    }
  };
  
  const handleToggleSelect = (id: string) => {
    if (selectedGroups.includes(id)) {
      setSelectedGroups(selectedGroups.filter(groupId => groupId !== id));
    } else {
      setSelectedGroups([...selectedGroups, id]);
    }
  };
  
  const handleImportGroups = () => {
    setImportingGroups(true);
    
    // Simulate API call to fetch groups from connected account
    setTimeout(() => {
      const randomNumber = Math.floor(Math.random() * 5) + 3;
      const newGroups: GroupTarget[] = [];
      
      for (let i = 0; i < randomNumber; i++) {
        const id = `imported-${Date.now()}-${i}`;
        newGroups.push({
          id,
          name: `Imported Group ${i + 1}`,
          username: `imported_group_${i + 1}`,
          memberCount: Math.floor(Math.random() * 5000) + 500,
          lastMessageSent: null,
          isChannel: Math.random() > 0.7,
          status: 'pending'
        });
      }
      
      setGroups([...groups, ...newGroups]);
      setImportingGroups(false);
      
      toast({
        title: "Groups Imported",
        description: `${newGroups.length} groups have been imported from your connected account.`
      });
    }, 2000);
  };
  
  const getStatusBadge = (status: GroupTarget['status']) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-promotion-success hover:bg-promotion-success/80">Sent</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'scheduled':
        return <Badge className="bg-promotion-warning hover:bg-promotion-warning/80">Scheduled</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Target Groups</h2>
        <div className="flex gap-2">
          <Dialog open={showAddGroup} onOpenChange={setShowAddGroup}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Target Group</DialogTitle>
                <DialogDescription>
                  Add a new Telegram group or channel to your target list.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid items-center gap-2">
                  <Label htmlFor="groupName">Group Name</Label>
                  <Input
                    id="groupName"
                    placeholder="e.g., Marketing Professionals Indonesia"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                  />
                </div>
                
                <div className="grid items-center gap-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="flex">
                    <span className="flex items-center bg-muted px-3 rounded-l-md border border-r-0">@</span>
                    <Input
                      id="username"
                      className="rounded-l-none"
                      placeholder="group_username"
                      value={newGroup.username}
                      onChange={(e) => setNewGroup({...newGroup, username: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid items-center gap-2">
                  <Label htmlFor="memberCount">Member Count (optional)</Label>
                  <Input
                    id="memberCount"
                    type="number"
                    placeholder="e.g., 1000"
                    value={newGroup.memberCount || ''}
                    onChange={(e) => setNewGroup({...newGroup, memberCount: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isChannel"
                    checked={newGroup.isChannel}
                    onChange={(e) => setNewGroup({...newGroup, isChannel: e.target.checked})}
                  />
                  <Label htmlFor="isChannel">This is a channel (not a group)</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddGroup(false)}>Cancel</Button>
                <Button onClick={handleAddGroup}>Add Group</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button 
            className="gap-2 bg-promotion-primary hover:bg-promotion-primary/90"
            onClick={handleImportGroups}
            disabled={importingGroups}
          >
            {importingGroups ? "Importing..." : "Import From Account"}
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search groups by name or username..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          {selectedGroups.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => setSelectedGroups([])}
            >
              Clear Selection ({selectedGroups.length})
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Groups</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <GroupsList
            groups={filteredGroups}
            selectedGroups={selectedGroups}
            onToggleSelect={handleToggleSelect}
            onDelete={handleDeleteGroup}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
        
        <TabsContent value="pending">
          <GroupsList
            groups={filteredGroups.filter(g => g.status === 'pending')}
            selectedGroups={selectedGroups}
            onToggleSelect={handleToggleSelect}
            onDelete={handleDeleteGroup}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
        
        <TabsContent value="sent">
          <GroupsList
            groups={filteredGroups.filter(g => g.status === 'sent')}
            selectedGroups={selectedGroups}
            onToggleSelect={handleToggleSelect}
            onDelete={handleDeleteGroup}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
        
        <TabsContent value="scheduled">
          <GroupsList
            groups={filteredGroups.filter(g => g.status === 'scheduled')}
            selectedGroups={selectedGroups}
            onToggleSelect={handleToggleSelect}
            onDelete={handleDeleteGroup}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface GroupsListProps {
  groups: GroupTarget[];
  selectedGroups: string[];
  onToggleSelect: (id: string) => void;
  onDelete: (id: string) => void;
  getStatusBadge: (status: GroupTarget['status']) => React.ReactNode;
}

const GroupsList: React.FC<GroupsListProps> = ({ 
  groups, 
  selectedGroups, 
  onToggleSelect, 
  onDelete,
  getStatusBadge
}) => {
  if (groups.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No groups found matching your criteria.</p>
      </div>
    );
  }
  
  return (
    <div className="grid gap-4">
      {groups.map(group => (
        <Card key={group.id} className={`border ${selectedGroups.includes(group.id) ? 'border-primary' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <input 
                    type="checkbox" 
                    checked={selectedGroups.includes(group.id)}
                    onChange={() => onToggleSelect(group.id)}
                    className="h-5 w-5"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{group.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>@{group.username}</span>
                    <span className="text-[8px]">•</span>
                    <span>{group.memberCount.toLocaleString()} members</span>
                    <span className="text-[8px]">•</span>
                    <span>{group.isChannel ? "Channel" : "Group"}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {getStatusBadge(group.status)}
                
                {group.lastMessageSent && (
                  <span className="text-xs text-muted-foreground">
                    Sent {formatDistanceToNow(new Date(group.lastMessageSent), { addSuffix: true })}
                  </span>
                )}
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <X className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Group</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to remove "{group.name}" from your target groups?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button variant="destructive" onClick={() => onDelete(group.id)}>Delete</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TargetSelector;
