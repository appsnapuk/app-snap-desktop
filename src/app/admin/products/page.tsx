'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GET_PRODUCTS, GET_CATEGORIES, ADD_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT } from '../../../lib/apollo-client'

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  isActive: boolean;
}

export default function ProductManagement() {
  const { data: productsData, loading: productsLoading, error: productsError } = useQuery(GET_PRODUCTS)
  const { data: categoriesData, loading: categoriesLoading, error: categoriesError } = useQuery(GET_CATEGORIES)
  const [addProduct] = useMutation(ADD_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
  })
  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
  })
  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
  })

  const [newProduct, setNewProduct] = useState({ name: '', price: 0, category: '' })
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

  if (productsLoading || categoriesLoading) return <div>Loading...</div>
  if (productsError) return <div>Error: {productsError.message}</div>
  if (categoriesError) return <div>Error: {categoriesError.message}</div>

  const products = productsData.products.category.flatMap((category: any) => category.items)
  const categories = categoriesData.categories

  const handleAddProduct = async () => {
    await addProduct({ variables: { input: newProduct } })
    setNewProduct({ name: '', price: 0, category: '' })
  }

  const handleUpdateProduct = async () => {
    if (editingProduct) {
      await updateProduct({ variables: { id: editingProduct.id, input: editingProduct } })
      setEditingProduct(null)
    }
  }

  const handleDeleteProduct = async () => {
    if (deletingProduct) {
      await deleteProduct({ variables: { id: deletingProduct.id } })
      setDeletingProduct(null)
    }
  }

  const toggleProductStatus = async (id: string, isActive: boolean) => {
    await updateProduct({ variables: { id, input: { isActive: !isActive } } })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Product Management</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">Add New Product</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAddProduct}>Add Product</Button>
        </DialogContent>
      </Dialog>
      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-price" className="text-right">
                  Price
                </Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">
                  Category
                </Label>
                <Select onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value })} defaultValue={editingProduct.category}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category: any) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <Button onClick={handleUpdateProduct}>Update Product</Button>
        </DialogContent>
      </Dialog>
      <Dialog open={!!deletingProduct} onOpenChange={(open) => !open && setDeletingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this product? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingProduct(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product: Product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>
                <Switch
                  checked={product.isActive}
                  onCheckedChange={() => toggleProductStatus(product.id, product.isActive)}
                />
              </TableCell>
              <TableCell>
                <Button variant="outline" onClick={() => setEditingProduct(product)} className="mr-2">
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => setDeletingProduct(product)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

