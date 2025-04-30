"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, MapPin, CreditCard, Bell, Lock, LogOut, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useAudio } from "@/components/audio-provider"
import { Breadcrumb } from "@/components/breadcrumb"

export function ProfilePage() {
  const { playSound } = useAudio()
  const [activeTab, setActiveTab] = useState("personal")

  // Mock user data
  const [userData, setUserData] = useState({
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 9876543210",
    address: "123 Main St, Sector 15",
    city: "Gurgaon",
    state: "Haryana",
    pincode: "122001",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    playSound("success")
    // In a real app, this would save the data to the backend
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb />

      <motion.h1 className="text-2xl font-bold mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        My Profile
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center mb-6 pt-4">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                <h2 className="font-semibold">{userData.name}</h2>
                <p className="text-sm text-gray-500">{userData.email}</p>
              </div>

              <nav className="space-y-1">
                <Button
                  variant={activeTab === "personal" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab("personal")
                    playSound("click")
                  }}
                >
                  <User className="h-4 w-4 mr-2" />
                  Personal Info
                </Button>
                <Button
                  variant={activeTab === "addresses" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab("addresses")
                    playSound("click")
                  }}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Addresses
                </Button>
                <Button
                  variant={activeTab === "payment" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab("payment")
                    playSound("click")
                  }}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Methods
                </Button>
                <Button
                  variant={activeTab === "notifications" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab("notifications")
                    playSound("click")
                  }}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <Button
                  variant={activeTab === "security" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab("security")
                    playSound("click")
                  }}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Security
                </Button>
              </nav>

              <div className="mt-6 pt-6 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => playSound("click")}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="md:col-span-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {activeTab === "personal" && (
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" value={userData.name} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" value={userData.email} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" value={userData.phone} onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === "addresses" && (
            <Card>
              <CardHeader>
                <CardTitle>Addresses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">Home</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {userData.address}, {userData.city}, {userData.state} - {userData.pincode}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">{userData.phone}</div>
                          <div className="mt-2">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              Default Address
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => playSound("click")}>
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600" onClick={() => playSound("click")}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Button onClick={() => playSound("click")}>Add New Address</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center mr-3">
                            <CreditCard className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">VISA ending in 4242</div>
                            <div className="text-sm text-gray-500">Expires 12/25</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => playSound("click")}>
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600" onClick={() => playSound("click")}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Button onClick={() => playSound("click")}>Add Payment Method</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Order Updates</div>
                      <div className="text-sm text-gray-500">Receive notifications about your order status</div>
                    </div>
                    <Switch defaultChecked onCheckedChange={() => playSound("click")} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Promotions</div>
                      <div className="text-sm text-gray-500">Receive notifications about offers and discounts</div>
                    </div>
                    <Switch defaultChecked onCheckedChange={() => playSound("click")} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Newsletter</div>
                      <div className="text-sm text-gray-500">Receive our weekly newsletter</div>
                    </div>
                    <Switch onCheckedChange={() => playSound("click")} />
                  </div>

                  <div className="pt-4">
                    <Button onClick={() => playSound("success")}>Save Preferences</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Change Password</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      <Button onClick={() => playSound("click")}>Update Password</Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500">Add an extra layer of security to your account</div>
                      </div>
                      <Switch onCheckedChange={() => playSound("click")} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}
