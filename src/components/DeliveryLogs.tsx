
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { DeliveryLog } from '@/utils/types';
import { mockDeliveryLogs } from '@/utils/mockData';

const DeliveryLogs: React.FC = () => {
  const [logs, setLogs] = useState<DeliveryLog[]>(mockDeliveryLogs);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  // Simulate real-time logs
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // Create a new log entry
      const newLog: DeliveryLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        accountId: '1',
        targetId: `target-${Math.floor(Math.random() * 4) + 1}`,
        targetName: `Random Group ${Math.floor(Math.random() * 10) + 1}`,
        messageId: '1',
        status: Math.random() > 0.2 ? 'success' : 'failed',
        errorMessage: Math.random() > 0.8 ? 'Rate limit exceeded' : undefined
      };
      
      setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 49)]); // Keep only the last 50 logs
    }, 5000); // Add a new log every 5 seconds
    
    return () => clearInterval(interval);
  }, [autoRefresh]);
  
  const getLogStatusColor = (status: DeliveryLog['status']) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Delivery Logs</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="auto-refresh"
              checked={autoRefresh}
              onChange={() => setAutoRefresh(!autoRefresh)}
            />
            <label htmlFor="auto-refresh" className="text-sm">
              Auto-refresh
            </label>
            {autoRefresh && (
              <div className="h-2 w-2 rounded-full bg-promotion-success animate-pulse"></div>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setLogs([]);
            }}
          >
            Clear Logs
          </Button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Live Activity Log</CardTitle>
              <CardDescription>Real-time message delivery tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="terminal-log">
                {logs.length > 0 ? (
                  logs.map(log => (
                    <div key={log.id}>
                      <span className="timestamp">[{format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}]</span>{' '}
                      <span className={getLogStatusColor(log.status)}>
                        {log.status === 'success' ? '✓' : '✗'} {log.status.toUpperCase()}:
                      </span>{' '}
                      Message sent to{' '}
                      <span className="font-bold">{log.targetName}</span>
                      {log.errorMessage && (
                        <span className="error"> - Error: {log.errorMessage}</span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No logs available. Activity will appear here when messages are sent.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-4">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Messages:</span>
                  <span className="font-medium">{logs.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Success Rate:</span>
                  <span className="font-medium">
                    {logs.length > 0 
                      ? `${Math.round((logs.filter(l => l.status === 'success').length / logs.length) * 100)}%` 
                      : '0%'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Failures:</span>
                  <span className="font-medium">{logs.filter(l => l.status === 'failed').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Last Message:</span>
                  <span className="font-medium">
                    {logs.length > 0 
                      ? format(new Date(logs[0].timestamp), 'HH:mm:ss') 
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-promotion-success animate-pulse"></div>
                  <span>System is processing messages</span>
                </div>
                
                <div className="p-3 bg-muted rounded-md">
                  <h4 className="font-medium mb-1">Active Schedule:</h4>
                  <p className="text-sm">Regular Schedule (60-180s delay)</p>
                  <p className="text-xs text-muted-foreground">Mon-Fri, 09:00-18:00</p>
                </div>
                
                <div className="p-3 bg-muted rounded-md">
                  <h4 className="font-medium mb-1">Active Account:</h4>
                  <p className="text-sm">@promo_account1</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge className="premium-badge text-[10px]">Premium</Badge>
                  </div>
                </div>
                
                <div className="p-3 bg-muted rounded-md">
                  <h4 className="font-medium mb-1">Target Groups:</h4>
                  <p className="text-sm">4 groups in queue</p>
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    <Badge variant="outline" className="text-[10px]">2 pending</Badge>
                    <Badge variant="outline" className="text-[10px]">1 scheduled</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="success">Success</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="pt-4">
              <LogsTable logs={logs} />
            </TabsContent>
            
            <TabsContent value="success" className="pt-4">
              <LogsTable logs={logs.filter(log => log.status === 'success')} />
            </TabsContent>
            
            <TabsContent value="failed" className="pt-4">
              <LogsTable logs={logs.filter(log => log.status === 'failed')} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

interface LogsTableProps {
  logs: DeliveryLog[];
}

const LogsTable: React.FC<LogsTableProps> = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No logs found.</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Time</th>
            <th className="text-left p-2">Target Group</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id} className="border-b hover:bg-muted/50">
              <td className="p-2 whitespace-nowrap">
                {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}
              </td>
              <td className="p-2">{log.targetName}</td>
              <td className="p-2">
                <Badge
                  variant={log.status === 'success' ? "success" : "destructive"}
                  className="text-xs"
                >
                  {log.status}
                </Badge>
              </td>
              <td className="p-2 text-sm text-muted-foreground">
                {log.errorMessage || "Message delivered successfully"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryLogs;
