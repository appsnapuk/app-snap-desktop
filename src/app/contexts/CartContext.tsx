'use client'

import React, { createContext, useState, useContext } from 'react'
import Cart from '../components/Cart';

export interface Product {
    id: string;
    name: string;
    price: number;
    number_available: number;
}

interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    notes: string;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    updateNotes: (notes: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export default CartContext

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [notes, setNotes] = useState('')

    const addToCart = (product: Product) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id)
            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            }
            return [...prevItems, { ...product, quantity: 1 }]
        })
    }

    const removeFromCart = (productId: string) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === productId)
            if (existingItem && existingItem.quantity > 1) {
                return prevItems.map((item) =>
                    item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
                )
            }
            return prevItems.filter((item) => item.id !== productId)
        })
    }

    const clearCart = () => {
        setItems([])
        setNotes('')
    }

    const updateNotes = (newNotes: string) => {
        setNotes(newNotes)
    }

    return (
        <CartContext.Provider value={{ items, notes, addToCart, removeFromCart, clearCart, updateNotes }}>
            {children}
        </CartContext.Provider>
    )
}


