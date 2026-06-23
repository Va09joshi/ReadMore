import { Urbanist } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/providers/app-provider";
import { AdminLayout } from "@/components/layout/AdminLayout";

const urbanist = Urbanist({
  subsets: ["latin"],
});

export const metadata = {
  title: "Super Admin Dashboard",
  description: "Marketplace Super Admin Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${urbanist.className} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#faf9f6] text-black" suppressHydrationWarning={true}>
        <AppProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AdminLayout>
            {children}
          </AdminLayout>
        </AppProvider>
      </body>
    </html>
  );
}
