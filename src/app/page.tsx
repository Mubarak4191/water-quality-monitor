import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, BarChart, Bell, Droplets, Thermometer, Waves } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');

const features = [
  {
    icon: <BarChart className="h-8 w-8 text-primary" />,
    title: 'Real-time Dashboard',
    description: 'Instantly view pH, Temperature, TDS, and Turbidity levels with our interactive charts.',
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    title: 'Historical Analysis',
    description: 'Track water quality over time with historical data views for 24H, 7D, and 30D.',
  },
  {
    icon: <Bell className="h-8 w-8 text-primary" />,
    title: 'Smart Alerts',
    description: 'Receive intelligent notifications on the best channel when sensor readings cross your custom thresholds.',
  },
];

const sensorParameters = [
  { icon: <Droplets className="h-6 w-6" />, name: 'pH Level' },
  { icon: <Thermometer className="h-6 w-6" />, name: 'Temperature' },
  { icon: <Waves className="h-6 w-6" />, name: 'Turbidity' },
  { icon: <BarChart className="h-6 w-6" />, name: 'TDS' },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Droplets />
          <span>Water Quality Monitor</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="relative py-20 md:py-32 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-foreground mb-4">
              Pristine Water, Peace of Mind.
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
              Monitor your water quality in real-time. Get smart alerts and detailed insights to ensure your water is always safe and pure.
            </p>
            <Button size="lg" asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
          {heroImage && (
             <div className="absolute inset-0 -z-10 opacity-10 dark:opacity-5">
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                priority
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
              />
            </div>
          )}
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Powerful Features for Total Control</h2>
              <p className="max-w-xl mx-auto text-muted-foreground mt-2">
                Everything you need to stay on top of your water quality.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <Card key={feature.title} className="text-center shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto bg-secondary rounded-full p-3 w-fit mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
                {heroImage && (
                  <Image
                    src={heroImage.imageUrl}
                    alt="Clean water"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-2xl"
                    data-ai-hint={heroImage.imageHint}
                  />
                )}
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">From Sensor to Screen, Instantly.</h2>
              <p className="text-muted-foreground mb-6">
                Our system seamlessly pairs with your ESP32-based sensors via Bluetooth to provide a constant stream of data. We monitor key parameters to give you a complete picture of your water's health.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {sensorParameters.map((param) => (
                  <div key={param.name} className="flex items-center gap-3">
                    <div className="bg-secondary p-2 rounded-md">
                      {param.icon}
                    </div>
                    <span className="font-medium">{param.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Water Quality Monitor. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
