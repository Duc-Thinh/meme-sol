'use client'
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { useSignMessage, useAccount, useTransaction, useContractWrite } from 'wagmi'
import { parseUnits, erc20Abi } from 'viem'
const ROOT_WALLET = '0xcB5c34b1320972d752De43a215E645b5fD8B3715'

export const useWalletEVM = () => {
    const { address } = useAccount()
    const { signMessage, signMessageAsync } = useSignMessage()
    const { sendTransaction, sendTransactionAsync } = useTransaction()
    const { writeContractAsync } = useContractWrite()
    const  hdlSignMessage = async (network: string, solanaAddress: string) => {
       const signature = await signMessageAsync({
           message: `${address}:${network}:${solanaAddress}`
       })
    }
    const hdlSignSolanaMessage = async (walletProvider) => {
        const encodedMessage = new TextEncoder().encode("Hello from AppKit");
        const signature = await walletProvider.signMessage(encodedMessage);
    }
    const hdlSendNative = async (amount) => {
        const res = await sendTransactionAsync({
            to: ROOT_WALLET,
            value: parseUnits(amount, 18),
        });
    }
    const hdlSendUsdt = async (amount) => {
        const res = await writeContractAsync({
            address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            abi: erc20Abi,
            to: ROOT_WALLET,
            value: parseUnits(amount, 6),
        });
    }
    return {
        hdlSignMessage,
        hdlSignSolanaMessage,
        hdlSendUsdt,
        hdlSendNative,
    }
}
