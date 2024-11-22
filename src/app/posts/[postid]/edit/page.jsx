import { db } from "@/utils/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function EditIndividualPost({ params }) {
  const id = (await params).postid;
  const categories = (await db.query(`SELECT * FROM categories`)).rows;

  const response = await db.query(`SELECT * FROM posts WHERE id = ${id}`);
  const post = response.rows;

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
    <div className="flex flex-col items-center justify-center h-full pb-8">
      <h2 className="mb-8 text-4xl font-bold text-myblack">Edit Post</h2>
      <form
        action={handleUpdatePost}
        className="w-4/5 flex flex-col rounded-3xl bg-myblack px-10 py-5 text-2xl md:text-3xl"
      >
        <label htmlFor="title" className="pb-2 text-myblue">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={post[0].title}
          className="mb-4 px-2 py-1 border-2 focus:outline-none focus:ring-0 focus:border-mypink/75"
        />
        <label htmlFor="category" className="pb-2 text-myblue">
          Category
        </label>
        <select
          name="category"
          id="category"
          defaultValue={post[0].category_id}
          className="mb-4 px-2 py-1 text-myblack border-2 focus:outline-none focus:ring-0 focus:border-mypink/75"
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
        <label htmlFor="content" className="pb-2 text-myblue">
          What&apos;s your hack?
        </label>
        <textarea
          name="content"
          id="content"
          placeholder="Enter your life hack here!"
          defaultValue={post[0].content}
          rows="10"
          className="border-2 focus:outline-none focus:ring-0 focus:border-mypink/75"
        ></textarea>
        <button className="bg-mygrey text-myblack rounded-full border-2 mt-10 mb-5 px-2 py-2 hover:bg-myblue hover:shadow-lg hover:shadow-myblue/50 hover:font-semibold focus:outline-none focus:ring-0 focus:border-mypink/75">
          Update Life Hack
        </button>
      </form>
      <Link
        href={`/posts/${id}`}
        className="mt-4 font-semibold hover:underline hover:text-mypink"
      >
        Go Back
      </Link>
    </div>
  );
}
