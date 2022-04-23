const {
  signHandleRelayerFeePayload,
} = require("@connext/nxtp-utils/dist/helpers/signatures");

const {
  CONNEXT_CONTRACT_RINKEBY,
  CONNEXT_CONTRACT_KOVAN,
} = require("../lib/constants");

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
      "0xaf20507b978bcc38fc95f0fdd5ec973bf18e5f8723545530f19715f6dd515e1c";

    const feePercentage = 0;

    const relayerSignature = await signHandleRelayerFeePayload(
      transferId,
      feePercentage,
      signer
    );
    const callParams = {
      to: "0x4cFd94c68C47715D1d6f988bC3C99cF1C572e8A0",
      callData:
        "0x573c0bd30000000000000000000000000000000000000000000000000000000000000005",
      originDomain: "2221",
      destinationDomain: "1111",
    };
    const executeArgs = {
      params: callParams,
      local: "0xB7b1d3cC52E658922b2aF00c5729001ceA98142C",
      routers: ["0x9Ed231481DDf3BC96C0e063E5EF607ACe578CF31"],
      feePercentage,
      amount: 0,
      nonce: 34,
      relayerSignature,
      originSender: signer.address,
    };
    await connext.execute(executeArgs, {
      gasLimit: "3000000",
    });
  });
