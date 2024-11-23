import Link from "next/link";
import { db } from "@/utils/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Page that displays a specific post and all associated comments
export default async function IndividualPostPage({ params }) {
  const postId = (await params).postid;

  // Retrieves data about the post from database, including the name of associated category
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

  // Retrieves all comments associated with the specific post from the database
  const commentsResult = await db.query(
    `SELECT * FROM comments WHERE post_id = ${postId}`
  );
  const comments = commentsResult.rows;

  // Ensures comments don't get pushed to the bottom once updated (incase it is referenced by another comment)
  comments.sort((a, b) => a.id - b.id);

  // Posts the comment to the databse using current field values
  async function handleAddComment(formData) {
    "use server";
    const title = formData.get("title");
    const content = formData.get("content");
    const user = "Jamie";

    await db.query(
      `INSERT INTO comments (title, content, user_id, post_id) VALUES ($1, $2, (SELECT id FROM users WHERE username = $3), $4)`,
      [title, content, user, postId]
    );
    // Refreshes the page to display the new comment (and any other added comments since last refresh)
    revalidatePath(`/posts/${postId}`);
  }

  // Removes the post and all associated comments from the database
  async function handleDeletePost() {
    "use server";
    // Deletes the comments before the post to avoid potential issues with database table referencing
    await handleDeleteComments();
    await db.query(`DELETE FROM posts WHERE id = $1`, [postId]);
    // Redirects user to posts page once deletion has completed
    redirect("/posts");

    // Removes the associated comments from database
    async function handleDeleteComments() {
      await db.query(`DELETE FROM comments WHERE post_id = $1`, [postId]);
    }
  }

  return (
    <div className="mt-10 flex flex-col items-center overflow-x-hidden">
      <div className="w-5/6 bg-myblack my-5 px-10 py-5 rounded-3xl">
        {/* Displays the specific post data */}
        {post.map((post) => {
          return (
            <div key={post.id}>
              <div className="flex flex-col md:flex-row justify-between mb-2">
                <h3 className="text-myblue text-2xl sm:text-3xl md:text-4xl font-semibold order-last md:order-first">
                  {post.title}
                </h3>
                {/* CRUD option buttions for post */}
                <div className="flex md:order-first mb-2 md:mb-0 max-w-fit">
                  <Link
                    href={`/posts/${postId}/edit`}
                    className="bg-mygrey text-myblack rounded-xl md:rounded-lg px-1 sm:px-2 py-1 hover:bg-myblue hover:shadow-lg hover:shadow-myblue/50 mr-5 text-center h-min"
                  >
                    Edit Post
                  </Link>
                  <form action={handleDeletePost}>
                    <button className="bg-mygrey text-myblack rounded-xl md:rounded-lg px-1 sm:px-2 py-1 hover:bg-mypink hover:shadow-lg hover:shadow-mypink/50 text-center h-min">
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
        {/* Loops through the array of associated comments and renders each one to the page in alternating design */}
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
                  <Link
                    href={`${postId}/comments/${comment.id}`}
                    className="bg-mygrey text-myblack rounded-full px-2 py-1 hover:bg-myblue hover:shadow-lg hover:shadow-myblue/50 md:order-first mb-2 md:mb-0 max-w-fit text-center"
                  >
                    Edit Comment
                  </Link>
                </div>
                <p className="text-mygrey">{comment.content}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-5/6 mt-5 px-10">
        <h2 className="font-semibold indent-2 mb-2">Add Comment</h2>
        {/* Renders a form for users to add a comment directly on the post page for contextual input */}
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
            required
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
            required
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
