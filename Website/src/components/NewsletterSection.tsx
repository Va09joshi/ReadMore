import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function NewsletterSection() {
  return (
    <section className="border-b border-border bg-secondary">
      <div className="max-w-[1200px] mx-auto px-4 py-24 flex flex-col items-center">
        
        <div className="w-full max-w-2xl bg-card border border-border p-8 md:p-12 text-center">
          <div className="w-12 h-12 border border-border flex items-center justify-center mx-auto mb-6 bg-background">
            <Mail className="h-5 w-5 text-foreground" />
          </div>
          <h2 className="font-serif text-[32px] leading-tight font-bold tracking-[-0.02em] mb-4">
            The Monocle Minute
          </h2>
          <p className="font-serif text-[16px] leading-[1.38] text-muted-foreground mb-8 max-w-md mx-auto">
            Get the most important global news delivered straight to your inbox. No spam, just signal.
          </p>

          <form className="flex flex-col sm:flex-row max-w-md mx-auto relative border border-border">
            <Input 
              type="email" 
              placeholder="Enter your email address" 
              className="h-12 border-none rounded-none bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 px-4 font-serif"
              required
            />
            <Button 
              type="submit" 
              className="h-12 px-6 rounded-none font-sans font-bold text-[13px] tracking-[0.01em] uppercase border-l border-border bg-foreground text-background hover:bg-foreground/90 transition-none"
            >
              Sign Up
            </Button>
          </form>
          <p className="text-[13px] font-serif text-muted-foreground mt-6">
            By subscribing, you agree to our Terms of Service.
          </p>
        </div>

      </div>
    </section>
  )
}
