const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Tamagotchi", function () {
  let Tamagotchi;
  let tamagotchi;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    Tamagotchi = await ethers.getContractFactory("Tamagotchi");
    tamagotchi = await Tamagotchi.deploy();
  });

  it("Should mint a pet with initial stats", async function () {
    await tamagotchi.connect(addr1).mint("Pikachu");
    const pet = await tamagotchi.pets(0);
    expect(pet.name).to.equal("Pikachu");
    expect(pet.hunger).to.equal(80);
  });

  it("Should decay stats over time", async function () {
    await tamagotchi.connect(addr1).mint("Pikachu");
    
    // Increase time by 2 hours
    await time.increase(7200);
    
    const [hunger, happiness, cleanliness, health] = await tamagotchi.getPetStats(0);
    
    // hungerDecayRate = 5 per hour -> 2 hours = 10 decay
    // 80 - 10 = 70
    expect(hunger).to.equal(70);
    expect(happiness).to.equal(74); // 80 - (2 * 3)
    expect(cleanliness).to.equal(76); // 80 - (2 * 2)
  });

  it("Should improve stats after feeding", async function () {
    await tamagotchi.connect(addr1).mint("Pikachu");
    await time.increase(3600); // 1 hour passed, hunger = 75
    
    await tamagotchi.connect(addr1).feed(0);
    const [hunger] = await tamagotchi.getPetStats(0);
    
    // 75 + 20 = 95
    expect(hunger).to.equal(95);
  });
});
