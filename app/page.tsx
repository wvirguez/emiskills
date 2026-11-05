import Hero from "@/components/Hero"
import Partners from "@/components/Partners"
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
      <Partners />
      <Categories />
      <SearchCourses />
      <FeaturedProducts />
      <HowItWorks />
      <AffiliateDisclosure />
      <FinalCTA />
    </>
  )
}