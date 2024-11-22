import Link from "next/link";
import { db } from "@/utils/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Page that displays a specific post and all associated comments
export default async function IndividualPostPage({ params }) {
  const postId = (await params).postid;

  const postResult = await db.query(`
    SELECT
      posts.id, 
      posts.title, 
      posts.content, 
      categories.name AS category 
    FROM 
      posts 
    JOIN categories ON posts.category_id = categories.id 
    WHERE posts.id = ${postId}`);
  const post = postResult.rows;

  const commentsResult = await db.query(
    `SELECT * FROM comments WHERE post_id = ${postId}`
  );
  const comments = commentsResult.rows;
  // Ensures comments don't get pushed to the bottom once updated (incase it is referenced by another comment)
  comments.sort((a, b) => a.id - b.id);

  async function handleAddComment(formData) {
    "use server";
    const title = formData.get("title");
    const content = formData.get("content");
    const user = "Jamie";

    await db.query(
      `INSERT INTO comments (title, content, user_id, post_id) VALUES ($1, $2, (SELECT id FROM users WHERE username = $3), $4)`,
      [title, content, user, postId]
    );
    revalidatePath(`/posts/${postId}`);
  }

  async function handleDeletePost() {
    "use server";
    await handleDeleteComments();
    await db.query(`DELETE FROM posts WHERE id = $1`, [postId]);
    redirect("/posts");

    async function handleDeleteComments() {
      await db.query(`DELETE FROM comments WHERE post_id = $1`, [postId]);
    }
  }

  return (
    <div className="mt-10 flex flex-col items-center">
      <div className="w-5/6 bg-myblack my-5 px-10 py-5 rounded-3xl">
        {post.map((post) => {
          return (
            <div key={post.id}>
              <div className="flex flex-col md:flex-row justify-between mb-2">
                <h3 className="text-myblue text-2xl sm:text-3xl md:text-4xl font-semibold order-last md:order-first">
                  {post.title}
                </h3>
                <div className="flex md:order-first mb-2 md:mb-0 max-w-fit">
                  <button className="bg-mygrey text-myblack rounded-xl md:rounded-full px-1 sm:px-2 py-1 hover:bg-myblue hover:shadow-lg hover:shadow-myblue/50 mr-5">
                    <Link href={`/posts/${postId}/edit`}>Edit Post</Link>
                  </button>
                  <form action={handleDeletePost}>
                    <button className="bg-mygrey text-myblack rounded-xl md:rounded-full px-1 sm:px-2 py-1 hover:bg-myblue hover:shadow-lg hover:shadow-myblue/50">
                      Delete Post
                    </button>
                  </form>
                </div>
              </div>
              <h5 className="text-mypink text-xl sm:text-2xl mb-2 italic indent-2">
                Category: {post.category}
              </h5>
              <p className="text-mygrey">{post.content}</p>
            </div>
          );
        })}
      </div>
      <div className="w-5/6 my-5 px-10">
        <h2 className="font-semibold text-3xl border-b-2 border-b-myblack mb-5">
          Comments
        </h2>
        <div className="bg-mygrey">
          {comments.map((comment) => {
            return (
              <div
                key={comment.id}
                className="even:bg-myblack/95 odd:bg-myblack/85 px-10 py-5"
              >
                <div className="flex flex-col md:flex-row justify-between mb-2">
                  <h3 className="text-myblue font-semibold order-last md:order-first">
                    {comment.title}
                  </h3>
                  <button className="bg-mygrey text-myblack rounded-full px-2 py-1 hover:bg-myblue hover:shadow-lg hover:shadow-myblue/50 md:order-first mb-2 md:mb-0 max-w-fit">
                    <Link href={`${postId}/comments/${comment.id}`}>
                      Edit Comment
                    </Link>
                  </button>
                </div>
                <p className="text-mygrey">{comment.content}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-5/6 mt-5 px-10">
        <h2 className="font-semibold indent-2 mb-2">Add Comment</h2>
        <form
          action={handleAddComment}
          className="flex flex-col bg-myblack px-6 py-4"
        >
          <label htmlFor="title" className="text-myblue mb-2 font-semibold">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Title of your post"
            className="px-2 py-1 border-2 focus:outline-none focus:ring-0 focus:border-mypink/75"
          />
          <label
            htmlFor="content"
            className="text-myblue mb-2 mt-5 font-semibold"
          >
            Comment
          </label>
          <textarea
            name="content"
            id="content"
            placeholder="Enter your comment"
            className="px-2 py-1 border-2 focus:outline-none focus:ring-0 focus:border-mypink/75"
            rows="5"
          ></textarea>
          <div className="flex justify-center">
            <button className="bg-mygrey text-myblack rounded-full border-2 mt-4 px-4 py-2 hover:bg-myblue hover:shadow-lg hover:shadow-myblue/50 focus:outline-none focus:ring-0 focus:border-mypink/75">
              Post Comment
            </button>
          </div>
        </form>
      </div>
      <Link
        href={`/posts`}
        className="my-4 font-semibold hover:underline hover:text-mypink "
      >
        Go Back
      </Link>
    </div>
  );
}
