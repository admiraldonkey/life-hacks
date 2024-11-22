import Link from "next/link";

export default function Nav() {
  return (
    <nav className="bg-myblack text-myblue py-8">
      <div className="flex justify-center h-full text-3xl space-x-20 md:space-x-32 md:text-4xl font-semibold">
        <Link
          href="/"
          className="content-center hover:underline hover:text-mypink"
        >
          Home
        </Link>
        <Link
          href="/posts"
          className="content-center hover:underline hover:text-mypink"
        >
          Posts
        </Link>
        <Link
          href="/posts/categories"
          className="content-center hover:underline hover:text-mypink"
        >
          Categories
        </Link>
      </div>
    </nav>
  );
}
