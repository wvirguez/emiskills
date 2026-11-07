import { connection } from "next/server";
import ProductCard from "@/components/ProductCard";
import { getProducts, type ProductDTO } from "@/lib/products";

const FEATURED_COUNT = 6;

async function loadFeatured(): Promise<ProductDTO[]> {
  try {
    const { items } = await getProducts({ pageSize: FEATURED_COUNT });
    return items;
  } catch (error) {
    console.error("No se pudieron cargar los productos destacados", error);
    return [];
  }
}

export default async function FeaturedProducts() {
  // Los datos cambian en la BD: se leen en cada petición, no en el build.
  await connection();
  const products = await loadFeatured();

  return (
    <section id="productos" className="bg-gradient-to-b from-violet-50 to-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Productos{" "}
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
              destacados
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            Los productos más recientes de nuestro catálogo.
          </p>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-gray-600">
            Aún no hay productos disponibles. Vuelve pronto.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
