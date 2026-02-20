import {
  IconAlertTriangle,
  IconCircleCheck,
  IconClock,
  IconFileText,
} from '@tabler/icons-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

const stats = [
  {
    title: 'Total Reports',
    value: '128',
    change: '+14 this month',
    icon: IconFileText,
  },
  {
    title: 'Completed',
    value: '94',
    change: '73.4% completion rate',
    icon: IconCircleCheck,
  },
  {
    title: 'Pending Review',
    value: '22',
    change: '-5 from last week',
    icon: IconClock,
  },
  {
    title: 'Overdue',
    value: '12',
    change: '+3 this week',
    icon: IconAlertTriangle,
  },
]

const reportVolumeData = [
  { month: 'Jul', generated: 18, reviewed: 14 },
  { month: 'Aug', generated: 22, reviewed: 19 },
  { month: 'Sep', generated: 25, reviewed: 21 },
  { month: 'Oct', generated: 20, reviewed: 18 },
  { month: 'Nov', generated: 28, reviewed: 23 },
  { month: 'Dec', generated: 32, reviewed: 27 },
]

const statusBreakdown = [
  { label: 'Completed', count: 94, percent: 73, color: 'bg-primary' },
  { label: 'In Progress', count: 12, percent: 9, color: 'bg-blue-500' },
  { label: 'Pending Review', count: 22, percent: 17, color: 'bg-yellow-500' },
  { label: 'Overdue', count: 12, percent: 1, color: 'bg-destructive' },
]

const recentReports = [
  {
    name: 'Q4 Financial Summary',
    category: 'Finance',
    status: 'Completed' as const,
    date: '2024-01-15',
    author: 'Sarah Chen',
  },
  {
    name: 'User Growth Analysis',
    category: 'Marketing',
    status: 'In Progress' as const,
    date: '2024-01-14',
    author: 'Mike Johnson',
  },
  {
    name: 'Infrastructure Audit',
    category: 'Engineering',
    status: 'Pending' as const,
    date: '2024-01-13',
    author: 'Alex Rivera',
  },
  {
    name: 'Customer Churn Report',
    category: 'Analytics',
    status: 'Completed' as const,
    date: '2024-01-12',
    author: 'Emma Wilson',
  },
  {
    name: 'Monthly Sales Digest',
    category: 'Sales',
    status: 'Overdue' as const,
    date: '2024-01-10',
    author: 'James Park',
  },
  {
    name: 'Security Compliance',
    category: 'Engineering',
    status: 'Completed' as const,
    date: '2024-01-09',
    author: 'Priya Patel',
  },
  {
    name: 'Marketing ROI Review',
    category: 'Marketing',
    status: 'Pending' as const,
    date: '2024-01-08',
    author: 'David Kim',
  },
]

const statusBadgeVariant: Record<
  string,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  Completed: 'default',
  'In Progress': 'secondary',
  Pending: 'outline',
  Overdue: 'destructive',
}

export function ReportsTab() {
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
            <CardTitle>Monthly Report Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={reportVolumeData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis
                  dataKey="month"
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
                <Bar
                  dataKey="generated"
                  fill="hsl(var(--chart-1))"
                  radius={[4, 4, 0, 0]}
                  name="Generated"
                />
                <Bar
                  dataKey="reviewed"
                  fill="hsl(var(--chart-2))"
                  radius={[4, 4, 0, 0]}
                  name="Reviewed"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Report Status</CardTitle>
            <CardDescription>Breakdown by current status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {statusBreakdown.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{item.label}</span>
                  <span className="text-muted-foreground">
                    {item.count} ({item.percent}%)
                  </span>
                </div>
                <div className="bg-muted h-2 rounded-full">
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Latest reports across all teams</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Author</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReports.map((report) => (
                <TableRow key={report.name}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>{report.category}</TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant[report.status]}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>{report.author}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
