<QuickEdit file="app/admin/orders/page.tsx">
Replace the content with:

```tsx
'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Printer } from 'lucide-react'
import { GET_ORDERS, UPDATE_ORDER } from '../../../lib/apollo-client'

interface Order {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
}

export default function OrderManagement() {
  const { data, loading, error } = useQuery(GET_ORDERS)
  const [updateOrder] = useMutation(UPDATE_ORDER, {
    refetchQueries: [{ query: GET_ORDERS }],
  })

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const orders = data.orders

  const handleCancelOrder = async () => {
    if (selectedOrder) {
      await updateOrder({ variables: { id: selectedOrder.id, input: { status: 'Cancelled' } } })
      setSelectedOrder({ ...selectedOrder, status: 'Cancelled' })
      setIsCancelDialogOpen(false)
    }
  }

  const handlePrintReceipt = () => {
    // In a real application, this would trigger a print action
    console.log('Printing receipt for order:', selectedOrder?.id)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Order Management</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order: Order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>${order.total.toFixed(2)}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => setSelectedOrder(order)}>
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Order Details</DialogTitle>
                    </DialogHeader>
                    {selectedOrder && (
                      <div className="grid gap-4 py-4">
                        <div>
                          <strong>Order ID:</strong> {selectedOrder.id}
                        </div>
                        <div>
                          <strong>Customer Name:</strong> {selectedOrder.customerName}
                        </div>
                        <div>
                          <strong>Date:</strong> {selectedOrder.date}
                        </div>
                        <div>
                          <strong>Total:</strong> ${selectedOrder.total.toFixed(2)}
                        </div>
                        <div>
                          <strong>Status:</strong> {selectedOrder.status}
                        </div>
                        <div className="flex justify-between mt-4">
                          <Button onClick={() => setIsCancelDialogOpen(true)} disabled={selectedOrder.status === 'Cancelled'}>
                            Cancel Order
                          </Button>
                          <Button onClick={handlePrintReceipt} variant="outline">
                            <Printer className="mr-2 h-4 w-4" /> Print Receipt
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Cancellation</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to cancel this order? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>No, Keep Order</Button>
            <Button variant="destructive" onClick={handleCancelOrder}>Yes, Cancel Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

