const {
  signHandleRelayerFeePayload,
} = require("@connext/nxtp-utils/dist/helpers/signatures");

const {
  CONNEXT_CONTRACT_RINKEBY,
  CONNEXT_CONTRACT_KOVAN,
  NULL_ADDRESS,
} = require("../../lib/constants");

task("poc-connext-execute", "poc of cross message update")
  // .addParam("caller", "caller contract address")
  // .addParam("target", "target contract address")
  .setAction(async (taskArgs) => {
    // const { caller, target, transferId } = taskArgs;

    const [signer] = await ethers.getSigners();

    let connextAddress = "";
    if (network.name === "rinkeby") {
      connextAddress = CONNEXT_CONTRACT_RINKEBY;
    } else if (network.name === "kovan") {
      connextAddress = CONNEXT_CONTRACT_KOVAN;
    } else {
      return;
    }

    const connext = await ethers.getContractAt(
      "IConnext",
      connextAddress,
      signer
    );

    const transferId =
      "0xad493a95c38ed91567153d0d17db07cae65bcb3d8565593bc33504168646f991";

    const feePercentage = 0;

    const relayerSignature = await signHandleRelayerFeePayload(
      transferId,
      feePercentage,
      signer
    );
    const callParams = {
      to: "0xEa91c2a5b80536a51A5d3b2449ac7c56906E9281",
      callData:
        "0x573c0bd30000000000000000000000000000000000000000000000000000000000000005",
      originDomain: "2221",
      destinationDomain: "1111",
    };
    const executeArgs = {
      params: callParams,
      local: "0xB7b1d3cC52E658922b2aF00c5729001ceA98142C",
      routers: [signer.address],
      feePercentage,
      amount: 0,
      nonce: 34,
      relayerSignature: relayerSignature,
      originSender: signer.address,
    };
    const tx = await connext.execute(executeArgs, {
      gasLimit: "3000000",
    });
    console.log(tx.hash);
  });
