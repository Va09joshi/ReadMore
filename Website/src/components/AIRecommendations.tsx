import { Sparkles } from "lucide-react"
import { ArticleCard } from "./ArticleCard"

const recommendedArticles = [
  {
    id: 101,
    title: "Understanding the New Tax Code Changes",
    category: "Finance",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop",
    author: "James Wilson",
    date: "Jun 21, 2026",
    readTime: "7 min read"
  },
  {
    id: 102,
    title: "Top 10 Destinations for Sustainable Travel",
    category: "Travel",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop",
    author: "Elena Rodriguez",
    date: "Jun 20, 2026",
    readTime: "5 min read"
  },
  {
    id: 103,
    title: "How to Build a Resilient Investment Portfolio",
    category: "Business",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1000&auto=format&fit=crop",
    author: "Michael Chang",
    date: "Jun 19, 2026",
    readTime: "8 min read"
  }
]

export function AIRecommendations() {
  return (
    <section className="container mx-auto px-4 py-12 border-t">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primary/10 rounded-full text-primary">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-bold">Recommended for You</h2>
          <p className="text-sm text-muted-foreground">Curated by our AI based on your reading history.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendedArticles.map((article) => (
          <ArticleCard key={article.id} {...article} />
        ))}
      </div>
    </section>
  )
}
