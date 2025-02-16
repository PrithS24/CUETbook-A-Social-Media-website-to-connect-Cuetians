import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Header from './components/Header'
import AuthWrapper from "./auth-wrapper";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CUETbook",
  description: "A platform for CUETians",
};

export default function RootLayout({ children }) {
  return (
    
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster/>
        <ThemeProvider attribute="class"
        defaultTheme="light">  
         <AuthWrapper>
          {children}
         </AuthWrapper>
        </ThemeProvider>
        
      </body>
    </html>
  );
}
