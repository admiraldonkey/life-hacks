import { db } from "@/utils/db";
import { redirect } from "next/navigation";

export default async function NewPostsPage() {
  const categories = (await db.query(`SELECT * FROM categories`)).rows;

  async function handleAddPost(formData) {
    "use server";
    const title = formData.get("title");
    const content = formData.get("content");
    const category = formData.get("category");
    const user = "Jamie";

    await db.query(
      `INSERT INTO posts (title, content, category_id, user_id) VALUES ($1, $2, $3, (SELECT id FROM users WHERE username = $4))`,
      [title, content, category, user]
    );

    redirect("/posts");
  }

  return (
    <div>
      <h2>This is the page for the form to create a new post</h2>
      <h2>Add New Post</h2>
      <form action={handleAddPost}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Title of your post"
        />
        <label htmlFor="category">Category</label>
        <select name="category" id="category">
          <option value="">--Choose a Category--</option>
          {categories.map((category) => {
            return (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            );
          })}
        </select>
        <label htmlFor="content">What&apos;s your hack?</label>
        <textarea
          name="content"
          id="content"
          placeholder="Enter your life hack here!"
        ></textarea>
        <button>Submit Life Hack</button>
      </form>
    </div>
  );
}
