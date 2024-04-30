import AccountSummary from "@/components/AccountSummary";
import MainProvider from "@/providers/MainProvider";
import NavBar from "@/components/NavBar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#020202]">
      <MainProvider>
        <NavBar />
        <div className="z-10 w-full items-center justify-between font-mono text-sm p-4 md:p-12 2xl:p-12">
          <AccountSummary />
        </div>
      </MainProvider>
    </main>
  );
}
