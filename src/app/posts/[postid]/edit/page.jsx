import { db } from "@/utils/db";
import { redirect } from "next/navigation";

export default async function EditIndividualPost({ params }) {
  const id = (await params).postid;
  const categories = (await db.query(`SELECT * FROM categories`)).rows;

  const response = await db.query(`SELECT * FROM posts WHERE id = ${id}`);
  const post = response.rows;
  //   await console.log(post[0].id);
  //   formData.set("title", post[0].title);

  async function handleUpdatePost(formData) {
    "use server";
    const title = formData.get("title");
    const category = formData.get("category");
    const content = formData.get("content");
    await db.query(
      `UPDATE posts SET title = $1, category_id = $2, content = $3 WHERE id = $4`,
      [title, category, content, id]
    );
    redirect(`/posts/${id}`);
  }

  return (
    <div>
      <form action={handleUpdatePost}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={post[0].title}
        />
        <label htmlFor="category">Category</label>
        <select
          name="category"
          id="category"
          defaultValue={post[0].category_id}
        >
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
          defaultValue={post[0].content}
        ></textarea>
        <button>Update Life Hack</button>
      </form>
    </div>
  );
}
