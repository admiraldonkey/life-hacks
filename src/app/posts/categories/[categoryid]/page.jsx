import { db } from "@/utils/db";
import Link from "next/link";
export default async function IndividualCategoryPage({ params, searchParams }) {
  const id = (await params).categoryid;
  const searchParam = await searchParams;
  const sort = searchParam.sort;

  const result = await db.query(
    `SELECT
      posts.id, 
      posts.title, 
      posts.content, 
      users.username AS user, 
      categories.name AS category 
    FROM 
      posts 
    JOIN users ON posts.user_id = users.id 
    JOIN categories ON posts.category_id = categories.id 
    WHERE category_id = ${id}`
  );
  const posts = result.rows;

  if (sort == "asc") {
    await posts.sort();
  } else if (sort == "desc") {
    await posts.sort().reverse();
  }

  return (
    <div>
      <h2>Posts in the {posts[0].category} category</h2>
      <Link href={`${id}?sort=asc`}>Sort posts by ascending</Link>
      <br />
      <Link href={`${id}?sort=desc`}>Sort posts by descending</Link>
      <br />
      <Link href="../new">Create New Post</Link>
      <br />
      {posts.map((post) => {
        return (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <Link href={`../${post.id}`}>View Post</Link>
          </div>
        );
      })}
    </div>
  );
}
