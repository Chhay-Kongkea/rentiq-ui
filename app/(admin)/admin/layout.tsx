import AdminSidebar from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f3f3f3] lg:pl-[300px]">
      <AdminSidebar />
      {children}
    </div>
  );
}
