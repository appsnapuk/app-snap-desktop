'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import useCart from '../hooks/useCart'

interface Product {
    id: string;
    name: string;
    price: number;
    number_available: number;
}

export default function ProductItem({ product }: { product: Product }) {
    const { addToCart, items } = useCart()
    const cartItem = items.find(item => item.id === product.id)
    const quantityInCart = cartItem ? cartItem.quantity : 0
    const isDisabled = quantityInCart >= product.number_available

    const imageSrc = `https://placehold.co/600x400/white/black/png?text=${product.name}&font=raleway`

    return (
        <Card
            className={`overflow-hidden transition-transform hover:scale-105 ${isDisabled ? 'opacity-50' : 'cursor-pointer'}`}
            onClick={() => !isDisabled && addToCart(product)}
        >
            <CardContent className="p-0">
                <Image
                    src={imageSrc}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="w-full h-40 object-cover"
                />
                <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                    <p className="text-muted-foreground">${product.price.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                        Available: {product.number_available - quantityInCart}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

