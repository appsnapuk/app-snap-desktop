'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Minus, Plus, AlertTriangle, CreditCard, Banknote, Search, UserPlus } from 'lucide-react'
import useCart from '../hooks/useCart'

export default function Cart() {
    const { items, addToCart, removeFromCart, clearCart, updateNotes } = useCart()
    const [isClearCartDialogOpen, setIsClearCartDialogOpen] = useState(false)
    const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false)
    const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false)
    const [isAddCustomerDialogOpen, setIsAddCustomerDialogOpen] = useState(false)
    const [customerSearch, setCustomerSearch] = useState('')
    const [notes, setNotes] = useState('')
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const handleRemoveItem = (productId: string) => {
        removeFromCart(productId)
    }

    const handleClearCart = () => {
        clearCart()
        setIsClearCartDialogOpen(false)
    }

    const handleCheckout = (paymentMethod: 'cash' | 'card') => {
        console.log(`Checkout with ${paymentMethod}`)
        clearCart()
        setIsCheckoutDialogOpen(false)
    }

    const handleCustomerSelection = (action: 'search' | 'create') => {
        if (action === 'search') {
            console.log(`Searching for customer: ${customerSearch}`)
        } else {
            console.log('Creating new customer')
        }
        setIsAddCustomerDialogOpen(false)
        setIsCheckoutDialogOpen(true)
    }

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(e.target.value)
        updateNotes(e.target.value)
    }

    return (
        <Card className="w-96 h-[calc(100vh-4rem)] flex flex-col rounded-tl-none rounded-bl-none rounded-tr-none">
            <CardHeader>
                <CardTitle>Cart</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
                {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center mb-4">
                        <div>
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                                £{item.price.toFixed(2)} x {item.quantity}
                            </p>
                            {item.quantity >= item.number_available && (
                                <p className="text-xs text-yellow-500 flex items-center">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Limited availability ({item.number_available})
                                </p>
                            )}
                        </div>
                        <div className="flex items-center">
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="mx-2">{item.quantity}</span>
                            <Button variant="ghost" size="icon" onClick={() => addToCart(item)}
                                disabled={item.quantity >= item.number_available ? true : false}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
            <div className="px-6 py-2 border-t">
                <Textarea
                    placeholder="Add notes to your order..."
                    value={notes}
                    onChange={handleNotesChange}
                    className="w-full"
                />
            </div>
            <CardFooter className="flex-col items-stretch border-t pt-4">
                <div className="flex justify-between mb-4">
                    <span className="font-semibold">Total:</span>
                    <span className="font-semibold">£{total.toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isClearCartDialogOpen} onOpenChange={setIsClearCartDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="flex-1">Clear Cart</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Clear Cart</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to clear the cart? This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsClearCartDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleClearCart}>Confirm</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex-1">Checkout</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Customer?</DialogTitle>
                                <DialogDescription>
                                    Would you like to add a customer to this order?
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-center gap-4 py-4">
                                <Button onClick={() => {
                                    setIsCustomerDialogOpen(false)
                                    setIsAddCustomerDialogOpen(true)
                                }}>Yes</Button>
                                <Button onClick={() => {
                                    setIsCustomerDialogOpen(false)
                                    setIsCheckoutDialogOpen(true)
                                }}>No</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={isAddCustomerDialogOpen} onOpenChange={setIsAddCustomerDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Search or Create Customer</DialogTitle>
                            </DialogHeader>
                            <div className="flex items-center space-x-2">
                                <Input
                                    placeholder="Search customers..."
                                    value={customerSearch}
                                    onChange={(e) => setCustomerSearch(e.target.value)}
                                />
                                <Button onClick={() => handleCustomerSelection('search')}>
                                    <Search className="h-4 w-4 mr-2" />
                                    Search
                                </Button>
                            </div>
                            <Button onClick={() => handleCustomerSelection('create')}>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Create New Customer
                            </Button>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Select Payment Method</DialogTitle>
                                <DialogDescription>
                                    Choose how you&apos;d like to pay for your order.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 py-4">
                                <Button
                                    onClick={() => handleCheckout('cash')}
                                    className="h-20 text-lg"
                                >
                                    <Banknote className="h-6 w-6 mr-2" />
                                    Cash
                                </Button>
                                <Button
                                    onClick={() => handleCheckout('card')}
                                    className="h-20 text-lg"
                                >
                                    <CreditCard className="h-6 w-6 mr-2" />
                                    Card
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardFooter>
        </Card>
    )
}

