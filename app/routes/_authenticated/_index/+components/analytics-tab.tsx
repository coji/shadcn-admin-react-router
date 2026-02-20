import {
  IconArrowBack,
  IconClock,
  IconEye,
  IconUsers,
} from '@tabler/icons-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

const stats = [
  {
    title: 'Page Views',
    value: '84,232',
    change: '+12.3% from last month',
    icon: IconEye,
  },
  {
    title: 'Unique Visitors',
    value: '24,521',
    change: '+8.1% from last month',
    icon: IconUsers,
  },
  {
    title: 'Bounce Rate',
    value: '42.3%',
    change: '-3.2% from last month',
    icon: IconArrowBack,
  },
  {
    title: 'Avg. Session',
    value: '4m 32s',
    change: '+18s from last month',
    icon: IconClock,
  },
]

const visitorsData = [
  { name: 'Jan', visitors: 4000, pageViews: 8400 },
  { name: 'Feb', visitors: 3200, pageViews: 7200 },
  { name: 'Mar', visitors: 3800, pageViews: 8100 },
  { name: 'Apr', visitors: 4600, pageViews: 9200 },
  { name: 'May', visitors: 5200, pageViews: 10400 },
  { name: 'Jun', visitors: 4800, pageViews: 9800 },
  { name: 'Jul', visitors: 5600, pageViews: 11200 },
  { name: 'Aug', visitors: 5100, pageViews: 10600 },
  { name: 'Sep', visitors: 4400, pageViews: 9000 },
  { name: 'Oct', visitors: 4900, pageViews: 10100 },
  { name: 'Nov', visitors: 5300, pageViews: 10800 },
  { name: 'Dec', visitors: 5800, pageViews: 11600 },
]

const trafficSourcesData = [
  { name: 'Direct', value: 35 },
  { name: 'Organic Search', value: 30 },
  { name: 'Social Media', value: 18 },
  { name: 'Referral', value: 12 },
  { name: 'Email', value: 5 },
]

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

const sessionsByPageData = [
  { page: '/home', thisMonth: 4200, lastMonth: 3800 },
  { page: '/products', thisMonth: 3100, lastMonth: 2900 },
  { page: '/about', thisMonth: 1800, lastMonth: 2100 },
  { page: '/blog', thisMonth: 2400, lastMonth: 2200 },
  { page: '/contact', thisMonth: 1200, lastMonth: 1400 },
  { page: '/pricing', thisMonth: 2800, lastMonth: 2300 },
  { page: '/docs', thisMonth: 3500, lastMonth: 3100 },
]

export function AnalyticsTab() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-muted-foreground text-xs">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Visitors Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={visitorsData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="pageViews"
                  stackId="1"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.2}
                  name="Page Views"
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stackId="2"
                  stroke="hsl(var(--chart-2))"
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.4}
                  name="Visitors"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={trafficSourcesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  label={({
                    name,
                    percent,
                  }: {
                    name?: string
                    percent?: number
                  }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {trafficSourcesData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sessions by Page</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={sessionsByPageData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="page"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="thisMonth"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                name="This Month"
              />
              <Line
                type="monotone"
                dataKey="lastMonth"
                stroke="hsl(var(--chart-4))"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Last Month"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  )
}
