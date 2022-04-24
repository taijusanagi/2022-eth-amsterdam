const {
  signHandleRelayerFeePayload,
} = require("@connext/nxtp-utils/dist/helpers/signatures");

const {
  CONNEXT_CONTRACT_RINKEBY,
  CONNEXT_CONTRACT_KOVAN,
  RINKEBY_SOURCE_NFT_CONTRACT,
} = require("../lib/constants");

task("execute", "poc of cross message update")
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
      "0x685cc1f5fa8c03910805a47da3dbfcae13acc4a2a30733f750791f194983fff7";

    const feePercentage = 0;

    const relayerSignature = await signHandleRelayerFeePayload(
      transferId,
      feePercentage,
      signer
    );

    const ABI = [
      "function execute(address originNFTContractAddress, uint256 tokenId)",
    ];

    const interface = new ethers.utils.Interface(ABI);
    const callData = interface.encodeFunctionData("execute", [
      RINKEBY_SOURCE_NFT_CONTRACT,
      3,
    ]);

    const callParams = {
      to: "0xa61241a9D6a1EFA4F468d49d76Ac158F6aB29240",
      callData,
      originDomain: "1111",
      destinationDomain: "2221",
    };
    const executeArgs = {
      params: callParams,
      local: "0xB5AabB55385bfBe31D627E2A717a7B189ddA4F8F",
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
