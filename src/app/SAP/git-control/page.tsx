'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GitBranch, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

// Mock data for the activity log
const mockLogs = [
  { id: 'commit-1', type: 'SYNC', status: 'Success', message: 'Synced with origin/main (a1b2c3d)', time: '5 minutes ago' },
  { id: 'check-1', type: 'CHECK', status: 'No Changes', message: 'No new updates found on origin/main', time: '1 hour ago' },
  { id: 'commit-2', type: 'SYNC', status: 'Success', message: 'Synced with origin/main (e4f5g6h)', time: 'Yesterday' },
  { id: 'commit-3', type: 'SYNC', status: 'Failed', message: 'Merge conflict detected. Manual intervention required.', time: '2 days ago' },
];


export default function GitControlPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Git Control Center</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <GitBranch className="h-5 w-5 text-green-400" />
          <span>Connected to: <span className="font-mono text-foreground">origin/main</span></span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                <CardTitle>Auto-Update Settings</CardTitle>
                <CardDescription>Configure the automatic checker to pull updates from the repository.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="auto-update-switch" className="text-base">Enable Auto-Updater</Label>
                            <p className="text-sm text-muted-foreground">Automatically check for and apply new commits.</p>
                        </div>
                        <Switch id="auto-update-switch" defaultChecked />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="check-interval">Update Check Interval</Label>
                        <Select defaultValue="hourly">
                            <SelectTrigger id="check-interval" className="w-[280px]">
                                <SelectValue placeholder="Select interval" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="15min">Every 15 minutes</SelectItem>
                                <SelectItem value="hourly">Hourly</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="manual">Manual Only</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline">Discard Changes</Button>
                    <Button>Save Settings</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Log of recent checks, pushes, and updates.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead className="text-right">Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockLogs.map(log => (
                                <TableRow key={log.id}>
                                    <TableCell>
                                        <Badge variant="secondary">{log.type}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {log.status === 'Success' && <Badge className="bg-green-500/20 text-green-500 border-green-400"><CheckCircle className="mr-1 h-3 w-3"/>Success</Badge>}
                                        {log.status === 'No Changes' && <Badge variant="outline">No Changes</Badge>}
                                        {log.status === 'Failed' && <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3"/>Failed</Badge>}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{log.message}</TableCell>
                                    <TableCell className="text-right text-muted-foreground text-xs">{log.time}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-semibold flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-400"/> Synced</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Check:</span>
                        <span className="font-semibold">5 minutes ago</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Update:</span>
                        <span className="font-semibold">5 minutes ago</span>
                    </div>
                    <div className="flex justify-between items-start">
                        <span className="text-muted-foreground">Latest Commit:</span>
                        <span className="font-mono text-xs text-right">a1b2c3d</span>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">
                        <GitBranch className="mr-2 h-4 w-4"/>
                        Check for Updates Manually
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
