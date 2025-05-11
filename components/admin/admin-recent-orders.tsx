import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Smith",
    date: "2023-05-10",
    amount: "$129.99",
    status: "Delivered",
  },
  {
    id: "ORD-002",
    customer: "Sarah Johnson",
    date: "2023-05-09",
    amount: "$79.50",
    status: "Processing",
  },
  {
    id: "ORD-003",
    customer: "Michael Chen",
    date: "2023-05-09",
    amount: "$249.99",
    status: "Shipped",
  },
  {
    id: "ORD-004",
    customer: "Emily Wong",
    date: "2023-05-08",
    amount: "$34.75",
    status: "Delivered",
  },
  {
    id: "ORD-005",
    customer: "David Kim",
    date: "2023-05-08",
    amount: "$189.00",
    status: "Processing",
  },
]

export default function AdminRecentOrders() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>You have {recentOrders.length} orders this week</CardDescription>
          </div>
          <Button variant="outline">View All</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      order.status === "Delivered"
                        ? "border-green-500 text-green-500"
                        : order.status === "Shipped"
                          ? "border-blue-500 text-blue-500"
                          : "border-yellow-500 text-yellow-500"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
