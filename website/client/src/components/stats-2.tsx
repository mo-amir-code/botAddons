

export default function StatsSection() {
  return (
    <section id="stats" className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
          <h2 className="text-4xl font-semibold lg:text-5xl">
            ChatGPT Manager in numbers
          </h2>
          <p>
            ChatGPT Manager is evolving beyond just an extension—it's becoming a
            complete toolkit that empowers users to organize, search, and
            optimize their AI conversations with ease.
          </p>
        </div>

        <div className="grid gap-12 divide-y *:text-center md:grid-cols-3 md:gap-2 md:divide-x md:divide-y-0">
          <div className="space-y-4">
            <div className="text-5xl font-bold">18+</div>
            <p>Downloads</p>
          </div>
          <div className="space-y-4">
            <div className="text-5xl font-bold">11+</div>
            <p>Users</p>
          </div>
          <div className="space-y-4">
            <div className="text-5xl font-bold">5</div>
            <p>Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
}
