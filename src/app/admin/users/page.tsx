'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', isActive: true },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Cashier', isActive: true },
  ])
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '' })
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  const addUser = () => {
    setUsers([...users, { ...newUser, id: Date.now().toString(), isActive: true }])
    setNewUser({ name: '', email: '', role: '' })
  }

  const updateUser = () => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? editingUser : u))
      setEditingUser(null)
    }
  }

  const deleteUser = () => {
    if (deletingUser) {
      setUsers(users.filter(u => u.id !== deletingUser.id))
      setDeletingUser(null)
    }
  }

  const toggleUserStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u))
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
          <Button onClick={addUser}>Add User</Button>
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
          <Button onClick={updateUser}>Update User</Button>
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
            <Button variant="destructive" onClick={deleteUser}>Delete</Button>
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
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Switch
                  checked={user.isActive}
                  onCheckedChange={() => toggleUserStatus(user.id)}
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

