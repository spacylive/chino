"use client"
import { useState } from "react"

const faqs = [
  {
    question: "¿Cuáles son los horarios de atención?",
    answer: "Lunes a sábados de 8:30 a 13:00 y de 17:00 a 20:00. Domingos de 9:00 a 13:00."
  },
  {
    question: "¿Dónde están ubicados?",
    answer: "Av Sucre 2865, Beccar, CP1643."
  },
  {
    question: "¿Tienen servicio de entrega a domicilio?",
    answer: "Sí, para pedidos superiores a $300. El tiempo estimado de entrega es de 45-60 minutos dependiendo de la ubicación."
  },
  {
    question: "¿Cómo puedo registrarme?",
    answer: "Puedes registrarte desde la opción 'Registrarse' en el menú principal."
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer: "Aceptamos efectivo, tarjetas de débito y crédito, y transferencias bancarias."
  }
]

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gradient bg-gradient-to-r from-red-600 via-yellow-400 to-red-700 bg-clip-text text-transparent drop-shadow-lg">Preguntas Frecuentes</h1>
      <div className="space-y-4 max-w-2xl mx-auto">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border rounded-lg shadow-sm bg-white">
            <button
              className="w-full text-left px-6 py-4 font-semibold text-gray-800 focus:outline-none focus:bg-yellow-50 flex justify-between items-center"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              {faq.question}
              <span className="ml-2 text-yellow-500">{openIndex === idx ? "-" : "+"}</span>
            </button>
            {openIndex === idx && (
              <div className="px-6 pb-4 text-gray-700 animate-fade-in">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
