import { db } from "@/utils/db";
import { redirect } from "next/navigation";

export default async function EditInvidivualComment({ params }) {
  const postId = (await params).postid;
  const commentId = (await params).commentid;

  const postResponse = await db.query(
    `SELECT * FROM posts WHERE id = ${postId}`
  );
  const post = postResponse.rows;

  const commentResponse = await db.query(
    `SELECT * FROM comments WHERE id = ${commentId}`
  );
  const comment = commentResponse.rows;

  async function handleUpdateComment(formData) {
    "use server";
    console.log(formData);
    const title = formData.get("title");
    const content = formData.get("content");
    await db.query(
      `UPDATE comments SET title = $1,content = $2 WHERE id = $3`,
      [title, content, commentId]
    );
    redirect(`/posts/${postId}`);
  }

  return (
    <div>
      <div>
        <h2>Commenting on post</h2>
        <h3>{post[0].title}</h3>
        <p>{post[0].content}</p>
      </div>
      <h2>Edit Your Comment</h2>
      <form action={handleUpdateComment}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Title of your post"
          defaultValue={comment[0].title}
        />
        <label htmlFor="content">Comment</label>
        <textarea
          name="content"
          id="content"
          placeholder="Enter your comment"
          defaultValue={comment[0].content}
        ></textarea>
        <button>Update Comment</button>
      </form>
    </div>
  );
}
