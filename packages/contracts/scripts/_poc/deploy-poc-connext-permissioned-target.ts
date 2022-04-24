// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { network, ethers } from "hardhat";

import {
  ORIGIN_DOMAIN_KOVAN,
  ORIGIN_DOMAIN_RINKEBY,
} from "../../lib/constants";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const PermissionedTarget = await ethers.getContractFactory(
    "PermissionedTarget"
  );

  let originDomain;
  if (network.name === "rinkeby") {
    originDomain = ORIGIN_DOMAIN_KOVAN;
  } else if (network.name === "kovan") {
    originDomain = ORIGIN_DOMAIN_RINKEBY;
  } else {
    return;
  }

  const permissionedTarget = await PermissionedTarget.deploy(originDomain);
  await permissionedTarget.deployed();

  console.log("PermissionedTarget deployed to:", permissionedTarget.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
