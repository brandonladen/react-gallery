
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Image, CreditCard, Clock } from 'lucide-react';

const AdminDashboardPage = () => {
  // Mock statistics
  const stats = [
    { title: 'Total Users', value: '1,283', icon: <Users className="h-8 w-8 text-blue-500" /> },
    { title: 'Total Galleries', value: '48', icon: <Image className="h-8 w-8 text-green-500" /> },
    { title: 'Active Subscriptions', value: '356', icon: <CreditCard className="h-8 w-8 text-purple-500" /> },
    { title: 'Avg. Session Time', value: '14.2m', icon: <Clock className="h-8 w-8 text-amber-500" /> },
  ];

  return (
    <div className="admin-ui">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest platform activity from users and artists
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="border-b pb-2">User David M. subscribed to "Nature Landscapes" gallery</li>
              <li className="border-b pb-2">Artist Emma W. uploaded 15 new images to "Urban Life"</li>
              <li className="border-b pb-2">User Alex P. viewed "Mountain Views" gallery</li>
              <li className="border-b pb-2">Artist John D. created a new gallery "Ocean Moments"</li>
              <li>Admin updated pricing for "Wildlife" gallery subscription</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="rounded-md bg-muted p-4">
              <h4 className="text-sm font-medium mb-2">Upload New Images</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Add new content to existing galleries or create new collections.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/upload">Go to Upload</Link>
              </Button>
            </div>
            <div className="rounded-md bg-muted p-4">
              <h4 className="text-sm font-medium mb-2">Update Pricing</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Modify subscription pricing for galleries and albums.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/pricing">Manage Pricing</Link>
              </Button>
            </div>
            <div className="rounded-md bg-muted p-4">
              <h4 className="text-sm font-medium mb-2">View Analytics</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Check platform usage statistics and user engagement.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/analytics">View Reports</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
