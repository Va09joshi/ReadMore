import Link from "next/link"
import { ArticleCard } from "./ArticleCard"

const articles = [
  {
    id: 4,
    title: "The Return of Analog: Why Print Magazines Are Making a Comeback",
    description: "In an increasingly digital world, readers are finding solace in the tactile experience of high-quality print publications.",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000&auto=format&fit=crop",
    author: "Elena Rodriguez",
    date: "Oct 24",
    readTime: "7 min"
  },
  {
    id: 5,
    title: "Nordic Design Principles for Modern Workspaces",
    description: "How Scandinavian minimalism is reshaping the corporate office to prioritize employee well-being and productivity.",
    category: "Design",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop",
    author: "Marcus Chen",
    date: "Oct 24",
    readTime: "5 min"
  },
  {
    id: 6,
    title: "Kyoto's Hidden Culinary Masters",
    description: "Beyond the tourist trails, a new generation of chefs is quietly reinventing traditional kaiseki cuisine.",
    category: "Travel",
    image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=1000&auto=format&fit=crop",
    author: "Kenji Sato",
    date: "Oct 23",
    readTime: "8 min"
  }
]

export function NewsGrid() {
  return (
    <section className="border-b border-border">
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        {/* Section Heading */}
        <div className="mb-8 border-b border-border pb-4">
          <h2 className="font-serif text-2xl font-bold tracking-tight">Latest Dispatches</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 divide-y md:divide-y-0 md:divide-x divide-border">
          {articles.map((article, index) => (
            <div key={article.id} className={index !== 0 ? "pt-8 md:pt-0 md:pl-8" : ""}>
              <ArticleCard {...article} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
