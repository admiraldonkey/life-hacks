import { db } from "@/utils/db";
import { redirect } from "next/navigation";
import Link from "next/link";

// Page with form for adding a new post
export default async function NewPostsPage() {
  // Retrieves available categories from database
  const categories = (await db.query(`SELECT * FROM categories`)).rows;

  // Updates the database with the new post using current values of form inputs
  async function handleAddPost(formData) {
    "use server";
    const title = formData.get("title");
    const content = formData.get("content");
    const category = formData.get("category");
    const user = "Jamie";
    // Only posts if user has selected a category. Couldn't figure out how to easily get it to notify user of this
    if (!category) {
      console.log("error");
    } else {
      await db.query(
        `INSERT INTO posts (title, content, category_id, user_id) VALUES ($1, $2, $3, (SELECT id FROM users WHERE username = $4))`,
        [title, content, category, user]
      );
      // Redirects user to post page
      redirect("/posts");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full pb-8">
      <h2 className="mb-8 text-4xl font-bold text-myblack">Add a New Post</h2>
      <form
        action={handleAddPost}
        className="w-4/5 flex flex-col rounded-3xl bg-myblack px-10 py-5 text-2xl md:text-3xl"
      >
        <label htmlFor="title" className="pb-2 text-myblue">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Title of your post"
          className="mb-4 px-2 py-1 border-2 focus:outline-none focus:ring-0 focus:border-mypink/75"
        />
        <label htmlFor="category" className="pb-2 text-myblue">
          Category
        </label>
        {/* Drop down menu that forces user to choose from one of the available categories */}
        <select
          name="category"
          id="category"
          className="mb-4 px-2 py-1 text-myblack border-2 focus:outline-none focus:ring-0 focus:border-mypink/75"
        >
          <option value="">-- Choose a Category --</option>
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
          rows="10"
          className="border-2 focus:outline-none focus:ring-0 focus:border-mypink/75"
        ></textarea>
        <button className="bg-mygrey text-myblack rounded-full border-2 mt-10 mb-5 px-2 py-2 hover:bg-myblue hover:shadow-lg hover:shadow-myblue/50 hover:font-semibold hover:border-myblue focus:outline-none focus:ring-0 focus:border-mypink/75">
          Submit Life Hack
        </button>
      </form>
      <Link
        href={`/posts`}
        className="mt-4 font-semibold hover:underline hover:text-mypink"
      >
        Go Back
      </Link>
    </div>
  );
}
