import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  useDisclosure,
  Button,
  Text,
  HStack,
  Select,
  Box
} from "@chakra-ui/react";
import { networkParams } from "../../networks";
import { toHex } from "../../utils";
import SelectWalletModal from "../../auth/AuthModal";
import { Link } from "react-router-dom";

function Header() {
	const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    library,
    chainId,
		active,
    deactivate
  } = useWeb3React();
	const [network, setNetwork] = useState(chainId);
	
	const handleNetwork = (e: any) => {
    const id = Number(e.target.value);
    setNetwork(id);
		switchNetwork();
  };

  const switchNetwork = async () => {
    try {
			if(network === -1) return;
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(network) }]
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [networkParams[toHex(network) as keyof typeof networkParams]]
          });
        } catch (error: any) {
					console.log(error);
        }
      }
    }
  };

  const refreshState = () => {
    window.localStorage.setItem("provider", "");
    setNetwork(-1);
  };

  const disconnect = () => {
    deactivate();
    refreshState();
  };

	return (
		<>
			<HStack padding="5" w="100vw" justify="space-between">
				<Box>
					<Text fontSize="lg" fontWeight="bold">
						NFTW
					</Text>
				</Box>
				<HStack
					spacing={8}
					align="center"
					justify={["center", "space-between", "flex-end", "flex-end"]}
					direction={["column", "row", "row", "row"]}
					pt={[4, 4, 0, 0]}
				>
					<Link to={"/"}><Text display="block">Home</Text></Link>
					{!active ? (
						<Button onClick={onOpen}>Connect Wallet</Button>
					) : (
						<>
							<Link to={"/articles"}><Text display="block">List</Text></Link>
							<Link to={"/write"}><Text display="block">Write</Text></Link>
							<Select value={chainId} onChange={handleNetwork} width="fit-content">
								<option value="137">Polygon Mainnet</option>
								<option value="80001">Polygon Mumbai</option>
								<option value="3092851097537429">SKALE ETHAmsterdam</option>
								<option value="1337">Localhost</option>
							</Select>
							<Button onClick={disconnect}>Disconnect</Button>
						</>
					)}
				</HStack>
				<SelectWalletModal isOpen={isOpen} closeModal={onClose} />
			</HStack>
		</>
	);
}

export default Header;