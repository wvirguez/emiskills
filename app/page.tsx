import { Suspense } from "react"
import Hero from "@/components/Hero"
import Benefits from "@/components/Benefits"
import Categories from "@/components/Categories"
import SearchCourses from "@/components/SearchCourses"
import FeaturedProducts from "@/components/FeaturedProducts"
import HowItWorks from "@/components/HowItWorks"
import AffiliateDisclosure from "@/components/AffiliateDisclosure"
import AffiliateNotice from "@/components/AffiliateNotice"
import FinalCTA from "@/components/FinalCTA"
import { parseSearchParams } from "@/lib/search-params"

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>
}) {
  const params = await searchParams
  const { categoria: categoriaActiva } = parseSearchParams(params)

  return (
    <>
      <Hero />
      <Benefits />
      <Categories categoriaActiva={categoriaActiva} />
      <SearchCourses />
      <Suspense fallback={<section className="h-96 bg-violet-50" aria-hidden="true" />}>
        <FeaturedProducts />
      </Suspense>
      <AffiliateNotice />
      <HowItWorks />
      <AffiliateDisclosure />
      <FinalCTA />
    </>
  )
}