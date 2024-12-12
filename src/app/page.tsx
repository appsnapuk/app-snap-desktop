'use client'
import './globals.css'
import { useState } from 'react'
import Header from './components/Header'
import ProductGrid from './components/ProductGrid'
import Cart from './components/Cart'
import CategoryMenu from './components/CategoryMenu'
import { CartProvider } from './contexts/CartContext'
import { GET_PRODUCTS, GET_CATEGORIES, useQuery } from '../lib/apollo-client'


export default function Home() {
    const [selectedCategory, setSelectedCategory] = useState("All")
    const { loading: productsLoading, error: productsError, data: productsData } = useQuery(GET_PRODUCTS)
    const { loading: categoriesLoading, error: categoriesError, data: categoriesData } = useQuery(GET_CATEGORIES)

    if (productsLoading || categoriesLoading) return <div>Loading...</div>
    if (productsError) return <div>Error Products: {productsError.message}</div>
    if (categoriesError) return <div>Error Catagorys: {categoriesError.message}</div>

    const products = productsData.products
    const categories = categoriesData.categories

    return (
        <CartProvider>
            <main className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex">
                    <CategoryMenu
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                    />
                    <ProductGrid
                        products={products}
                        selectedCategory={selectedCategory}
                    />
                    <Cart />
                </div>
            </main>
        </CartProvider>
    )
}

