import { redirect } from "next/navigation";

export default async function CommentsPage({ params }) {
  const postId = (await params).postid;
  return (
    <div>
      {/* Unused route as comments are displayed directly on post page. 
      Redirects to post page if visited */}
      <h2>Error: Invalid route. Redirecting...</h2>
      {redirect(`/posts/${postId}`)};
    </div>
  );
}
