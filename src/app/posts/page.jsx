import Link from "next/link";
import { db } from "@/utils/db";

export default async function PostsPage({ searchParams }) {
  const result = await db.query(`
    SELECT
      posts.id, 
      posts.title, 
      posts.content, 
      categories.name AS category 
    FROM 
      posts 
    JOIN categories ON posts.category_id = categories.id`);
  const posts = result.rows;
  const searchParam = await searchParams;
  const sort = searchParam.sort;

  if (sort == "asc") {
    await posts.sort();
  } else if (sort == "desc") {
    await posts.sort().reverse();
  }

  return (
    <div>
      <h2>This is the page for displaying ALL posts</h2>
      <Link href="/posts?sort=asc">Sort posts by ascending</Link>
      <br />
      <Link href="/posts?sort=desc">Sort posts by descending</Link>
      <br />
      <Link href="/posts/new">Create New Post</Link>
      <br />
      {posts.map((post) => {
        return (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <h5>Category: {post.category}</h5>
            <p>{post.content}</p>
            <Link href={`posts/${post.id}`}>View Post</Link>
          </div>
        );
      })}
    </div>
  );
}
