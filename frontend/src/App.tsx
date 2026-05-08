import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Utensils, Gamepad2, Bath, Plus, Wallet, RefreshCw, Settings } from 'lucide-react';
import { TAMAGOTCHI_ABI } from './abi';
import { GAME_CONFIG, PetStats } from './config';

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [petId, setPetId] = useState<number | null>(null);
  const [petName, setPetName] = useState<string>("");
  const [stats, setStats] = useState<PetStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isMinting, setIsMinting] = useState<boolean>(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        
        const signer = await provider.getSigner();
        const tamagotchiContract = new ethers.Contract(CONTRACT_ADDRESS, TAMAGOTCHI_ABI, signer);
        setContract(tamagotchiContract);
        
        await loadPet(tamagotchiContract, accounts[0]);
      } catch (error) {
        console.error("Connection error:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const loadPet = async (contractInstance: ethers.Contract, address: string) => {
    try {
      const balance = await contractInstance.balanceOf(address);
      if (balance > 0) {
        const id = await contractInstance.tokenOfOwnerByIndex(address, 0);
        setPetId(Number(id));
        const petInfo = await contractInstance.pets(id);
        setPetName(petInfo.name);
        await refreshStats(contractInstance, Number(id));
      }
    } catch (error) {
      console.error("Error loading pet:", error);
    }
  };

  const refreshStats = async (contractInstance: ethers.Contract, id: number) => {
    try {
      const [hunger, happiness, cleanliness, health] = await contractInstance.getPetStats(id);
      setStats({
        hunger: Number(hunger),
        happiness: Number(happiness),
        cleanliness: Number(cleanliness),
        health: Number(health),
        lastInteraction: Date.now() / 1000
      });
    } catch (error) {
      console.error("Error refreshing stats:", error);
    }
  };

  const mintPet = async (name: string) => {
    if (!contract || !name) return;
    setLoading(true);
    try {
      const tx = await contract.mint(name);
      await tx.wait();
      await loadPet(contract, account!);
    } catch (error) {
      console.error("Mint error:", error);
    } finally {
      setLoading(false);
      setIsMinting(false);
    }
  };

  const interact = async (action: 'feed' | 'play' | 'clean') => {
    if (!contract || petId === null) return;
    setLoading(true);
    try {
      let tx;
      if (action === 'feed') tx = await contract.feed(petId);
      else if (action === 'play') tx = await contract.play(petId);
      else if (action === 'clean') tx = await contract.clean(petId);
      
      await tx.wait();
      await refreshStats(contract, petId);
    } catch (error) {
      console.error(`${action} error:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract && petId !== null) {
      const interval = setInterval(() => refreshStats(contract, petId), 30000); // refresh every 30s
      return () => clearInterval(interval);
    }
  }, [contract, petId]);

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px' }}>
          AVAX<span style={{ color: 'var(--primary)' }}>PET</span>
        </h1>
        {account ? (
          <div className="glass-card" style={{ padding: '0.5rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Wallet size={18} color="var(--primary)" />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={connectWallet}>
            <Wallet size={20} />
            Connect Wallet
          </button>
        )}
      </header>

      <main>
        {!account ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Heart size={60} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
            <h2>Welcome to AvaxPet</h2>
            <p style={{ color: 'var(--text-dim)', marginTop: '1rem', marginBottom: '2rem' }}>
              Connect your wallet to start your journey with your own digital pet on Avalanche.
            </p>
            <button className="btn btn-primary" style={{ margin: '0 auto' }} onClick={connectWallet}>
              Get Started
            </button>
          </div>
        ) : petId === null ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h2>No Pet Found</h2>
            <p style={{ color: 'var(--text-dim)', marginTop: '1rem', marginBottom: '2rem' }}>
              You don't have an AvaxPet yet. Mint one to start playing!
            </p>
            {isMinting ? (
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <input 
                  type="text" 
                  placeholder="Name your pet..." 
                  className="glass-card"
                  style={{ background: 'rgba(0,0,0,0.2)', padding: '0.8rem', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
                  onChange={(e) => setPetName(e.target.value)}
                />
                <button className="btn btn-primary" onClick={() => mintPet(petName)} disabled={loading}>
                  {loading ? <RefreshCw className="bounce" /> : "Mint"}
                </button>
              </div>
            ) : (
              <button className="btn btn-primary" style={{ margin: '0 auto' }} onClick={() => setIsMinting(true)}>
                <Plus size={20} />
                Mint New Pet
              </button>
            )}
          </div>
        ) : (
          <div className="pet-container">
            <div className="glass-card" style={{ width: '100%', maxWidth: '600px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ fontSize: '2rem' }}>{petName}</h2>
                  <p style={{ color: 'var(--text-dim)' }}>ID: #{petId}</p>
                </div>
                <button className="btn" style={{ background: 'rgba(255,255,255,0.05)', padding: '10px' }} onClick={() => refreshStats(contract!, petId)}>
                  <RefreshCw size={18} className={loading ? "bounce" : ""} />
                </button>
              </div>

              <div className="pet-visual" style={{ margin: '0 auto 3rem auto' }}>
                <motion.div 
                  className="pet-sprite"
                  animate={stats?.health === 0 ? { rotate: 90, opacity: 0.5 } : { y: [0, -20, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <div className="pet-eye eye-left"></div>
                  <div className="pet-eye eye-right"></div>
                  <div className="pet-mouth" style={stats?.happiness && stats.happiness < 30 ? { borderBottom: 'none', borderTop: '3px solid #2d3436', top: '70%' } : {}}></div>
                </motion.div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <StatItem label="Hunger" value={stats?.hunger || 0} icon={<Utensils size={16} />} fillClass="hunger-fill" />
                <StatItem label="Happiness" value={stats?.happiness || 0} icon={<Gamepad2 size={16} />} fillClass="happiness-fill" />
                <StatItem label="Cleanliness" value={stats?.cleanliness || 0} icon={<Bath size={16} />} fillClass="clean-fill" />
                <StatItem label="Health" value={stats?.health || 0} icon={<Heart size={16} />} fillClass="health-fill" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => interact('feed')} disabled={loading || stats?.health === 0}>
                <Utensils size={18} /> Feed
              </button>
              <button className="btn btn-primary" onClick={() => interact('play')} disabled={loading || stats?.health === 0}>
                <Gamepad2 size={18} /> Play
              </button>
              <button className="btn btn-primary" onClick={() => interact('clean')} disabled={loading || stats?.health === 0}>
                <Bath size={18} /> Clean
              </button>
            </div>
          </div>
        )}
      </main>

      <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
        <p>Built with Solidity & Avalanche</p>
      </footer>
    </div>
  );
}

function StatItem({ label, value, icon, fillClass }: { label: string, value: number, icon: any, fillClass: string }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
          {icon}
          {label}
        </div>
        <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{value}%</span>
      </div>
      <div className="stat-bar">
        <div className={`stat-fill ${fillClass}`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}

export default App;
