import "./globals.css";

export const metadata = {
  title: "BitcoinSolar Dashboard",
  description: "AI Orchestrator Dashboard for BitcoinSolar"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
