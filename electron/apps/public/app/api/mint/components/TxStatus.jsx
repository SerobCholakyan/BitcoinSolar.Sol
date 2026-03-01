export default function TxStatus({ result }) {
  return (
    <div
      style={{
        marginTop: "1rem",
        padding: "0.75rem",
        borderRadius: 8,
        background: "rgba(22, 163, 74, 0.1)",
        border: "1px solid rgba(22, 163, 74, 0.4)",
        fontSize: "0.9rem"
      }}
    >
      <div>✅ Mint successful</div>
      <div>Tx: {result.txHash}</div>
      <div>Status: {result.status}</div>
      <div>Block: {result.blockNumber}</div>
    </div>
  );
}
