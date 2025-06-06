import { beginCell, Address, TonClient, toNano } from '@ton/ton';
import TonWeb from 'tonweb';
import { useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import { useCallback } from 'react';

type SendTonParams = {
    amount: string;
    payload: object | null;
};
interface PinObject {
    value: string;
    expire: number;
}



const client = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: 'ec533f73b3fa78e344de0076f44d4d00e756fd28dfe05d10eb68fc93ff12f66a',
})
const jettonMasterAddress = '0QDfh4eIU0SugavijTwxelbIIKyySf5TVm-6dufziu4rH8Dc';

const NEXT_CONTRACT_USDT = 'kQD0GKBM8ZbryVk2aESmzfU6b9b_8era_IkvBSELujFZPsyy'
export const useJettonTransfer = () => {
    const wallet = useTonWallet();
    const [tonConnectUI] = useTonConnectUI();

    const getJettonWalletAddress = useCallback(async (userAddress: string, jettonMaster: string) => {
        const userAddressCell = beginCell().storeAddress(Address.parse(userAddress)).endCell();
        const response = await client.runMethod(Address.parse(NEXT_CONTRACT_USDT), 'get_wallet_address', [
            { type: 'slice', cell: userAddressCell },
        ]);
        if (response) {
            return response.stack.readAddress();
        }
        return {};
    }, []);

    const tranferUSDT = async ({ amount, payload }: SendTonParams) => {
        const payloadString = JSON.stringify(payload);
        const senderAddress = tonConnectUI?.wallet?.account.address || '';
        const toAddress = jettonMasterAddress;
        const jettonWallet = await getJettonWalletAddress(senderAddress, jettonMasterAddress);
        console.log(jettonWallet, 'jettonWallet', amount);
        const body = beginCell()
            .storeUint(0x0f8a7ea5, 32) // internal_transfer op code
            .storeUint(0, 64)
            .storeCoins(BigInt(Math.floor(parseFloat(amount) * 1e6)))
            .storeAddress(Address.parse(toAddress)) // destination address
            .storeAddress(Address.parse(toAddress)) // response destination
            .storeBit(0) // no custom_payload
            .storeCoins(0) // forward_amount = 0
            .storeBit(1) // có forward_payload (1 = true)
            .storeRef(beginCell().storeUint(0, 32).storeStringTail(payloadString).endCell()) // forward_payload chứa comment
            .endCell();
        const transaction = {
            validUntil: Math.floor(Date.now() / 1000) + 360,
            messages: [
                {
                    address: jettonWallet.toString(),
                    amount: toNano('0.05').toString(),
                    payload: body.toBoc().toString('base64'),
                },
            ],
        };
        const { boc } = await tonConnectUI.sendTransaction(transaction);
        if (boc) {
            const res = await sendBocAndGetHash(boc);
            return res;
        }
    };

    const sendTon = async ({ amount, payload }: SendTonParams) => {
        const payloadString = JSON.stringify(payload);
        const body = beginCell()
            .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
            .storeStringTail(payloadString) // write our text comment
            .endCell();

        const transaction = {
            validUntil: Math.floor(Date.now() / 1000) + 3600,
            messages: [
                {
                    address: jettonMasterAddress,
                    amount: toNano(amount).toString(),
                    payload: body.toBoc().toString('base64'),
                },
            ],
        };

        try {
            const { boc } = await tonConnectUI.sendTransaction(transaction);
            if (boc) {
                const res = await sendBocAndGetHash(boc);
                return res;
            }
        } catch (error) {
            console.error('Lỗi khi gửi giao dịch:', error);
        }
    };

    const getBalanceTON = async () => {
        // if (!wallet) {
        //   throw new Error("Wallet is not connected");
        // }
        // const address = Address.parse(wallet.account.address).toString();
        // const balanceNano = await client.getBalance(address);
        // const balanceTON = fromNano(balanceNano);
        // return balanceTON;
    };

    const getBalanceUSDT = async () => {
        if (!wallet) {
            throw new Error('Wallet is not connected');
        }
        try {
            const jettonWalletAddress = await getJettonWalletAddress(wallet.account.address, NEXT_CONTRACT_USDT);
            const response = await client.runMethod(jettonWalletAddress as Address, 'get_wallet_data');
            const balance = response.stack.readBigNumber().toString();
            const formattedBalance = (Number(balance) / 1000000).toFixed(6);
            return formattedBalance;
        } catch (err) {
            console.error(err, 'error');
            return 100;
        }
    };

    const sendBocAndGetHash = async (boc: string) => {
        const bocCellBytes = await TonWeb.boc.Cell.oneFromBoc(TonWeb.utils.base64ToBytes(boc)).hash();
        const hashBase64 = await TonWeb.utils.bytesToBase64(bocCellBytes);
        return hashBase64;
    };

    return { sendTon, tranferUSDT, getBalanceTON, getBalanceUSDT };
};