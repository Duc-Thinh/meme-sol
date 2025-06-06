'use client'
import { useTonConnectModal } from '@tonconnect/ui-react';
import { useWalletEVM } from '@/hooks/wallet';
import { useJettonTransfer } from '@/hooks/tonWallet';

import { useAppKitProvider } from '@reown/appkit/react';
import {TonClient} from "@ton/ton";
const wallet = () => {
    const { state, open, close } = useTonConnectModal();
    const { hdlSignMessage, hdlSignSolanaMessage } = useWalletEVM();
    const { sendTon, tranferUSDT } = useJettonTransfer();
    const { walletProvider } = useAppKitProvider("solana");
    console.log(walletProvider, 'walletProvider');
    return (
        <div>
            <div className="flex flex-col gap-4">
                <appkit-button/>
                <button onClick={open}>Open modal</button>
                <button onClick={() => hdlSignMessage('1', '12123123123123123123123')}>SignEVM</button>
                <button onClick={() => hdlSignSolanaMessage(walletProvider)}>SIGN SOLANA</button>
                <button onClick={() => sendTon({
                    amount: 1,
                    payload: {
                        "amount": 1,
                        "comment": "test"
                    }
                })}>SendTon</button>
                <button onClick={() => tranferUSDT({amount: 10, payload: { "amount": 1, "comment": "test" }})}>SendUsdtTOn</button>

            </div>
        </div>
    )
}

export default wallet