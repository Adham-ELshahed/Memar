import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meamar - Construction Marketplace Qatar",
  description: "Qatar's leading B2B/B2C marketplace for construction materials and home fitout solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
