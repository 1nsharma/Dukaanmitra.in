import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function InsightsPage() {
  return (
    <div className="container py-16 md:py-24">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
            Insights Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Welcome to the Insights Hub. This is where you'll find the latest analysis and trends for Bharat retail.
          </p>
          <p className="mt-4">
            This page is currently under construction.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
