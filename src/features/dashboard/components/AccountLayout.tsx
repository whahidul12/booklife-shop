import { AccountSidebar } from "./AccountSidebar";

export function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="bg-background min-h-screen pt-6 pb-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            <AccountSidebar />
            {/* Main Content Area */}
            <main className="border-border bg-card flex-1 rounded-md border p-6 shadow-sm">
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
