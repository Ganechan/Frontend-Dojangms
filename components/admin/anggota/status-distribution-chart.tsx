'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { StatsCounts } from '@/types/admin/anggota';

interface StatusDistributionChartProps {
    data: StatsCounts[];
}

export function StatusDistributionChart({ data }: StatusDistributionChartProps) {
    const chartData = data.map((item) => ({
        name: item.role.charAt(0).toUpperCase() + item.role.slice(1),
        Aktif: item.active,
        'Tidak Aktif': item.inactive,
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Status Anggota per Role</CardTitle>
                <CardDescription>Perbandingan anggota aktif dan tidak aktif</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Aktif" fill="#10b981" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="Tidak Aktif" fill="#ef4444" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
