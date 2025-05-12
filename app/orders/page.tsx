import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const mockOrders = [
  { id: "001", date: "2025-05-10", status: "Entregado", total: "$8.500" },
  { id: "002", date: "2025-04-28", status: "En camino", total: "$3.200" },
  { id: "003", date: "2025-04-15", status: "Cancelado", total: "$1.500" },
]

export default function OrdersPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">Mis Pedidos</h1>
      <Card>
        <CardHeader>
          <CardTitle>Historial de pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">N° Pedido</th>
                <th className="py-2 text-left">Fecha</th>
                <th className="py-2 text-left">Estado</th>
                <th className="py-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map(order => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="py-2">{order.id}</td>
                  <td className="py-2">{order.date}</td>
                  <td className="py-2">{order.status}</td>
                  <td className="py-2">{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </main>
  )
}
