import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
    title: string;
    value: number;
    description: string;
    icon?: React.ReactNode;
    trend?: {
        value: number;
        label: string;
        isPositive: boolean;
    };
}

export function StatsCard({
    title,
    value,
    description,
    icon,
    trend,
}: StatsCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon && <div className="text-muted-foreground">{icon}</div>}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
                {trend && (
                    <div className={`mt-2 text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {trend.isPositive ? '+' : '-'} {trend.value}% {trend.label}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
