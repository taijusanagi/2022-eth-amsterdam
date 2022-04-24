// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { network, ethers } from "hardhat";

import {
  ORIGIN_DOMAIN_KOVAN,
  ORIGIN_DOMAIN_RINKEBY,
  CONNEXT_CONTRACT_KOVAN,
  CONNEXT_CONTRACT_RINKEBY,
} from "../lib/constants";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const XNFTReceiver = await ethers.getContractFactory("XNFTReceiver");

  let sourceDomain;
  let connext = "";
  if (network.name === "rinkeby") {
    sourceDomain = ORIGIN_DOMAIN_KOVAN;
    connext = CONNEXT_CONTRACT_RINKEBY;
  } else if (network.name === "kovan") {
    sourceDomain = ORIGIN_DOMAIN_RINKEBY;
    connext = CONNEXT_CONTRACT_KOVAN;
  } else {
    return;
  }
  const xNFTReceiver = await XNFTReceiver.deploy(sourceDomain, connext);
  await xNFTReceiver.deployed();
  console.log("XNFTReceiver deployed to:", xNFTReceiver.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
