export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4 text-gradient bg-gradient-to-r from-red-600 via-yellow-400 to-red-700 bg-clip-text text-transparent drop-shadow-lg">Sobre Nosotros</h1>
      <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
        <img src="/images/dragon4.jpg" alt="Dragón" className="w-48 h-48 object-cover rounded-xl shadow-lg border-4 border-yellow-400 bg-white" />
        <p className="text-lg text-gray-800 max-w-xl">
          Somos <span className="font-bold text-red-700">Supermercado Universo</span>, tu destino para productos de calidad y atención personalizada. Nos especializamos en ofrecer una experiencia única, con productos seleccionados y un ambiente familiar. ¡Gracias por elegirnos!
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img src="/images/Captura%20desde%202025-05-12%2012-49-25.png" alt="Local 1" className="w-full h-64 object-cover rounded-xl shadow-md border-2 border-red-200" />
        <img src="/images/Captura%20desde%202025-05-12%2012-50-45.png" alt="Local 2" className="w-full h-64 object-cover rounded-xl shadow-md border-2 border-yellow-200" />
      </div>
    </main>
  );
}
