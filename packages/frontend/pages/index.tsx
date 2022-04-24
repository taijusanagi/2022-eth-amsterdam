import type { NextPage } from "next";
import { useState } from "react";

import {
  Input,
  Select,
  FormControl,
  FormLabel,
  Box,
  Button,
  Flex,
} from "@chakra-ui/react";
import { Layout } from "../components/Layout";

import Web3Modal from "web3modal";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useRecoilState } from "recoil";
import { accountState } from "../atoms/account";

import {
  X_NFT_ABI,
  RINKEBY_NFT_CONTRACT,
  RINKEBY_SENDER_CONTRACT,
  X_NFT_SENDER_ABI,
  KOVAN_RECEIVER_CONTRACT,
} from "../lib/web3";

const Home: NextPage = () => {
  const [account, setAccount] = useRecoilState(accountState);
  const [contractAddress, setContractAddress] = useState(RINKEBY_NFT_CONTRACT);
  const [tokenId, setTokenId] = useState("0");

  const handleChangeContractAddress = (v: any) => {
    setContractAddress(v.target.value);
  };

  const handleChangeTokenId = (v: any) => {
    setTokenId(v.target.value);
  };

  const bridge = async () => {
    try {
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: "95f65ab099894076814e8526f52c9149", // required
          },
        },
      };
      const web3Modal = new Web3Modal({
        network: "rinkeby",
        providerOptions, // required
      });
      const provider = await web3Modal.connect();
      const web3 = new Web3(provider);
      const [account] = await web3.eth.getAccounts();
      setAccount(account);
      const nft = new web3.eth.Contract(X_NFT_ABI as any, RINKEBY_NFT_CONTRACT);

      nft.methods
        .setApprovalForAll(RINKEBY_SENDER_CONTRACT, true)
        .send({ from: account })
        .on("transactionHash", function (txHash: string) {
          console.log(txHash);
          const sender = new web3.eth.Contract(
            X_NFT_SENDER_ABI as any,
            RINKEBY_SENDER_CONTRACT
          );
          sender.methods
            .execute(KOVAN_RECEIVER_CONTRACT, contractAddress, tokenId)
            .send({ from: account })
            .on("transactionHash", function (txHash: string) {
              console.log(txHash);
            });
        });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <FormControl>
        <Box mb="12px">
          <FormLabel>NFT Contract Address</FormLabel>
          <Input
            value={contractAddress}
            onChange={handleChangeContractAddress}
            placeholder="0x..."
          />
        </Box>
        <Box mb="12px">
          <FormLabel>NFT token ID</FormLabel>
          <Input
            value={tokenId}
            onChange={handleChangeTokenId}
            placeholder="0"
          />
        </Box>
        <Box mb="12px">
          <FormLabel>Destination Chain</FormLabel>
        </Box>
        <Box mb="24px">
          <Select>
            <option value="kovan">Kovan</option>
            <option value="optimism">Optimism (Soon)</option>
            <option value="boba">Boba Network (Soon)</option>
            <option value="zk-evm">zkEVM (Soon)</option>
            <option value="findora">Findora (Soon)</option>
            <option value="evmos">Evmos (Soon)</option>
          </Select>
        </Box>
        <Flex mb="12px" justify="right">
          <Button fontSize={"sm"} onClick={bridge}>
            NFT to xNFT
          </Button>
        </Flex>
      </FormControl>
    </Layout>
  );
};

export default Home;
