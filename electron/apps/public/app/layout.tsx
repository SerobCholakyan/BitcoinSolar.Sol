import "./globals.css";

export const metadata = {
  title: "BitcoinSolar Dashboard",
  description: "BLSR on-chain minting and operator dashboard"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
