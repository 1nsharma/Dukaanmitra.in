'use client';

import { ArrowDown, ArrowUp } from "lucide-react";

const systemMetrics = [
    { label: 'API Response Time', value: '145ms', status: 'good', trend: 'down' },
    { label: 'Database Load', value: '34%', status: 'good', trend: 'stable' },
    { label: 'Message Queue', value: '127', status: 'warning', trend: 'up' },
    { label: 'Error Rate', value: '0.2%', status: 'good', trend: 'down' },
    { label: 'Active Sessions', value: '189', status: 'good', trend: 'up' },
    { label: 'Storage Used', value: '2.4GB', status: 'good', trend: 'up' }
];

export default function SystemMetrics() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systemMetrics.map((metric, idx) => (
                <div key={idx} className="bg-card-foreground/5 rounded-xl p-6 border border-border">
                <div className="flex justify-between items-start mb-4">
                    <div className="text-muted-foreground text-sm">{metric.label}</div>
                    <div className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    metric.status === 'good' ? 'bg-green-500/20 text-green-300' :
                    metric.status === 'warning' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                    }`}>
                    {metric.status}
                    </div>
                </div>
                <div className="text-3xl font-bold mb-2">{metric.value}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {metric.trend === 'up' && <ArrowUp size={14} className="text-red-400" />}
                    {metric.trend === 'down' && <ArrowDown size={14} className="text-green-400" />}
                    {metric.trend === 'stable' && <span className="w-3 h-0.5 bg-muted-foreground"></span>}
                    <span>{metric.trend}</span>
                </div>
                </div>
            ))}
        </div>
    )
}
