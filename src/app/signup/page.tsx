'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Droplets } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/hooks/use-settings';

const USER_DB_KEY = 'waterQualityUsers';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { updateSettings } = useSettings();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Simulate a user database in localStorage
    const users = JSON.parse(localStorage.getItem(USER_DB_KEY) || '{}');

    if (users[email]) {
      toast({
        variant: 'destructive',
        title: 'Account Already Exists',
        description: 'An account with this email already exists. Please log in.',
      });
      return;
    }

    users[email] = { name, email, password };
    localStorage.setItem(USER_DB_KEY, JSON.stringify(users));

    // Update settings with the new profile
    updateSettings({
      profile: { name, email },
    });

    toast({
      title: 'Account Created!',
      description: 'You have been successfully signed up.',
    });

    router.push('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full bg-card">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Droplets className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Alex Doe"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Create an account
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline text-primary">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
