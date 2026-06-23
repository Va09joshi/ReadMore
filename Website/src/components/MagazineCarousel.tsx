"use client"

import * as React from "react"
import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const issues = [
  { id: 1, title: "The Innovation Issue", date: "June 2026", image: "https://images.unsplash.com/photo-1585241936939-f9c4501fc850?q=80&w=1000&auto=format&fit=crop" },
  { id: 2, title: "The Climate Issue", date: "May 2026", image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1000&auto=format&fit=crop" },
  { id: 3, title: "The Tech Issue", date: "April 2026", image: "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?q=80&w=1000&auto=format&fit=crop" },
  { id: 4, title: "The Design Issue", date: "March 2026", image: "https://images.unsplash.com/photo-1512414584143-b9a3e3484950?q=80&w=1000&auto=format&fit=crop" },
  { id: 5, title: "The Money Issue", date: "February 2026", image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=1000&auto=format&fit=crop" },
]

export function MagazineCarousel() {
  return (
    <section className="container mx-auto px-4 py-16 bg-muted/50 rounded-3xl mb-16">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">The Magazine</h2>
          <p className="text-muted-foreground">Dive deep into our award-winning monthly editions.</p>
        </div>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {issues.map((issue) => (
            <CarouselItem key={issue.id} className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/4">
              <div className="p-1">
                <Card className="border-none shadow-none bg-transparent group cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center p-0">
                    <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden mb-4 shadow-md transition-transform duration-500 group-hover:shadow-xl group-hover:-translate-y-2">
                      <Image
                        src={issue.image}
                        alt={issue.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="font-serif font-bold text-lg group-hover:text-primary transition-colors">{issue.title}</h3>
                      <p className="text-sm text-muted-foreground">{issue.date}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="-left-4 lg:-left-12" />
          <CarouselNext className="-right-4 lg:-right-12" />
        </div>
      </Carousel>
    </section>
  )
}
