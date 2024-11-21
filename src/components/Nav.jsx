import Link from "next/link";

export default function Nav() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <br />
      <Link href="/posts">Posts</Link>
      <br />
      <Link href="/posts/categories">Categories</Link>
    </nav>
  );
}
