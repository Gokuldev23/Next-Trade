import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card";

export default function JournalPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Journal</h2>
      <Card>
        <CardHeader>
          <CardTitle>Trade Journal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
