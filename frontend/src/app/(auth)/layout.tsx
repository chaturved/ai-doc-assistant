import Header from "@/components/Header/Header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header
        actions={{
          help: { visible: true },
        }}
      />
      <main className="h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </>
  );
}
