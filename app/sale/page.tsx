// components/SaleForm.tsx
"use client";

import { useState } from "react";
import {
  PAYMENT_WALLETS,
  SALE_INFO,
  USER_BALANCE,
  submitTransaction,
} from "./constant";

export default function SaleForm() {
  const [step, setStep] = useState(1); // Theo dõi bước hiện tại (1, 2, hoặc 3)
  const [network, setNetwork] = useState("");
  const [token, setToken] = useState(""); // Loại token thanh toán (native, USDT, USDC)
  const [solanaWallet, setSolanaWallet] = useState("");
  const [amount, setAmount] = useState("");
  const [txID, setTxID] = useState("");
  const [userWallet, setUserWallet] = useState(""); // Giả lập ví thanh toán
  const [userBalance, setUserBalance] = useState(USER_BALANCE);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isRound2, setIsRound2] = useState(false); // Quản lý round 2

  // Tính toán giá token và số token còn lại dựa trên round
  const tokenPrice = isRound2 ? 0.02 : SALE_INFO.tokenPrice;
  const remainingTokens = isRound2 ? 200000000 : SALE_INFO.remainingTokens;

  // Danh sách token thanh toán dựa trên mạng
  const tokenOptions = {
    ETH: ["ETH", "USDT", "USDC"],
    BSC: ["BNB", "USDT", "USDC"],
    TON: ["TON", "USDT", "USDC"],
    SOL: ["SOL", "USDT", "USDC"],
  };

  // Xử lý kết nối ví và đăng nhập (giả lập)
  const handleConnectWallet = () => {
    if (!network) {
      setError("Please select a network");
      return;
    }
    try {
      setUserWallet("0xMockUserWallet");
      setUserBalance(USER_BALANCE);
      setError("");
      setSuccess("Wallet connected successfully");
    } catch {
      setError("Failed to connect wallet");
    }
  };

  // Xử lý ký xác nhận và chuyển sang Step 2
  const handleSign = () => {
    if (!solanaWallet || !userWallet) {
      setError("Please connect wallet and enter Solana address");
      return;
    }
    if (solanaWallet.length < 32) {
      setError("Invalid Solana wallet address");
      return;
    }
    try {
      setError("");
      setSuccess("Wallet linked successfully");
      setStep(2);
    } catch {
      setError("Failed to sign");
    }
  };

  // Xử lý thanh toán (giả lập) và chuyển sang Step 3
  const handlePayment = () => {
    if (!amount || Number(amount) <= 0 || Number(amount) > remainingTokens) {
      setError(
        `Invalid token amount. Max: ${remainingTokens.toLocaleString()}`
      );
      return;
    }
    if (!token) {
      setError("Please select a payment token");
      return;
    }
    try {
      setError("");
      setSuccess(
        `Send payment to ${
          PAYMENT_WALLETS[network as keyof typeof PAYMENT_WALLETS][
            token as keyof (typeof PAYMENT_WALLETS)[keyof typeof PAYMENT_WALLETS]
          ]
        } on ${network} using ${token}`
      );
      if (Number(amount) >= remainingTokens && !isRound2) {
        setIsRound2(true);
      }
      setStep(3);
    } catch {
      setError("Payment failed");
    }
  };

  // Xử lý gửi txID (giả lập)
  const handleSubmitTxID = () => {
    if (!txID) {
      setError("Please enter transaction ID");
      return;
    }
    try {
      const response = submitTransaction({
        txID,
        network,
        token,
        userWallet,
        solanaWallet,
        amount: Number(amount),
      });
      if (response.success) {
        setUserBalance((prev) => ({
          ...prev,
          [network]:
            prev[network as keyof typeof USER_BALANCE] + Number(amount),
        }));
        setSuccess(response.message);
        setError("");
        setTxID("");
        setStep(2); // Quay lại Step 2
      }
    } catch {
      setError("Failed to submit transaction");
    }
  };

  // Hàm quay lại bước trước
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError("");
      setSuccess("");
    }
  };

  return (
    <div
      className="max-w-xl mx-auto p-6 bg-[#212121] text-[#BDBDBD] rounded-2xl text-white flex flex-col gap-4 border-[#424242]"
      style={{ boxShadow: "0 4px 20px rgba(255, 255, 255, 0.3)" }}
    >
      <h1 className="text-2xl font-bold text-center">
        Meme-Token Sale Round {isRound2 ? 2 : SALE_INFO.currentRound}
      </h1>

      {/* Sale Round Progress Bar and Info */}
      <div className="mb-4">
        <div className="flex justify-between">
          <p className="text-base text-gray-300">
            <span className="text-white font-bold">$0</span>
          </p>
          <p className="text-base text-gray-300 font-bold">
            <span className="text-white font-bold">$2,992,500</span>
          </p>
        </div>

        <div className="w-full bg-[#535353] border border-[#00A6FF] rounded-full h-4 mt-2">
          <div
            className="bg-[#007AFF] h-4 rounded-full text-center text-sm flex items-center justify-center"
            style={{ width: "50%" }}
          >
            <div> 50%</div>
          </div>
        </div>
      </div>

      <div className="flex justify-between text-[#BDBDBD]">
        <span>Price</span>
        <span>${tokenPrice}</span>
      </div>
      {/* Progress Bar cho các bước */}
      <div className="mb-4 mt-10">
        <div className="flex justify-between mb-2">
          <span
            className={`text-sm ${
              step === 1 ? "text-[#007AFF] font-bold" : "text-gray-300"
            }`}
          >
            Step 1: Connect
          </span>
          <span
            className={`text-sm ${
              step === 2 ? "text-[#007AFF] font-bold" : "text-gray-300"
            }`}
          >
            Step 2: Buy Tokens
          </span>
          <span
            className={`text-sm ${
              step === 3 ? "text-[#007AFF] font-bold" : "text-gray-300"
            }`}
          >
            Step 3: Payment
          </span>
        </div>
        <div className="w-full bg-[#535353] rounded-full h-2">
          <div
            className="bg-[#007AFF] h-2 rounded-full"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step 1: Chọn mạng và nhập địa chỉ ví Solana */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-base font-medium text-[#BDBDBD]">
              Select Network
            </label>
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="mt-1 block w-full p-2 border border-[#424242] rounded-xl bg-[#212121] text-white "
            >
              <option value="">Select a network</option>
              <option value="ETH">Ethereum</option>
              <option value="BSC">Binance Smart Chain</option>
              <option value="TON">The Open Network</option>
              <option value="SOL">Solana</option>
            </select>
            <button
              onClick={handleConnectWallet}
              className="mt-4 w-full bg-[#007AFF]/80 text-white p-2 rounded-full hover:bg-[#007AFF] transition"
            >
              Connect Wallet
            </button>
          </div>
          <div>
            <label className="block text-base font-medium text-[#BDBDBD]">
              Solana Wallet Address
            </label>
            <input
              type="text"
              value={solanaWallet}
              onChange={(e) => setSolanaWallet(e.target.value)}
              placeholder="Enter Solana wallet address"
              className="mt-1 block w-full p-2 border border-[#424242] rounded-xl bg-[#212121] text-white focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleSign}
              className="mt-4 w-full bg-[#007AFF]/80 text-white p-2 rounded-full hover:bg-[#007AFF] transition"
            >
              Sign to Login
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Hiển thị thông tin tài khoản và mua token */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-center items-center gap-3">
              <div className="w-full">
                <label className="block text-base font-medium text-[#BDBDBD]" >
                  Amount to buy
                </label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  className="mt-1 block w-full p-2 border border-[#424242] rounded-xl bg-[#212121] text-white"
                />
              </div>
              <div className="w-full">
                <label className="block text-base font-medium text-[#BDBDBD]">
                  Payment type
                </label>
                <select
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="mt-1 block w-full p-2 border border-[#424242] text-[#BDBDBD] rounded-xl bg-[#212121] text-white "
                >
                  <option value="" className="text-[#BDBDBD]">Select a token</option>
                  {network &&
                    tokenOptions[network as keyof typeof tokenOptions].map(
                      (token) => (
                        <option key={token} value={token}>
                          {token}
                        </option>
                      )
                    )}
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={handleBack}
                className="w-full bg-[#535353] text-white p-2 rounded-full hover:bg-[#424242] transition"
              >
                Back
              </button>
              <button
                onClick={handlePayment}
                className="w-full bg-[#007AFF]/80 text-white p-2 rounded-full hover:bg-[#007AFF] transition"
              >
                Pay
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#BDBDBD]">
              Account Information
            </h2>
            <div className="p-4 px-6 bg-[#333333] rounded-xl flex flex-col gap-1 text-sm text-[#BDBDBD]">
              <p>Your Balance</p>
              <div className="flex justify-between">
                <span>BSC</span>
                <span>{userBalance.BSC}</span>
              </div>
              <div className="flex justify-between">
                <span>ETH</span>
                <span>{userBalance.ETH}</span>
              </div>
              <div className="flex justify-between">
                <span>SOL</span>
                <span>{userBalance.SOL}</span>
              </div>
              <div className="flex justify-between">
                <span>TON</span>
                <span>{userBalance.TON}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Thanh toán và gửi txID */}
      {step === 3 && (
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-[#333333] rounded-md">
            <h3 className="text-base font-medium">Send Payment to:</h3>
            <p className="text-sm break-all">
              {
                PAYMENT_WALLETS[network as keyof typeof PAYMENT_WALLETS][
                  token as keyof (typeof PAYMENT_WALLETS)[keyof typeof PAYMENT_WALLETS]
                ]
              }
            </p>
            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  PAYMENT_WALLETS[network as keyof typeof PAYMENT_WALLETS][
                    token as keyof (typeof PAYMENT_WALLETS)[keyof typeof PAYMENT_WALLETS]
                  ]
                )
              }
              className="mt-2 bg-[#212121]/80 text-white px-2 rounded-md hover:bg-[#424242] transition"
            >
              Copy
            </button>
          </div>
          <div>
            <label className="block text-base font-medium">
              Transaction ID
            </label>
            <input
              type="text"
              value={txID}
              onChange={(e) => setTxID(e.target.value)}
              placeholder="Enter transaction ID"
              className="mt-1 block w-full p-2 border rounded-xl bg-[#212121] border-[#424242]"
            />
            <div className="flex items-center between gap-4 mt-4">
              <button
                onClick={handleBack}
                className="mt-2 w-full bg-[#535353] text-white p-2 rounded-full hover:bg-[#424242] transition"
              >
                Back
              </button>
              <button
                onClick={handleSubmitTxID}
                className="mt-4 w-full bg-[#007AFF]/80 text-white p-2 rounded-full hover:bg-[#007AFF] transition"
              >
                Submit Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thông báo lỗi/thành công */}
      {error && <p className="text-red-600 mt-2">{error}</p>}
      {solanaWallet && (
        <div className="text-sm mt-5">
          <div className="text-[#BDBDBD]">You will receive meme-sol at </div>
          <div className="text-[#007AFF]"> {solanaWallet}</div>
        </div>
      )}
    </div>
  );
}
