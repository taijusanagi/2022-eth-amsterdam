task("send", "send cross chain transfer")
  .addParam("sender", "sender")
  .addParam("receiver", "receiver")
  .addParam("nft", "nft")
  .addParam("token", "token")
  .setAction(async (taskArgs) => {
    const { sender, receiver, nft, token } = taskArgs;
    const XNFTSender = await ethers.getContractFactory("XNFTSender");
    const xNFTSender = await XNFTSender.attach(sender);

    const XNFT = await ethers.getContractFactory("XNFT");
    const xNFT = await XNFT.attach(nft);

    const approveTx = await xNFT.setApprovalForAll(xNFTSender.address, true, {
      gasLimit: "3000000",
    });
    const { transactionHash: approveHash } = await approveTx.wait();
    console.log(approveHash);

    const executeTx = await xNFTSender.execute(receiver, nft, token, {
      gasLimit: "3000000",
    });
    const { transactionHash: executeHash } = await executeTx.wait();
    console.log(executeHash);
  });
