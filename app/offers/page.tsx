// Página de ofertas destacadas
import VideoOffers from "@/components/video-offers"

export default function OffersPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section id="ofertas" className="container mx-auto py-12">
        <h1 className="mb-8 text-3xl font-bold text-center text-red-700">Ofertas Destacadas</h1>
        <VideoOffers />
      </section>
    </main>
  )
}
