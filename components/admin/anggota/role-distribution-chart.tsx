'use client';

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { StatsCounts } from '@/types/admin/anggota';

interface RoleDistributionChartProps {
    data: StatsCounts[];
}

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b'];

export function RoleDistributionChart({ data }: RoleDistributionChartProps) {
    const chartData = data.map((item) => ({
        name: item.role.charAt(0).toUpperCase() + item.role.slice(1),
        value: item.total,
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Distribusi Anggota per Role</CardTitle>
                <CardDescription>Total anggota berdasarkan peran mereka</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value} anggota`} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
