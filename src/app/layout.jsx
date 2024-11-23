import Nav from "@/components/Nav";
import "./globals.css";

export const metadata = {
  title: "Life Hacks",
  description:
    "Life is hard enough. Make it easy on yourself. The Walker Brothers were onto something",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Make sure nav doesn't push other content down. Also ensures scrollbars don't affect page layouts */}
      <body
        className={`antialiased text-2xl bg-mygrey h-screen w-screen flex flex-col`}
      >
        <Nav />
        {children}
      </body>
    </html>
  );
}
