
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import AccountsManager from './AccountsManager';
import MessageComposer from './MessageComposer';
import TargetSelector from './TargetSelector';
import ScheduleSettings from './ScheduleSettings';
import DeliveryLogs from './DeliveryLogs';
import SubscriptionManager from './SubscriptionManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, MessageSquare, Check, AlertTriangle } from "lucide-react";
import { mockGroupTargets, mockDeliveryLogs } from '@/utils/mockData';

interface DashboardProps {
  username: string;
  role: 'admin' | 'user';
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ username, role, onLogout }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  
  // Calculate stats for dashboard
  const totalGroups = mockGroupTargets.length;
  const pendingGroups = mockGroupTargets.filter(g => g.status === 'pending').length;
  const sentMessages = mockDeliveryLogs.length;
  const successfulMessages = mockDeliveryLogs.filter(l => l.status === 'success').length;
  const successRate = sentMessages > 0 ? (successfulMessages / sentMessages) * 100 : 0;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header username={username} role={role} onLogout={onLogout} />
        
        <main className="flex-1 overflow-y-auto">
          {activeSection === 'dashboard' && (
            <div className="container mx-auto py-6">
              <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
              
              <div className="grid gap-4 md:grid-cols-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Groups</CardDescription>
                    <CardTitle className="text-3xl">{totalGroups}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-promotion-success">
                        <ArrowUp className="h-4 w-4" />
                        <span>12%</span>
                      </div>
                      <span className="text-muted-foreground">vs. last week</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Pending Groups</CardDescription>
                    <CardTitle className="text-3xl">{pendingGroups}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-promotion-danger">
                        <ArrowDown className="h-4 w-4" />
                        <span>5%</span>
                      </div>
                      <span className="text-muted-foreground">vs. last week</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Messages Sent</CardDescription>
                    <CardTitle className="text-3xl">{sentMessages}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-promotion-success">
                        <ArrowUp className="h-4 w-4" />
                        <span>18%</span>
                      </div>
                      <span className="text-muted-foreground">vs. last week</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Success Rate</CardDescription>
                    <CardTitle className="text-3xl">{successRate.toFixed(1)}%</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-promotion-success">
                        <ArrowUp className="h-4 w-4" />
                        <span>3%</span>
                      </div>
                      <span className="text-muted-foreground">vs. last week</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockDeliveryLogs.slice(0, 5).map((log, index) => (
                        <div key={index} className="flex items-start gap-2 pb-2 border-b last:border-0">
                          {log.status === 'success' ? (
                            <Check className="h-5 w-5 text-promotion-success mt-0.5" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-promotion-danger mt-0.5" />
                          )}
                          <div>
                            <p className="font-medium">
                              Message {log.status === 'success' ? 'sent to' : 'failed for'} {log.targetName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(log.timestamp).toLocaleTimeString()} - {new Date(log.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">System Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-promotion-success"></div>
                          <span>System Online</span>
                        </div>
                        <span className="text-sm text-muted-foreground">100% uptime</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-2 border-b">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-promotion-success"></div>
                          <span>Active Accounts</span>
                        </div>
                        <span className="text-sm font-medium">1 / 2</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-2 border-b">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-promotion-success"></div>
                          <span>Active Schedule</span>
                        </div>
                        <span className="text-sm font-medium">Regular Schedule</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          <span>Messages Today</span>
                        </div>
                        <span className="text-sm font-medium">12 / 100</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          {activeSection === 'accounts' && (
            <AccountsManager />
          )}
          
          {activeSection === 'messages' && (
            <MessageComposer />
          )}
          
          {activeSection === 'targets' && (
            <TargetSelector />
          )}
          
          {activeSection === 'schedules' && (
            <ScheduleSettings />
          )}
          
          {activeSection === 'reports' && (
            <DeliveryLogs />
          )}
          
          {activeSection === 'subscriptions' && (
            <SubscriptionManager />
          )}
          
          {activeSection === 'settings' && (
            <div className="container mx-auto py-6">
              <h2 className="text-3xl font-bold mb-6">Settings</h2>
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Configure global system settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground py-12 text-center">
                    Settings section coming soon...
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
