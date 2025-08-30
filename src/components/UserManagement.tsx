"use client"

import { useState, useEffect } from "react"
import { Users, UserPlus, Edit, Trash2, Shield, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface UserData {
  id: string
  name: string
  email: string
  role: "EMPLOYEE" | "ADMIN"
  createdAt: string
  invoiceCount?: number
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "EMPLOYEE" as "EMPLOYEE" | "ADMIN"
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockUsers: UserData[] = [
        {
          id: "1",
          name: "Admin User",
          email: "admin@demo.com",
          role: "ADMIN",
          createdAt: "2024-01-01T00:00:00Z",
          invoiceCount: 0
        },
        {
          id: "2",
          name: "Employee User",
          email: "employee@demo.com",
          role: "EMPLOYEE",
          createdAt: "2024-01-02T00:00:00Z",
          invoiceCount: 45
        },
        {
          id: "3",
          name: "John Smith",
          email: "john@company.com",
          role: "EMPLOYEE",
          createdAt: "2024-01-03T00:00:00Z",
          invoiceCount: 32
        },
        {
          id: "4",
          name: "Jane Doe",
          email: "jane@company.com",
          role: "EMPLOYEE",
          createdAt: "2024-01-04T00:00:00Z",
          invoiceCount: 28
        }
      ]
      
      setUsers(mockUsers)
    } catch (error) {
      toast.error("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const userToAdd: UserData = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: new Date().toISOString(),
        invoiceCount: 0
      }
      
      setUsers(prev => [...prev, userToAdd])
      setNewUser({ name: "", email: "", role: "EMPLOYEE" })
      setIsAddDialogOpen(false)
      toast.success("User added successfully")
    } catch (error) {
      toast.error("Failed to add user")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setUsers(prev => prev.filter(user => user.id !== userId))
      toast.success("User deleted successfully")
    } catch (error) {
      toast.error("Failed to delete user")
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "EMPLOYEE":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  if (loading) {
    return (
      <Card className="premium-card">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p className="text-slate-400 mt-4">Loading users...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-slate-400">Manage system users and their permissions</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="premium-button">
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-morphism border-slate-700/50">
            <DialogHeader>
              <DialogTitle className="text-white">Add New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-slate-300">Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  className="premium-input mt-1"
                  placeholder="Enter user name"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className="premium-input mt-1"
                  placeholder="Enter user email"
                />
              </div>
              
              <div>
                <Label htmlFor="role" className="text-slate-300">Role</Label>
                <Select value={newUser.role} onValueChange={(value: "EMPLOYEE" | "ADMIN") => setNewUser(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger className="premium-input mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-morphism border-slate-700/50">
                    <SelectItem value="EMPLOYEE">Employee</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="glass-button"
                >
                  Cancel
                </Button>
                <Button onClick={handleAddUser} className="premium-button">
                  Add User
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="premium-input pl-10"
        />
        <Users className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="premium-card hover:shadow-premium transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    {user.role === "ADMIN" ? (
                      <Shield className="w-4 h-4 text-purple-400" />
                    ) : (
                      <User className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{user.name}</CardTitle>
                    <p className="text-sm text-slate-400">{user.email}</p>
                  </div>
                </div>
                <Badge className={getRoleColor(user.role)}>
                  {user.role}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Invoices Processed:</span>
                  <span className="text-white font-medium">{user.invoiceCount || 0}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Joined:</span>
                  <span className="text-white">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  {user.role !== "ADMIN" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-slate-400 hover:text-red-400 hover:bg-red-400/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card className="premium-card">
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">No users found</p>
            <p className="text-sm text-slate-500 mt-2">
              Try adjusting your search or add a new user
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}