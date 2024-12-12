'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle the password reset logic
    console.log('Password reset requested for:', email)
    setIsSubmitted(true)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>Enter your email to reset your password.</CardDescription>
        </CardHeader>
        <CardContent>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button className="w-full mt-4" type="submit">Reset Password</Button>
            </form>
          ) : (
            <div className="text-center">
              <p className="mb-4">If an account exists for {email}, you will receive password reset instructions.</p>
              <Button className="w-full" onClick={() => setIsSubmitted(false)}>Send Another Reset Link</Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Link href="/login" className="flex items-center text-sm text-blue-500 hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

