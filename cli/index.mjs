#!/usr/bin/env node

import { select, input, password } from '@inquirer/prompts';
import chalk from 'chalk';
import ora from 'ora';
import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

async function main() {
  console.log(chalk.cyan.bold('\n🚀 Welcome to Create Starter AVAX!\n'));

  try {
    const projectType = await select({
      message: 'Select your project:',
      choices: [
        { name: 'Flip Coin', value: 'flip coin' },
        { name: 'Avagotchi', value: 'avagotchi' },
      ],
    });

    const projectName = await input({
      message: 'Enter your project name:',
      default: 'my-avax-project',
    });

    const rpcUrl = await input({
      message: 'Enter the RPC URL:',
      default: 'https://nodes-prod.18.182.4.86.sslip.io/ext/bc/2PyQcV83e7qoCkaGAXVPMTMixfLW3Uxt5eBRiykDUT5EF57MQY/rpc',
    });

    const chainId = await input({
      message: 'Enter the Chain ID:',
      default: '577706',
    });

    const blockExplorerUrl = await input({
      message: 'Enter the Block Explorer URL (optional):',
      default: '',
    });

    const targetDir = path.join(process.cwd(), projectName);
    const spinner = ora('Creating project...').start();

    // 1. Create project directory and copy files
    if (fs.existsSync(targetDir)) {
      spinner.fail(chalk.red(`Directory ${projectName} already exists!`));
      return;
    }

    fs.mkdirSync(targetDir, { recursive: true });

    // Copy essential template files only (to avoid recursive copying of other test projects)
    const whiteList = [
      'src',
      'blockchain',
      'public',
      'package.json',
      'tsconfig.json',
      'next.config.js',
      'tailwind.config.js',
      'postcss.config.js',
      'README.md'
    ];

    const files = fs.readdirSync(rootDir);
    for (const file of files) {
      if (whiteList.includes(file)) {
        const src = path.join(rootDir, file);
        const dest = path.join(targetDir, file);

        if (file === 'blockchain') {
          // Special handling for blockchain to exclude its node_modules and deployments
          fs.mkdirSync(dest, { recursive: true });
          const bcFiles = fs.readdirSync(src);
          for (const bcFile of bcFiles) {
            if (bcFile !== 'node_modules' && bcFile !== 'ignition/deployments') {
              execSync(`cp -R "${path.join(src, bcFile)}" "${path.join(dest, bcFile)}"`);
            }
          }
        } else {
          execSync(`cp -R "${src}" "${dest}"`);
        }
      }
    }

    spinner.succeed(chalk.green('Project structure created.'));

    // 2. Generate new wallet
    spinner.start('Generating new wallet...');
    const wallet = ethers.Wallet.createRandom();
    spinner.succeed(chalk.green(`New wallet generated: ${wallet.address}`));

    // 3. Update .env in the new project
    spinner.start('Configuring environment variables...');
    const envPath = path.join(targetDir, '.env');
    let envContent = `PRIVATE_KEY=${wallet.privateKey}\n`;
    envContent += `RPC_URL=${rpcUrl}\n`;
    envContent += `CHAIN_ID=${chainId}\n`;
    envContent += `NEXT_PUBLIC_AVAX_RPC_URL=${rpcUrl}\n`;
    envContent += `NEXT_PUBLIC_CHAIN_ID=${chainId}\n`;
    envContent += `NEXT_PUBLIC_BLOCK_EXPLORER_URL=${blockExplorerUrl}\n`;
    envContent += `NEXT_PUBLIC_PROJECT_TYPE="${projectType}"\n`;

    // Keep some default avagotchi settings if it's avagotchi
    envContent += `NEXT_PUBLIC_BODY_OPTIONS=5\nNEXT_PUBLIC_EAR_OPTIONS=6\nNEXT_PUBLIC_FACE_OPTIONS=4\n`;

    fs.writeFileSync(envPath, envContent);
    spinner.succeed(chalk.green('Environment configured.'));

    // 4. Wait for funding
    console.log(chalk.yellow.bold(`\n⚠️  MANUAL FUNDING REQUIRED`));
    console.log(chalk.white(`Please send at least 1.0 AVAX to the project wallet address:`));
    console.log(chalk.cyan.bold(wallet.address));
    console.log(chalk.gray(`\nWaiting for funds to arrive on ${rpcUrl}...\n`));

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    let balance = 0n;
    spinner.start('Checking balance...');

    while (balance < ethers.parseEther('0.05')) { // Wait for at least 0.05 AVAX to start deployment
      try {
        balance = await provider.getBalance(wallet.address);
        if (balance < ethers.parseEther('0.05')) {
          await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
        }
      } catch (e) {
        // Ignore network errors during polling
      }
    }
    spinner.succeed(chalk.green(`Funds received! Current balance: ${ethers.formatEther(balance)} AVAX.`));

    // 5. Deploy Contract
    const blockchainDir = path.join(targetDir, 'blockchain');
    spinner.stop();
    console.log(chalk.cyan('\n📦 Installing blockchain dependencies (using cache if available)...'));

    try {
      // Use --prefer-offline to speed up installation
      execSync(`cd "${blockchainDir}" && npm install --no-audit --no-fund --legacy-peer-deps --include=dev --prefer-offline`, { stdio: 'inherit' });
      console.log(chalk.green('✔ Blockchain dependencies installed.\n'));
    } catch (installError) {
      console.log(chalk.yellow('⚠️  Dependency installation had some warnings, continuing...\n'));
    }

    const contractName = projectType === 'flip coin' ? 'FlipCoin' : 'Tamagotchi';
    console.log(chalk.cyan(`🚀 Deploying ${contractName} contract to ${rpcUrl}...`));

    try {
      const output = execSync(`cd "${blockchainDir}" && npx hardhat run scripts/deploy.js --network avax_custom`, {
        env: {
          ...process.env,
          PRIVATE_KEY: wallet.privateKey,
          RPC_URL: rpcUrl,
          CHAIN_ID: chainId,
          CONTRACT_NAME: contractName
        },
        stdio: ['inherit', 'pipe', 'inherit']
      }).toString();

      console.log(chalk.green('✔ Deployment command completed.\n'));
      spinner.start('Finalizing setup...');

      let contractAddress = '';
      let txHash = '';

      // Parse address from output: "Tamagotchi deployed to: 0x..."
      const addressMatch = output.match(/deployed to: (0x[a-fA-F0-9]{40})/i);
      if (addressMatch) contractAddress = addressMatch[1];

      // Parse txHash from output: "Transaction hash: 0x..."
      const txMatch = output.match(/Transaction hash: (0x[a-fA-F0-9]{64})/i);
      if (txMatch) txHash = txMatch[1];

      spinner.succeed(chalk.green(`Contract deployed at: ${contractAddress || 'Unknown'}`));

      if (!contractAddress) {
        console.log(chalk.yellow('⚠️  Could not extract contract address automatically. Check the logs above.'));
      }

      if (txHash) {
        console.log(chalk.gray(`Transaction Hash: ${txHash}`));
        if (blockExplorerUrl) {
          const explorerLink = blockExplorerUrl.endsWith('/') ? blockExplorerUrl : `${blockExplorerUrl}/`;
          console.log(chalk.blue(`View on Explorer: ${explorerLink}tx/${txHash}`));
        }
      }

      // Update .env with the deployed address
      let currentEnv = fs.readFileSync(envPath, 'utf8');
      const envKey = projectType === 'flip coin' ? 'NEXT_PUBLIC_FLIPCOIN_CONTRACT_ADDRESS' : 'NEXT_PUBLIC_AVAGOTCHI_CONTRACT_ADDRESS';

      if (currentEnv.includes(envKey)) {
        currentEnv = currentEnv.replace(new RegExp(`${envKey}=.*`), `${envKey}=${contractAddress}`);
      } else {
        currentEnv += `${envKey}=${contractAddress}\n`;
      }

      fs.writeFileSync(envPath, currentEnv);
      spinner.succeed(chalk.green('Frontend updated.'));

    } catch (deployError) {
      spinner.fail(chalk.red(`Deployment failed: ${deployError.message}`));
      console.error(deployError);
    }

    console.log(chalk.cyan.bold('\n✨ All set! Your project is ready.\n'));
    
    spinner.start('Installing project dependencies...');
    try {
      execSync(`cd "${targetDir}" && npm install --no-audit --no-fund --legacy-peer-deps --prefer-offline`, { stdio: 'inherit' });
      spinner.succeed(chalk.green('Dependencies installed.'));
    } catch (e) {
      spinner.fail(chalk.yellow('Dependency installation had some warnings.'));
    }

    console.log(chalk.green('\n🚀 Launching your project...'));
    
    // Start dev server in the background
    const devProcess = execSync(`cd "${targetDir}" && npm run dev &`, { stdio: 'ignore' });
    
    // Wait a few seconds for the server to spin up, then open browser
    setTimeout(() => {
      try {
        const openCmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
        execSync(`${openCmd} http://localhost:3000`);
      } catch (e) {}
    }, 2000);

    console.log(chalk.cyan.bold('\n✨ Your project is now running at http://localhost:3000'));
    console.log(chalk.white(`  Project Folder: ${targetDir}`));
    console.log(chalk.gray('  (Note: The dev server is running in the background)'));

  } catch (error) {
    if (error.name === 'ExitPromptError') {
      console.log(chalk.yellow('\n👋 Process cancelled by user.'));
    } else {
      console.error(chalk.red('\n❌ An error occurred:'), error);
    }
  }
}

main();
