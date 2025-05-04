
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignSchedule } from '@/utils/types';
import { mockSchedules } from '@/utils/mockData';

const weekdays = [
  { id: 0, name: 'Sunday' },
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' },
];

const ScheduleSettings: React.FC = () => {
  const [schedules, setSchedules] = useState<CampaignSchedule[]>(mockSchedules);
  const [newSchedule, setNewSchedule] = useState<Partial<CampaignSchedule>>({
    name: '',
    minDelay: 60,
    maxDelay: 180,
    startTime: '09:00',
    endTime: '18:00',
    activeDays: [1, 2, 3, 4, 5], // Monday to Friday by default
    active: true
  });
  const [showNewSchedule, setShowNewSchedule] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<CampaignSchedule | null>(null);
  
  const handleAddSchedule = () => {
    if (!newSchedule.name) {
      toast({
        title: "Validation Error",
        description: "Schedule name is required.",
        variant: "destructive"
      });
      return;
    }
    
    if (!newSchedule.activeDays || newSchedule.activeDays.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one active day.",
        variant: "destructive"
      });
      return;
    }
    
    const id = `schedule-${Date.now()}`;
    const schedule: CampaignSchedule = {
      id,
      name: newSchedule.name,
      minDelay: newSchedule.minDelay || 60,
      maxDelay: newSchedule.maxDelay || 180,
      startTime: newSchedule.startTime || '09:00',
      endTime: newSchedule.endTime || '18:00',
      activeDays: newSchedule.activeDays || [1, 2, 3, 4, 5],
      active: newSchedule.active !== undefined ? newSchedule.active : true
    };
    
    setSchedules([...schedules, schedule]);
    
    toast({
      title: "Schedule Created",
      description: `"${schedule.name}" has been added to your schedules.`
    });
    
    setNewSchedule({
      name: '',
      minDelay: 60,
      maxDelay: 180,
      startTime: '09:00',
      endTime: '18:00',
      activeDays: [1, 2, 3, 4, 5],
      active: true
    });
    setShowNewSchedule(false);
  };
  
  const handleUpdateSchedule = () => {
    if (!selectedSchedule) return;
    
    setSchedules(schedules.map(s => 
      s.id === selectedSchedule.id ? selectedSchedule : s
    ));
    
    toast({
      title: "Schedule Updated",
      description: `"${selectedSchedule.name}" has been updated.`
    });
  };
  
  const handleDeleteSchedule = (id: string) => {
    const scheduleToDelete = schedules.find(s => s.id === id);
    
    if (scheduleToDelete) {
      setSchedules(schedules.filter(s => s.id !== id));
      
      if (selectedSchedule && selectedSchedule.id === id) {
        setSelectedSchedule(null);
      }
      
      toast({
        title: "Schedule Deleted",
        description: `"${scheduleToDelete.name}" has been deleted.`
      });
    }
  };
  
  const handleToggleActive = (id: string) => {
    setSchedules(schedules.map(s => {
      if (s.id === id) {
        const newActive = !s.active;
        
        toast({
          title: newActive ? "Schedule Activated" : "Schedule Deactivated",
          description: `"${s.name}" is now ${newActive ? 'active' : 'inactive'}.`
        });
        
        return { ...s, active: newActive };
      }
      return s;
    }));
    
    if (selectedSchedule && selectedSchedule.id === id) {
      setSelectedSchedule({ ...selectedSchedule, active: !selectedSchedule.active });
    }
  };
  
  const toggleDay = (schedule: Partial<CampaignSchedule>, dayId: number) => {
    const activeDays = schedule.activeDays || [];
    
    if (activeDays.includes(dayId)) {
      return activeDays.filter(d => d !== dayId);
    } else {
      return [...activeDays, dayId].sort((a, b) => a - b);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Scheduling</h2>
        <Dialog open={showNewSchedule} onOpenChange={setShowNewSchedule}>
          <DialogTrigger asChild>
            <Button className="bg-promotion-primary hover:bg-promotion-primary/90">
              Create New Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Schedule</DialogTitle>
              <DialogDescription>
                Set up a new sending schedule with custom delay and active hours.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid items-center gap-2">
                <Label htmlFor="name">Schedule Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Weekday Campaign"
                  value={newSchedule.name || ''}
                  onChange={(e) => setNewSchedule({...newSchedule, name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid items-center gap-2">
                  <Label htmlFor="minDelay">Minimum Delay (seconds)</Label>
                  <Input
                    id="minDelay"
                    type="number"
                    min="10"
                    placeholder="60"
                    value={newSchedule.minDelay || ''}
                    onChange={(e) => setNewSchedule({...newSchedule, minDelay: parseInt(e.target.value) || 60})}
                  />
                  <p className="text-xs text-muted-foreground">Minimum time between messages</p>
                </div>
                
                <div className="grid items-center gap-2">
                  <Label htmlFor="maxDelay">Maximum Delay (seconds)</Label>
                  <Input
                    id="maxDelay"
                    type="number"
                    min="10"
                    placeholder="180"
                    value={newSchedule.maxDelay || ''}
                    onChange={(e) => setNewSchedule({...newSchedule, maxDelay: parseInt(e.target.value) || 180})}
                  />
                  <p className="text-xs text-muted-foreground">Maximum time between messages</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid items-center gap-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newSchedule.startTime || '09:00'}
                    onChange={(e) => setNewSchedule({...newSchedule, startTime: e.target.value})}
                  />
                </div>
                
                <div className="grid items-center gap-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newSchedule.endTime || '18:00'}
                    onChange={(e) => setNewSchedule({...newSchedule, endTime: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid items-center gap-2">
                <Label>Active Days</Label>
                <div className="flex flex-wrap gap-2">
                  {weekdays.map(day => (
                    <Button
                      key={day.id}
                      type="button"
                      variant={newSchedule.activeDays?.includes(day.id) ? "default" : "outline"}
                      className="h-8"
                      onClick={() => setNewSchedule({
                        ...newSchedule,
                        activeDays: toggleDay(newSchedule, day.id)
                      })}
                    >
                      {day.name.substring(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={newSchedule.active}
                  onCheckedChange={(checked) => setNewSchedule({...newSchedule, active: checked})}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewSchedule(false)}>Cancel</Button>
              <Button onClick={handleAddSchedule}>Create Schedule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Schedules</CardTitle>
              <CardDescription>Select a schedule to edit</CardDescription>
            </CardHeader>
            <CardContent>
              {schedules.length > 0 ? (
                <div className="space-y-2">
                  {schedules.map(schedule => (
                    <div
                      key={schedule.id}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        selectedSchedule?.id === schedule.id
                          ? "bg-primary/10 border border-primary/30"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedSchedule(schedule)}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{schedule.name}</h3>
                        <Badge variant={schedule.active ? "default" : "secondary"}>
                          {schedule.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Delay: {schedule.minDelay}-{schedule.maxDelay} seconds
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Time: {schedule.startTime} - {schedule.endTime || "No end time"}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {weekdays.filter(day => schedule.activeDays.includes(day.id)).map(day => (
                          <span key={day.id} className="text-xs bg-muted px-1 rounded">
                            {day.name.substring(0, 3)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No schedules found. Create a schedule to get started.</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" className="w-full" onClick={() => setShowNewSchedule(true)}>
                Create New Schedule
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    const allActive = schedules.every(s => s.active);
                    
                    const updatedSchedules = schedules.map(s => ({
                      ...s,
                      active: !allActive
                    }));
                    
                    setSchedules(updatedSchedules);
                    
                    if (selectedSchedule) {
                      setSelectedSchedule({
                        ...selectedSchedule,
                        active: !allActive
                      });
                    }
                    
                    toast({
                      title: allActive ? "All Schedules Deactivated" : "All Schedules Activated",
                      description: `All schedules are now ${allActive ? 'inactive' : 'active'}.`
                    });
                  }}
                >
                  {schedules.every(s => s.active) ? "Deactivate All" : "Activate All"}
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full justify-start">
                      Delete All Schedules
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete All Schedules</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete all schedules? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button 
                        variant="destructive"
                        onClick={() => {
                          setSchedules([]);
                          setSelectedSchedule(null);
                          
                          toast({
                            title: "All Schedules Deleted",
                            description: "All schedules have been deleted."
                          });
                        }}
                      >
                        Delete All
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-8">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedSchedule 
                  ? `Edit: ${selectedSchedule.name}`
                  : "Schedule Editor"}
              </CardTitle>
              <CardDescription>
                {selectedSchedule
                  ? "Make changes to your selected schedule"
                  : "Select a schedule or create a new one"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedSchedule ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Schedule Name</Label>
                    <Input
                      id="edit-name"
                      value={selectedSchedule.name}
                      onChange={(e) => setSelectedSchedule({...selectedSchedule, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-minDelay">Minimum Delay (seconds)</Label>
                        <Input
                          id="edit-minDelay"
                          type="number"
                          min="10"
                          value={selectedSchedule.minDelay}
                          onChange={(e) => setSelectedSchedule({...selectedSchedule, minDelay: parseInt(e.target.value) || 60})}
                        />
                        <p className="text-xs text-muted-foreground">Minimum time between messages</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-maxDelay">Maximum Delay (seconds)</Label>
                        <Input
                          id="edit-maxDelay"
                          type="number"
                          min="10"
                          value={selectedSchedule.maxDelay}
                          onChange={(e) => setSelectedSchedule({...selectedSchedule, maxDelay: parseInt(e.target.value) || 180})}
                        />
                        <p className="text-xs text-muted-foreground">Maximum time between messages</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-startTime">Start Time</Label>
                        <Input
                          id="edit-startTime"
                          type="time"
                          value={selectedSchedule.startTime}
                          onChange={(e) => setSelectedSchedule({...selectedSchedule, startTime: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-endTime">End Time</Label>
                        <Input
                          id="edit-endTime"
                          type="time"
                          value={selectedSchedule.endTime || ''}
                          onChange={(e) => setSelectedSchedule({...selectedSchedule, endTime: e.target.value})}
                        />
                        <p className="text-xs text-muted-foreground">Leave empty for 24/7 operation</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Active Days</Label>
                    <div className="flex flex-wrap gap-2">
                      {weekdays.map(day => (
                        <Button
                          key={day.id}
                          type="button"
                          variant={selectedSchedule.activeDays.includes(day.id) ? "default" : "outline"}
                          className="h-8"
                          onClick={() => setSelectedSchedule({
                            ...selectedSchedule,
                            activeDays: toggleDay(selectedSchedule, day.id)
                          })}
                        >
                          {day.name.substring(0, 3)}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-active"
                      checked={selectedSchedule.active}
                      onCheckedChange={(checked) => setSelectedSchedule({...selectedSchedule, active: checked})}
                    />
                    <Label htmlFor="edit-active">Active</Label>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">Schedule Summary</h3>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="text-muted-foreground">Status:</span>{" "}
                        {selectedSchedule.active ? "Active" : "Inactive"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Days:</span>{" "}
                        {selectedSchedule.activeDays.length === 7 
                          ? "Every day" 
                          : weekdays
                              .filter(day => selectedSchedule.activeDays.includes(day.id))
                              .map(day => day.name)
                              .join(", ")}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Hours:</span>{" "}
                        {selectedSchedule.startTime} - {selectedSchedule.endTime || "No end time"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Delay between messages:</span>{" "}
                        {selectedSchedule.minDelay} to {selectedSchedule.maxDelay} seconds
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <div className="text-muted-foreground space-y-2">
                    <p>Select a schedule from the list to edit</p>
                    <p>or</p>
                    <Button 
                      onClick={() => setShowNewSchedule(true)}
                      className="mt-2"
                    >
                      Create New Schedule
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            {selectedSchedule && (
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex gap-2">
                  <Button
                    variant={selectedSchedule.active ? "secondary" : "default"}
                    onClick={() => handleToggleActive(selectedSchedule.id)}
                  >
                    {selectedSchedule.active ? "Deactivate" : "Activate"}
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive">Delete</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Schedule</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete "{selectedSchedule.name}"? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button variant="destructive" onClick={() => handleDeleteSchedule(selectedSchedule.id)}>
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <Button onClick={handleUpdateSchedule}>
                  Save Changes
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScheduleSettings;
