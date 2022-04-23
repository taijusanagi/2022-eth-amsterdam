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
    const { caller, target, transferId } = taskArgs;

    const [signer] = await ethers.getSigners();

    const XDomainPermissioned = await ethers.getContractFactory(
      "XDomainPermissioned"
    );

    const xDomainPermissioned = await XDomainPermissioned.attach(caller);

    // const tx = await xDomainPermissioned.update(
    //   target,
    //   testERC20,
    //   originDomain,
    //   targetDomain,
    //   5,
    //   {
    //     gasLimit: "3000000",
    //   }
    // );
    // const { transactionHash } = await tx.wait();
    // console.log(transactionHash);
  });
