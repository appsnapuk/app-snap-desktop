import ProductItem from './ProductItem'

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  isActive: boolean;
}

interface ProductGridProps {
  products: Product[];
  selectedCategory: string;
}

export default function ProductGrid({ products, selectedCategory }: ProductGridProps) {
  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

