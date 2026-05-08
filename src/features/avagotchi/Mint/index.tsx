import { useState } from "react";
import { useWallet } from "@/context/WalletProvider";
import { ShufflePetImage } from "../Pet/ShufflePetImage";
import { TAMAGOTCHI_CONTRACT_ADDRESS } from "@/utils/const";
import { TAMAGOTCHI_ABI } from "@/utils/abi";
import { ethers } from "ethers";

export interface MintProps {
  fetchPet: () => Promise<void>;
}

export function Mint({ fetchPet }: MintProps) {
  const [newName, setNewName] = useState<string>("");
  const [petParts, setPetParts] = useState<number[]>([0, 0, 0]);

  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);

  const { account, signer } = useWallet();

  const handleMint = async () => {
    if (!account || !signer) return;

    setTransactionInProgress(true);
    try {
      const contract = new ethers.Contract(TAMAGOTCHI_CONTRACT_ADDRESS, TAMAGOTCHI_ABI, signer);
      const tx = await contract.mint(newName, petParts[0], petParts[1], petParts[2]);
      await tx.wait();
      await fetchPet();
    } catch (error: any) {
      console.error(error);
    } finally {
      setTransactionInProgress(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-md self-center m-4">
      <h2 className="text-xl w-full text-center font-bold">Create your pet!</h2>
      <div className="flex flex-col gap-2 w-[320px]">
        <label htmlFor="name_field" className="font-semibold">Name</label>
        <input
          type="text"
          id="name_field"
          className="p-2 border-2 border-black rounded"
          placeholder="Pet Name"
          value={newName}
          onChange={(e) => setNewName(e.currentTarget.value)}
        />
      </div>
      <ShufflePetImage petParts={petParts} setPetParts={setPetParts} />
      <button
        type="button"
        className={`p-3 rounded font-bold text-white transition-all ${newName ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"}`}
        disabled={!newName || transactionInProgress}
        onClick={handleMint}
      >
        {transactionInProgress ? "Loading..." : "Mint Pet"}
      </button>
      <br />
    </div>
  );
}
