
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AnalyticsPage = () => {
  // Mock user interaction data
  const userInteractionData = [
    { name: 'Nature', views: 4000, subscriptions: 240 },
    { name: 'Urban', views: 3000, subscriptions: 198 },
    { name: 'Wildlife', views: 2000, subscriptions: 98 },
    { name: 'Abstract', views: 2780, subscriptions: 128 },
    { name: 'Portraits', views: 1890, subscriptions: 80 },
    { name: 'Landscapes', views: 2390, subscriptions: 150 },
    { name: 'Architecture', views: 3490, subscriptions: 210 },
  ];
  
  // Mock time data
  const timeData = [
    { hour: '00:00', users: 20 },
    { hour: '03:00', users: 15 },
    { hour: '06:00', users: 25 },
    { hour: '09:00', users: 120 },
    { hour: '12:00', users: 150 },
    { hour: '15:00', users: 180 },
    { hour: '18:00', users: 200 },
    { hour: '21:00', users: 120 },
  ];
  
  // Mock geographic data
  const geoData = [
    { name: 'USA', value: 400 },
    { name: 'UK', value: 300 },
    { name: 'Canada', value: 200 },
    { name: 'Australia', value: 150 },
    { name: 'Germany', value: 100 },
    { name: 'Others', value: 250 },
  ];
  
  // Mock subscription data
  const subscriptionData = [
    { name: 'Basic Monthly', value: 450 },
    { name: 'Basic Annual', value: 300 },
    { name: 'Pro Monthly', value: 350 },
    { name: 'Pro Annual', value: 250 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  const chartConfig = {
    blue: { color: "#2563eb" },
    green: { color: "#10b981" },
    yellow: { color: "#f59e0b" },
    red: { color: "#ef4444" },
    purple: { color: "#8b5cf6" },
    teal: { color: "#14b8a6" },
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        
        <div className="flex space-x-3">
          <Select defaultValue="30days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">Export Report</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Gallery Interactions</CardTitle>
            <CardDescription>Views and subscriptions by gallery</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={userInteractionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip 
                    content={<ChartTooltipContent />} 
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="views" fill="var(--color-blue)" name="Views" />
                  <Bar dataKey="subscriptions" fill="var(--color-green)" name="Subscriptions" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>User Activity by Time</CardTitle>
            <CardDescription>When users are most active on the platform</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={timeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <ChartTooltip 
                    content={<ChartTooltipContent />} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    name="Active Users"
                    stroke="var(--color-purple)" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Geographic Distribution</CardTitle>
            <CardDescription>Where your users are located</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={geoData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {geoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={<ChartTooltipContent />} 
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Subscription Distribution</CardTitle>
            <CardDescription>Breakdown of active subscription plans</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subscriptionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {subscriptionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={<ChartTooltipContent />} 
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
