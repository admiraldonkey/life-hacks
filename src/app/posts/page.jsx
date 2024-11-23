import Link from "next/link";
import { db } from "@/utils/db";

// Page that displays ALL posts
export default async function PostsPage({ searchParams }) {
  const searchParam = await searchParams;
  const sort = searchParam.sort;

  // Get all post data, along with associated category name and number of comments associated with each post.
  const result = await db.query(`
  SELECT 
    posts.id, 
    posts.title, 
    posts.content, 
    categories.name AS category,
    (SELECT count(id) FROM comments WHERE posts.id = comments.post_id) as commentcount 
  FROM posts
  JOIN categories ON posts.category_id = categories.id`);
  const posts = result.rows;

  // Sorts posts in a way that retains order regardless of edits to posts
  await posts.sort((a, b) => a.id - b.id);

  // Sort posts by ascending or descending order depending on user choice
  if (sort == "asc") {
    await posts.sort((a, b) => a.id - b.id);
  } else if (sort == "desc") {
    await posts.sort((a, b) => b.id - a.id);
  }

  return (
    // Disable horizontal scrollbar
    <div className="overflow-x-hidden">
      <div className="flex mt-5 justify-around py-2">
        <div className="flex">
          {/* Sort posts by ascending or descending */}
          <h2 className="content-center mr-6 font-semibold">Sort by:</h2>
          <Link
            href="/posts?sort=asc"
            className="px-2 py-1 md:px-4 md:py-2 bg-myblack text-myblue rounded-lg md:rounded-full text-xl md:text-2xl mr-2 border-2 hover:text-myblack hover:bg-myblue hover:border-2 hover:border-myblack text-center"
          >
            Oldest First
          </Link>
          <Link
            href="/posts?sort=desc"
            className="px-2 py-1 md:px-4 md:py-2 bg-myblack text-myblue rounded-lg md:rounded-full text-xl md:text-2xl  border-2 hover:text-myblack hover:bg-myblue hover:border-2 hover:border-myblack text-center"
          >
            Newest First
          </Link>
        </div>
        {/* Create a new post */}
        <Link
          href="/posts/new"
          className="px-2 py-1 md:px-4 md:py-2 bg-myblack text-myblue rounded-lg md:rounded-full text-xl md:text-2xl border-2 hover:text-myblack hover:bg-myblue hover:border-2 hover:border-myblack text-center"
        >
          Create New Post
        </Link>
      </div>
      {/* Map through each post in posts array and render to screen with alternating design */}
      <div className="flex flex-col items-center">
        {posts.map((post) => {
          return (
            <div
              key={post.id}
              className="w-5/6 bg-myblack even:bg-myblack/90 my-5 odd:rounded-r-3xl  even:rounded-l-3xl px-10 py-5 last:mb-20"
            >
              <div className="flex flex-col md:flex-row justify-between mb-2">
                <h3 className="text-myblue text-2xl sm:text-3xl md:text-4xl font-semibold order-last md:order-first">
                  {post.title}
                </h3>
                <Link
                  href={`posts/${post.id}`}
                  className="px-2 md:py-1 bg-mygrey text-myblack rounded-xl md:rounded-full hover:bg-myblue hover:shadow-lg hover:shadow-myblue/50 md:order-first mb-2 md:mb-0 max-w-fit text-center"
                >
                  View Post
                </Link>
              </div>
              <h5 className="text-mypink text-xl sm:text-2xl mb-2 italic indent-2">
                Category: {post.category}
              </h5>
              <p className="text-mygrey ">{post.content}</p>
              <div className="text-mypink text-right">
                {/* Conditionally display correct grammar depending on number of comments on a post */}
                {post.commentcount == 1 && <p>1 comment</p>}
                {post.commentcount != 1 && <p>{post.commentcount} comments</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
