import { NextResponse } from "next/server";
import BLSRMinter from "@/lib/blsr-mint";
import abi from "@/lib/blsr-abi.json";

let minter;

function getMinter() {
  if (!minter) {
    minter = new BLSRMinter({
      rpcUrl: process.env.BLSR_RPC_URL,
      privateKey: process.env.BLSR_MINTER_PK,
      contractAddress: process.env.BLSR_CONTRACT,
      abi,
      gas: {
        maxFeePerGas: process.env.BLSR_MAX_FEE_PER_GAS || undefined,
        maxPriorityFeePerGas: process.env.BLSR_MAX_PRIORITY_FEE_PER_GAS || undefined
      },
      logger: console
    });
  }
  return minter;
}

export async function POST(req) {
  try {
    const { logLine } = await req.json();

    if (!logLine || typeof logLine !== "string" || !logLine.trim()) {
      return NextResponse.json(
        { error: "logLine must be a non-empty string" },
        { status: 400 }
      );
    }

    const minterInstance = getMinter();
    const receipt = await minterInstance.mintReward(logLine);

    return NextResponse.json({
      ok: true,
      txHash: receipt.transactionHash,
      status: receipt.status,
      blockNumber: receipt.blockNumber
    });
  } catch (err) {
    const message = err?.message || "Internal error";
    console.error("[API /api/mint] error:", err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
