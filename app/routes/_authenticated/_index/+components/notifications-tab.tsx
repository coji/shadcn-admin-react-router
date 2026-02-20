import {
  IconArchive,
  IconBell,
  IconCheck,
  IconMailOpened,
  IconUrgent,
} from '@tabler/icons-react'
import { useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'

const stats = [
  {
    title: 'Total',
    value: '42',
    change: '12 new today',
    icon: IconBell,
  },
  {
    title: 'Unread',
    value: '18',
    change: '43% unread',
    icon: IconMailOpened,
  },
  {
    title: 'Urgent',
    value: '3',
    change: 'Requires attention',
    icon: IconUrgent,
  },
  {
    title: 'Archived',
    value: '156',
    change: 'Last 30 days',
    icon: IconArchive,
  },
]

type NotificationType = 'info' | 'warning' | 'success' | 'error'

interface Notification {
  id: string
  type: NotificationType
  title: string
  description: string
  timestamp: string
}

const notifications: Notification[] = [
  {
    id: '1',
    type: 'info',
    title: 'New user registered',
    description: 'john.doe@email.com has created an account.',
    timestamp: '2 minutes ago',
  },
  {
    id: '2',
    type: 'warning',
    title: 'High memory usage',
    description: 'Server memory usage exceeded 85% threshold.',
    timestamp: '15 minutes ago',
  },
  {
    id: '3',
    type: 'error',
    title: 'Payment failed',
    description: 'Transaction #TXN-4892 failed to process.',
    timestamp: '1 hour ago',
  },
  {
    id: '4',
    type: 'success',
    title: 'Deployment complete',
    description: 'v2.4.1 deployed to production successfully.',
    timestamp: '2 hours ago',
  },
  {
    id: '5',
    type: 'info',
    title: 'Report generated',
    description: 'Monthly analytics report is ready for review.',
    timestamp: '3 hours ago',
  },
  {
    id: '6',
    type: 'warning',
    title: 'SSL certificate expiring',
    description: 'Certificate for api.example.com expires in 7 days.',
    timestamp: '5 hours ago',
  },
  {
    id: '7',
    type: 'success',
    title: 'Backup completed',
    description: 'Database backup completed successfully (2.4 GB).',
    timestamp: '6 hours ago',
  },
  {
    id: '8',
    type: 'error',
    title: 'API rate limit exceeded',
    description: 'External API calls exceeded the daily quota.',
    timestamp: '8 hours ago',
  },
  {
    id: '9',
    type: 'info',
    title: 'Team member invited',
    description: 'sarah@company.com was invited to the workspace.',
    timestamp: '12 hours ago',
  },
  {
    id: '10',
    type: 'success',
    title: 'Invoice paid',
    description: 'Invoice #INV-2024-089 has been paid ($4,200).',
    timestamp: '1 day ago',
  },
]

const TYPE_DOT_COLORS: Record<NotificationType, string> = {
  info: 'bg-blue-500',
  warning: 'bg-yellow-500',
  success: 'bg-green-500',
  error: 'bg-red-500',
}

const notificationsByType = [
  { name: 'Info', value: 18, color: '#3b82f6' },
  { name: 'Warning', value: 8, color: '#eab308' },
  { name: 'Success', value: 12, color: '#22c55e' },
  { name: 'Error', value: 4, color: '#ef4444' },
]

const trendsData = [
  { day: 'Mon', info: 5, warning: 2, error: 1 },
  { day: 'Tue', info: 8, warning: 3, error: 0 },
  { day: 'Wed', info: 4, warning: 1, error: 2 },
  { day: 'Thu', info: 6, warning: 4, error: 1 },
  { day: 'Fri', info: 9, warning: 2, error: 3 },
  { day: 'Sat', info: 3, warning: 1, error: 0 },
  { day: 'Sun', info: 2, warning: 0, error: 1 },
]

export function NotificationsTab() {
  const [readIds, setReadIds] = useState<Set<string>>(new Set())

  const markAsRead = (id: string) => {
    setReadIds((prev) => new Set(prev).add(id))
  }

  const markAllAsRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)))
  }

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
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>
                You have {notifications.length - readIds.size} unread
                notifications
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification) => {
                const isRead = readIds.has(notification.id)
                return (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 rounded-lg border p-3 ${isRead ? 'opacity-50' : ''}`}
                  >
                    <div
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${TYPE_DOT_COLORS[notification.type]}`}
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="text-sm leading-none font-medium">
                        {notification.title}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {notification.description}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {notification.timestamp}
                      </p>
                    </div>
                    {!isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <IconCheck className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>By Type</CardTitle>
            <CardDescription>Notification distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={notificationsByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {notificationsByType.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-3">
              {notificationsByType.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-muted-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Trends</CardTitle>
          <CardDescription>Past 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={trendsData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="day"
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
              <Area
                type="monotone"
                dataKey="info"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                name="Info"
              />
              <Area
                type="monotone"
                dataKey="warning"
                stackId="1"
                stroke="#eab308"
                fill="#eab308"
                fillOpacity={0.3}
                name="Warning"
              />
              <Area
                type="monotone"
                dataKey="error"
                stackId="1"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.3}
                name="Error"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  )
}
