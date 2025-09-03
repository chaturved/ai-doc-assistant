import Footer from "@/components/Footer";
import Header from "@/components/Header/Header";
import MainContent from "@/components/MainContent/MainContent";
import SidebarLeft from "@/components/SidebarLeft/SidebarLeft";
import SidebarRight from "@/components/SidebarRight/SidebarRight";

export default function DashboardPage() {
  return (
    <>
      <Header
        showStatus={true}
        actions={{
          upload: { visible: true },
          newSearch: { visible: true },
        }}
        showUserDropdown={true}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 md:py-10 grid grid-cols-12 gap-6">
        <SidebarLeft />
        <main className="col-span-12 lg:col-span-6">
          <MainContent />
        </main>
        <SidebarRight />
      </div>
      <Footer />
    </>
  );
}
