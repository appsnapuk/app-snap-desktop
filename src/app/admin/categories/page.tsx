'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { GET_CATEGORIES, ADD_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY, useQuery, useMutation } from '../../../lib/apollo-client'
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GET_USERS, ADD_USER, UPDATE_USER, DELETE_USER } from '../../../lib/apollo-client'

interface Category {
    id: string;
    name: string;
}

export function CategoryManagement() {
    const { data, loading, error } = useQuery(GET_CATEGORIES)
    const [addCategory] = useMutation(ADD_CATEGORY, {
        refetchQueries: [{ query: GET_CATEGORIES }],
    })
    const [updateCategory] = useMutation(UPDATE_CATEGORY, {
        refetchQueries: [{ query: GET_CATEGORIES }],
    })
    const [deleteCategory] = useMutation(DELETE_CATEGORY, {
        refetchQueries: [{ query: GET_CATEGORIES }],
    })

    const [newCategory, setNewCategory] = useState('')
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>

    const categories = data.categories

    const handleAddCategory = async () => {
        if (newCategory.trim()) {
            await addCategory({ variables: { input: { name: newCategory.trim() } } })
            setNewCategory('')
        }
    }

    const handleUpdateCategory = async () => {
        if (editingCategory && editingCategory.name.trim()) {
            await updateCategory({ variables: { id: editingCategory.id, input: { name: editingCategory.name.trim() } } })
            setEditingCategory(null)
        }
    }

    const handleDeleteCategory = async () => {
        if (deletingCategory) {
            await deleteCategory({ variables: { id: deletingCategory.id } })
            setDeletingCategory(null)
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Category Management</h1>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="mb-4">Add New Category</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <Button onClick={handleAddCategory}>Add Category</Button>
                </DialogContent>
            </Dialog>
            <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                    </DialogHeader>
                    {editingCategory && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-name" className="text-right">
                                    Name
                                </Label>
                                <Input
                                    id="edit-name"
                                    value={editingCategory.name}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                    )}
                    <Button onClick={handleUpdateCategory}>Update Category</Button>
                </DialogContent>
            </Dialog>
            <Dialog open={!!deletingCategory} onOpenChange={(open) => !open && setDeletingCategory(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this category? This action cannot be undone.</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeletingCategory(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteCategory}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.map((category: Category) => (
                        <TableRow key={category.id}>
                            <TableCell>{category.name}</TableCell>
                            <TableCell>
                                <Button variant="outline" onClick={() => setEditingCategory(category)} className="mr-2">
                                    Edit
                                </Button>
                                <Button variant="destructive" onClick={() => setDeletingCategory(category)}>
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





interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
}

export function UserManagement() {
    const { data, loading, error } = useQuery(GET_USERS)
    const [addUser] = useMutation(ADD_USER, {
        refetchQueries: [{ query: GET_USERS }],
    })
    const [updateUser] = useMutation(UPDATE_USER, {
        refetchQueries: [{ query: GET_USERS }],
    })
    const [deleteUser] = useMutation(DELETE_USER, {
        refetchQueries: [{ query: GET_USERS }],
    })

    const [newUser, setNewUser] = useState({ name: '', email: '', role: '' })
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [deletingUser, setDeletingUser] = useState<User | null>(null)

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>

    const users = data.users

    const handleAddUser = async () => {
        await addUser({ variables: { input: newUser } })
        setNewUser({ name: '', email: '', role: '' })
    }

    const handleUpdateUser = async () => {
        if (editingUser) {
            await updateUser({ variables: { id: editingUser.id, input: editingUser } })
            setEditingUser(null)
        }
    }

    const handleDeleteUser = async () => {
        if (deletingUser) {
            await deleteUser({ variables: { id: deletingUser.id } })
            setDeletingUser(null)
        }
    }

    const toggleUserStatus = async (id: string, isActive: boolean) => {
        await updateUser({ variables: { id, input: { isActive: !isActive } } })
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">User Management</h1>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="mb-4">Add New User</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                                Role
                            </Label>
                            <Select onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button onClick={handleAddUser}>Add User</Button>
                </DialogContent>
            </Dialog>
            <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                    </DialogHeader>
                    {editingUser && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-name" className="text-right">
                                    Name
                                </Label>
                                <Input
                                    id="edit-name"
                                    value={editingUser.name}
                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-email" className="text-right">
                                    Email
                                </Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={editingUser.email}
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-role" className="text-right">
                                    Role
                                </Label>
                                <Select onValueChange={(value) => setEditingUser({ ...editingUser, role: value })} defaultValue={editingUser.role}>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    <Button onClick={handleUpdateUser}>Update User</Button>
                </DialogContent>
            </Dialog>
            <Dialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this user? This action cannot be undone.</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeletingUser(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteUser}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user: User) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                                <Switch
                                    checked={user.isActive}
                                    onCheckedChange={() => toggleUserStatus(user.id, user.isActive)}
                                />
                            </TableCell>
                            <TableCell>
                                <Button variant="outline" onClick={() => setEditingUser(user)} className="mr-2">
                                    Edit
                                </Button>
                                <Button variant="destructive" onClick={() => setDeletingUser(user)}>
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


export default {
    CategoryManagement,
    UserManagement,
}