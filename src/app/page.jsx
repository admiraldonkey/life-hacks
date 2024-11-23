import Link from "next/link";

// Splash page
export default function HomePage() {
  return (
    <div className="h-full flex flex-cols justify-center items-center bg-myblack">
      <div className="flex flex-col text-center mb-20">
        <h2 className="text-7xl sm:text-8xl text-myblue font-semibold mb-10">
          Life Hacks
        </h2>
        <h4 className="text-3xl sm:text-4xl text-mygrey mb-3">
          Life is hard enough. Simplify it.
        </h4>
        <h4 className="text-3xl sm:text-4xl text-mygrey">
          Because you deserve <span className="text-mypink italic">better</span>
        </h4>
        <div className="flex flex-col sm:flex-row justify-around mt-10">
          <Link
            href="/posts"
            className="px-4 py-2 bg-mygrey text-myblack font-semibold text-3xl rounded-full hover:bg-myblue hover:shadow-lg hover:shadow-myblue/50 mb-8 sm:mb-0"
          >
            View Hacks
          </Link>
          <Link
            href="/posts/new"
            className="px-4 py-2 bg-mygrey text-myblack font-semibold text-3xl rounded-full hover:bg-myblue hover:shadow-lg hover:shadow-myblue/50"
          >
            Post Hack
          </Link>
        </div>
      </div>
    </div>
  );
}
