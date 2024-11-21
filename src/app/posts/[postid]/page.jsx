import Link from "next/link";
import { db } from "@/utils/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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
    <div>
      <h2>
        This is the dynamically routed page for displaying a particular post
        retrieved from params
      </h2>
      <h2>Post</h2>
      {/* <Link href="/posts/new">Add a comment</Link> */}
      {post.map((post) => {
        return (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <h5>Category: {post.category}</h5>
            <p>{post.content}</p>
            {/* <Link href={`posts/${post.id}`}>View Comments</Link> */}
          </div>
        );
      })}
      <Link href={`/posts/${postId}/edit`}>Edit Post</Link>
      <br />
      <br />
      <form action={handleDeletePost}>
        <button>Delete Post</button>
      </form>
      <h2>Comments</h2>
      <hr />
      {comments.map((comment) => {
        return (
          <div key={comment.id}>
            <h3>{comment.title}</h3>
            <p>{comment.content}</p>
            <Link href={`${postId}/comments/${comment.id}`}>Edit Comment</Link>
          </div>
        );
      })}
      <h2>Add Comment</h2>
      <form action={handleAddComment}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Title of your post"
        />
        <label htmlFor="content">Comment</label>
        <textarea
          name="content"
          id="content"
          placeholder="Enter your comment"
        ></textarea>
        <button>Post Comment</button>
      </form>
    </div>
  );
}
