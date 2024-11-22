import Nav from "@/components/Nav";
import "./globals.css";

export const metadata = {
  title: "Life Hacks",
  description: "Life is hard enough. Make things easier for yourself.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased text-2xl bg-mygrey h-screen flex flex-col`}>
        <Nav />
        {children}
      </body>
    </html>
  );
}
