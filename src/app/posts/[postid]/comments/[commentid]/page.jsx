import { db } from "@/utils/db";
import { redirect } from "next/navigation";
import Link from "next/link";

// Page that displays a form for users to edit a specific comment
export default async function EditInvidivualComment({ params }) {
  const postId = (await params).postid;
  const commentId = (await params).commentid;

  // Retrieves all data for the relevant post
  const postResponse = await db.query(
    `SELECT
      posts.id, 
      posts.title, 
      posts.content, 
      categories.name AS category 
    FROM 
      posts 
    JOIN categories ON posts.category_id = categories.id 
    WHERE posts.id = ${postId}`
  );
  const post = postResponse.rows;

  // Retrieve all data for the specified post
  const commentResponse = await db.query(
    `SELECT * FROM comments WHERE id = ${commentId}`
  );
  const comment = commentResponse.rows;

  // Updates the correct entry in the database with current data in the form
  async function handleUpdateComment(formData) {
    "use server";
    const title = formData.get("title");
    const content = formData.get("content");
    await db.query(
      `UPDATE comments SET title = $1,content = $2 WHERE id = $3`,
      [title, content, commentId]
    );
    redirect(`/posts/${postId}`);
  }

  return (
    <div className="mt-10 flex flex-col items-center">
      <h2 className="font-semibold text-3xl">Commenting on post</h2>
      {/* Displays the post related to the comment so the user has context for editing the comment */}
      <div className="w-5/6 bg-myblack my-5 px-10 py-5 rounded-3xl">
        <h3 className="text-myblue text-2xl sm:text-3xl md:text-4xl font-semibold mb-2">
          {post[0].title}
        </h3>
        <h5 className="text-mypink text-xl sm:text-2xl mb-2 italic indent-2">
          Category: {post[0].category}
        </h5>
        <p className="text-mygrey">{post[0].content}</p>
      </div>
      <div className="w-5/6 my-5 px-10">
        <h2 className="font-semibold indent-2 mb-2">Edit Comment</h2>
        {/* Form for editing the comment. Values automatically populated with current comment data */}
        <form
          action={handleUpdateComment}
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
            defaultValue={comment[0].title}
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
            defaultValue={comment[0].content}
            className="px-2 py-1 border-2 focus:outline-none focus:ring-0 focus:border-mypink/75"
            rows="5"
            required
          ></textarea>
          <div className="flex justify-center">
            <button className="bg-mygrey text-myblack rounded-full border-2 mt-4 px-4 py-2 hover:bg-myblue hover:shadow-lg hover:shadow-myblue/50 focus:outline-none focus:ring-0 focus:border-mypink/75">
              Update Comment
            </button>
          </div>
        </form>
      </div>
      <Link
        href={`/posts/${postId}`}
        className="font-semibold hover:underline hover:text-mypink"
      >
        Back to Post
      </Link>
    </div>
  );
}
