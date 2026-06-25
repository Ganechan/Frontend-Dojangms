import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { BackButton } from "@/components/admin/addUser/back-button";
import CreateUserForm from "@/components/admin/addUser/create-user-form"

export const metadata = {
  title: "Tambah User Murid | Admin Dashboard",
  description: "Buat akun pengguna baru dengan role murid",
};

export default function AddUserPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-6 p-6">
          <div className="flex flex-col gap-2">
            <BackButton />
            <CreateUserForm />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
