
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Droplets } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card className="mx-auto max-w-sm w-full bg-gray-950/80 backdrop-blur-sm border-gray-800 text-white">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Droplets className="h-8 w-8 text-cyan-400" />
          </div>
          <CardTitle className="text-2xl">Login to Your Account</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your email below to login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="bg-gray-800 border-gray-700 focus:ring-cyan-500"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline text-cyan-400 hover:text-cyan-300"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                className="bg-gray-800 border-gray-700 focus:ring-cyan-500"
              />
            </div>
            <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
              Login
            </Button>
            <Button variant="outline" className="w-full border-cyan-500 text-cyan-400 hover:bg-cyan-900/50 hover:text-cyan-300" asChild>
              <Link href="/dashboard">Continue as Guest</Link>
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline text-cyan-400 hover:text-cyan-300">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
