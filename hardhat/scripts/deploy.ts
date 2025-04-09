import hre from 'hardhat';

async function main() {
  const deployedContract = await hre.ethers.deployContract('NFT');
  await deployedContract.waitForDeployment();
  const contractAddress = await deployedContract.getAddress();
  console.log(`NFT contract deployed to ${contractAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
