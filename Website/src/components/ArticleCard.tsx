import Image from "next/image"
import Link from "next/link"

interface ArticleProps {
  id: string | number
  title: string
  description?: string
  category: string
  image: string
  author: string
  date: string
  readTime: string
  orientation?: "vertical" | "horizontal"
  featured?: boolean
}

export function ArticleCard({
  id,
  title,
  description,
  category,
  image,
  readTime,
  orientation = "vertical",
  featured = false,
}: ArticleProps) {
  return (
    <Link href={`/article/${id}`} className="block group">
      <div className={`flex ${orientation === "horizontal" ? "flex-row gap-4" : "flex-col gap-2"} h-full`}>
        {/* Photo */}
        <div className={`relative overflow-hidden ${
          orientation === "horizontal" ? "w-1/3 shrink-0 aspect-square" : "w-full aspect-[4/3] mb-2"
        }`}>
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        
        {/* Content */}
        <div className={`flex flex-col ${orientation === "horizontal" ? "justify-center" : ""}`}>
          <div className="font-sans text-[13px] font-bold uppercase tracking-[0.075em] text-foreground mb-1">
            {category}
          </div>
          <h3 className={`font-serif text-foreground group-hover:underline decoration-1 underline-offset-4 ${
            featured 
              ? "text-[28px] md:text-[32px] leading-[1.15] tracking-[-0.02em] mb-3" 
              : "text-[20px] md:text-[24px] leading-[1.2] tracking-[-0.02em] mb-2"
          }`}>
            {title}
          </h3>
          {description && (
            <p className="font-serif text-[16px] leading-[1.38] text-muted-foreground mb-3 line-clamp-3">
              {description}
            </p>
          )}
          <div className="flex items-center gap-1 font-serif text-[13px] text-mute-gray mt-auto">
            <span>&#9632;</span> {/* Small square to mimic Monocle's book/read icon */}
            <span>{readTime} read</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
