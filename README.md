# Life Hacks

Simple site for posting life hacks and viewing or commenting on posts

## Features

- Posts page displays all posts from database, using TailwindCSS to alternate their design
- Each post displays number of associated comments using count in SQL query
- Users can sort posts by newest or oldest
- Ability to view individual posts on dedicated pages, displaying all associated comments
- Form to add new posts, select input with options pulled from database
- Form to add new comment at bottom of individual post pages
- Ability to edit posts or comments, automatically filling the forms with current data
- Ability to delete posts
- Categories page where users can select a particular category to view
- Individual category paged display all posts associated within that category

## Future considerations

- If I had the time I would like to add the ability to add users, with sign up/login functionality and only allowing users to perform CRUD operations on their own posts/comments.
- Add ability to comment on other comments and have that display appropriately
- Add toastify or some other form of user feedback for actions
- Add more categories and posts

# Reflection

## What requirements did you achieve?

All

## Were there any requirements or goals that you were unable to achieve?

N/A

## If so, what was it that you found difficult about these tasks?

N/A

## What errors or bugs did you encounter while completing your assignment? How did you solve them?

I was unable to get my project to deploy successfully on Vercel and spent a good few hours trying to figure out what was causing it. It would build no problem locally, but refused to work on Vercel. I knew it was a database connection error based on the logs so tried amending my environment variables a few times and spent a long time researching all possible solutions to no avail, so decided to give up and just ask for help the following day. Next morning, as a few others were in the queue for help I thought I'd give it one more try first. Deployed with no issues. So seemingly an issue with Vercel and nothing I did. Frustrating that I wasted a few hours trying to fix a non-existent error, but glad that it worked in the end.

I was also unable to get toastify to work despite spending several hours trying different methods. I found it very frustrating as I really liked how simple and effective it was to use in my previous project. I suspected I could have probably got it working if I had converted a lot of my code to use client, but my understanding is that you want as much of your app as possible to render on the server. Maybe it would've been easier to implement if I try using it from the start instead of after completing everything else. I just uninstalled it again. Hopefully I can get it working in my next project.

## What went really well and what could have gone better?

Overall I like Next, I love how easy it is to interact with the database and manipulate elements without the need for state. I also really like Tailwind. It obviously took some time to learn the appropriate class names to use but it makes it so much easier for me to keep track of what is affecting a component's styling and quickly tweak it without having to scroll through hundreds of lines of a css file. Big fan.

As above, I was really disappointed I couldn't get toastify to work but as I was trying to implement it last it would probably require a lot of work to fix. I decided that since redirects/revalidates are in effect on most successful CRUD actions they should be sufficient enough user feedback for the most part. Not ideal, but certainly better for my sanity.

I still have trouble wrapping my head around the whole client/server component thing and feel I may not have taken the best approach with my app design.
