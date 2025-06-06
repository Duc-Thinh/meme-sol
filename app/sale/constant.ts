// lib/constants.ts
export const PAYMENT_WALLETS = {
  ETH: "0x1234567890abcdef1234567890abcdef12345678",
  BSC: "0xabcdef1234567890abcdef1234567890abcdef12",
  TON: "EQ1234567890abcdef1234567890abcdef123456",
  SOL: "abc1234567890abcdef1234567890abcdef123456",
} as const;

export const SALE_INFO = {
  currentRound: 1,
  remainingTokens: 200000000,
  tokenPrice: 0.01, // Round 1: $0.01, Round 2: $0.02
};

export const USER_BALANCE = {
  ETH: 1000,
  BSC: 500,
  TON: 200,
  SOL: 800,
};

export const submitTransaction = (data: {
  txID: string;
  network: string;
  userWallet: string;
  solanaWallet: string;
  amount: number;
}) => {
  return { success: true, message: "Transaction recorded successfully" };
};