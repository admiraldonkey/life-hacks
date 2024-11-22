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
      categories.name AS category, 
      (SELECT count(id) FROM comments WHERE posts.id = comments.post_id) as commentcount
    FROM 
      posts  
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
      <h2 className="text-mypink max-w-fit bg-myblack pb-2 px-4 rounded-br-lg">
        {posts[0].category}
      </h2>
      <div className="flex mt-5 justify-around py-2">
        <div className="flex">
          <h2 className="content-center mr-6 font-semibold">Sort posts by:</h2>
          <button className="bg-myblack text-myblue rounded-lg md:rounded-full text-xl px-2 py-1 md:text-2xl md:px-4 md:py-2 mr-2 border-2 hover:text-myblack hover:bg-myblue hover:border-2 hover:border-myblack">
            <Link href={`${id}?sort=asc`}>Ascending</Link>
          </button>
          <button className="bg-myblack text-myblue rounded-lg md:rounded-full text-xl px-2 py-1 md:text-2xl md:px-4 md:py-2 border-2 hover:text-myblack hover:bg-myblue hover:border-2 hover:border-myblack">
            <Link href={`${id}?sort=desc`}>Descending</Link>
          </button>
        </div>
        <button className="bg-myblack text-myblue rounded-lg md:rounded-full text-xl px-2 py-1 md:text-2xl md:px-4 md:py-2 hover:text-myblack hover:bg-myblue hover:border-2 hover:border-myblack">
          <Link href="../new">Create New Post</Link>
        </button>
      </div>
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
                <button className="bg-mygrey text-myblack rounded-xl md:rounded-full px-2 md:py-1 hover:bg-myblue hover:shadow-lg hover:shadow-myblue/50 md:order-first mb-2 md:mb-0 max-w-fit">
                  <Link href={`../${post.id}`}>View Post</Link>
                </button>
              </div>
              <p className="text-mygrey">{post.content}</p>
              <div className="text-mypink text-right">
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
