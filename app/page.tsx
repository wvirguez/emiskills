import { Suspense } from "react"
import Hero from "@/components/Hero"
import Categories from "@/components/Categories"
import SearchCourses from "@/components/SearchCourses"
import FeaturedProducts from "@/components/FeaturedProducts"
import HowItWorks from "@/components/HowItWorks"
import AffiliateDisclosure from "@/components/AffiliateDisclosure"
import FinalCTA from "@/components/FinalCTA"

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <SearchCourses />
      <Suspense fallback={<section className="h-96 bg-violet-50" aria-hidden="true" />}>
        <FeaturedProducts />
      </Suspense>
      <HowItWorks />
      <AffiliateDisclosure />
      <FinalCTA />
    </>
  )
}