import dynamic from "next/dynamic";
import { Body } from "./home/Body";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex items-center justify-center py-10">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl border-4 border-black overflow-hidden">
          <Body />
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="flex justify-between items-center px-8 py-6 bg-white border-b-4 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)]">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-red-500 rounded-full border-4 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]"></div>
        <h1 className="text-3xl font-black tracking-tighter uppercase">Avagotchi</h1>
      </div>
      <WalletButtons />
    </header>
  );
}

function Footer() {
  return (
    <footer className="py-8 text-center text-sm font-bold text-gray-500 uppercase tracking-widest">
      Built on Avalanche Subnet
    </footer>
  );
}

const WalletButtons = dynamic(
  async () => {
    const { WalletButtons } = await import("@/components/WalletButtons");
    return { default: WalletButtons };
  },
  {
    loading: () => (
      <div className="px-4 py-2 bg-gray-200 border-2 border-black rounded opacity-50">
        Loading...
      </div>
    ),
    ssr: false,
  }
);
