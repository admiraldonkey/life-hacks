import Link from "next/link";
import { db } from "@/utils/db";

// Page that displays all available categories
export default async function CategoriesPage() {
  const result = await db.query(`SELECT * FROM categories`);
  const categories = result.rows;

  return (
    <div className="flex flex-col justify-center items-center h-full bg-myblack">
      <h2 className="text-3xl md:text-4xl font-semibold text-mygrey mb-5">
        Choose a category to view associated posts
      </h2>
      <div className="w-3/6 flex flex-col md:flex-row flex-wrap mt-5 justify-around items-center py-10 border-2 border-myblue bg-myblue/20 mb-40">
        {categories.map((category) => {
          return (
            <div
              key={category.id}
              className="basis-1/3 text-center py-2 md:py-0"
            >
              <Link
                href={`/posts/categories/${category.id}`}
                className="text-3xl md:text-4xl lg:text-5xl text-mygrey hover:text-mypink hover:underline"
              >
                {category.name}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
