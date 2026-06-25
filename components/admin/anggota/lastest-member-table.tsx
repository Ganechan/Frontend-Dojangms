import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Anggota } from '@/types/admin/anggota';

interface LatestAnggotaTableProps {
    members: Anggota[];
}

export function LatestAnggotaTable({ members }: LatestAnggotaTableProps) {
    const getRoleColor = (role: string) => {
        switch (role) {
            case 'murid':
                return 'bg-blue-100 text-blue-800';
            case 'pelatih':
                return 'bg-purple-100 text-purple-800';
            case 'admin':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800';
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'murid':
                return 'Murid';
            case 'pelatih':
                return 'Pelatih';
            case 'admin':
                return 'Admin';
            default:
                return role;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Anggota Terbaru</CardTitle>
                <CardDescription>10 anggota yang bergabung terakhir</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left font-medium py-2">Nama</th>
                                <th className="text-left font-medium py-2">Email</th>
                                <th className="text-left font-medium py-2">Role</th>
                                <th className="text-left font-medium py-2">Status</th>
                                <th className="text-left font-medium py-2">Bergabung</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-muted-foreground">
                                        Tidak ada data anggota
                                    </td>
                                </tr>
                            ) : (
                                members.map((member) => (
                                    <tr key={member.id} className="border-b">
                                        <td className="py-3 font-medium">{member.name}</td>
                                        <td className="py-3 text-muted-foreground">{member.email}</td>
                                        <td className="py-3">
                                            <Badge className={getRoleColor(member.role)}>
                                                {getRoleLabel(member.role)}
                                            </Badge>
                                        </td>
                                        <td className="py-3">
                                            <Badge className={getStatusColor(member.status)}>
                                                {member.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                                            </Badge>
                                        </td>
                                        <td className="py-3 text-muted-foreground">
                                            {new Date(member.created_at).toLocaleDateString('id-ID')}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
