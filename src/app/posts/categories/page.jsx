import Link from "next/link";
import { db } from "@/utils/db";

export default async function CategoriesPage() {
  const result = await db.query(`SELECT * FROM categories`);
  const categories = result.rows;

  return (
    <div>
      <h2>This is the page for displaying ALL categories</h2>
      <h3>Available categories</h3>
      {categories.map((category) => {
        return (
          <div key={category.id}>
            <Link href={`/posts/categories/${category.id}`}>
              {category.name}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
