const {
  ORIGIN_DOMAIN_RINKEBY,
  ORIGIN_DOMAIN_KOVAN,
  ERC20_CONTRACT_KOVAN,
  ERC20_CONTRACT_RINKEBY,
} = require("../lib/constants");

task("poc-connext-update", "poc of cross message update")
  .addParam("caller", "caller contract address")
  .addParam("target", "target contract address")
  .setAction(async (taskArgs) => {
    const { caller, target } = taskArgs;

    const [signer] = await ethers.getSigners();

    const XDomainPermissioned = await ethers.getContractFactory(
      "XDomainPermissioned"
    );
    const xDomainPermissioned = await XDomainPermissioned.attach(caller);
    let originDomain;
    let targetDomain;
    let testERC20;
    if (network.name === "rinkeby") {
      originDomain = ORIGIN_DOMAIN_RINKEBY;
      targetDomain = ORIGIN_DOMAIN_KOVAN;
      testERC20 = ERC20_CONTRACT_RINKEBY;
    } else if (network.name === "kovan") {
      originDomain = ORIGIN_DOMAIN_KOVAN;
      targetDomain = ORIGIN_DOMAIN_RINKEBY;
      testERC20 = ERC20_CONTRACT_KOVAN;
    } else {
      return;
    }
    const tx = await xDomainPermissioned.update(
      target,
      testERC20,
      originDomain,
      targetDomain,
      5,
      {
        gasLimit: "3000000",
      }
    );
    const { transactionHash } = await tx.wait();
    console.log(transactionHash);
  });
