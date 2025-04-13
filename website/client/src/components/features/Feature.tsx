import Image from "next/image";

type ContentType = {
  title: string;
  content1: string;
  content2: string;
  img: any;
  idx: number
};

export default function ContentSection({
  title,
  content1,
  content2,
  img,
  idx
}: ContentType) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className={`grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24`}>
          <div className={`relative mb-6 sm:mb-0 ${idx%2 != 0 ? "sm:order-2" : ""}`}>
            <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
              <Image
                src={img}
                className="hidden object-cover w-full rounded-[15px] dark:block"
                alt="payments illustration dark"
                width={1207}
                height={929}
              />
              <Image
                src={img}
                className="rounded-[15px] object-cover w-full shadow dark:hidden"
                alt="payments illustration light"
                width={1207}
                height={929}
              />
            </div>
          </div>

          <div className={`relative space-y-4 ${idx%2 != 0 ? "sm:order-1" : ""}`}>
            <h2 className="text-2xl font-semibold" >{title}</h2>
            <p className="text-muted-foreground">{content1}</p>

            <div className="pt-6">
              <blockquote className="border-l-4 pl-4">
                <p>{content2}</p>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
