"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Globe, RefreshCw, TrendingUp, TrendingDown, ChevronDown, ChevronUp, TestTube } from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Line, LineChart } from "recharts"
import Link from "next/link"

import { getETFData, transformAlphaVantageData, US_ETFS, EUROPEAN_ETFS } from "@/lib/alpha-vantage"

const generateDateRange = (startYear: number, endYear: number, period: string) => {
  const dates = []
  const currentYear = new Date().getFullYear()
  const actualEndYear = Math.min(endYear, currentYear)

  switch (period) {
    case "5min":
      // Generate 5-minute intervals for current trading day (9:30 AM to 4:00 PM)
      const startHour = 9
      const startMinute = 30
      const endHour = 16
      const endMinute = 0

      for (let hour = startHour; hour <= endHour; hour++) {
        const startMin = hour === startHour ? startMinute : 0
        const endMin = hour === endHour ? endMinute : 55

        for (let minute = startMin; minute <= endMin; minute += 5) {
          if (hour === endHour && minute > 0) break
          const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
          dates.push(timeStr)
        }
      }
      break
    case "1D":
      // Generate hourly data for current day
      for (let hour = 9; hour <= 16; hour++) {
        dates.push(`${hour}:${hour === 9 ? "30" : "00"}`)
      }
      break
    case "1W":
      // Generate daily data for current week
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
      dates.push(...days)
      break
    case "1M":
      // Generate weekly data for current month
      for (let week = 1; week <= 4; week++) {
        dates.push(`Week ${week}`)
      }
      break
    case "3M":
      // Generate monthly data for 3 months
      for (let month = 1; month <= 3; month++) {
        dates.push(`Month ${month}`)
      }
      break
    case "1Y":
      // Generate quarterly data
      const quarters = ["Q1", "Q2", "Q3", "Q4"]
      dates.push(...quarters)
      break
    case "2Y":
      // Generate yearly data for 2 years
      for (let year = actualEndYear - 1; year <= actualEndYear; year++) {
        dates.push(year.toString())
      }
      break
    case "5Y":
      // Generate yearly data for 5 years
      for (let year = Math.max(startYear, actualEndYear - 4); year <= actualEndYear; year++) {
        dates.push(year.toString())
      }
      break
    default:
      dates.push("Current")
  }

  return dates
}

const mockETFData = [
  {
    symbol: "SPY",
    name: "SPDR S&P 500 ETF Trust",
    price: 445.67,
    change: 2.34,
    changePercent: 0.53,
    volume: "45.2M",
    marketCap: "$412.8B",
    expense: "0.09%",
    region: "US",
    category: "Large Cap Blend",
    topHoldings: [
      "Apple Inc. (7.1%)",
      "Microsoft Corp. (6.8%)",
      "Amazon.com Inc. (3.4%)",
      "NVIDIA Corp. (3.1%)",
      "Alphabet Inc. (2.9%)",
    ],
    sectorAllocation: [
      { sector: "Technology", percentage: 28.5 },
      { sector: "Healthcare", percentage: 13.2 },
      { sector: "Financials", percentage: 12.8 },
      { sector: "Consumer Discretionary", percentage: 10.4 },
      { sector: "Communication", percentage: 8.9 },
      { sector: "Industrials", percentage: 8.1 },
      { sector: "Other", percentage: 18.1 },
    ],
    chartData: {
      "5min": generateDateRange(1990, 2024, "5min").map((time, i) => ({
        time,
        price: 445.67 + Math.sin(i * 0.1) * 2 + (Math.random() - 0.5) * 0.5,
      })),
      "1D": generateDateRange(1990, 2024, "1D").map((time, i) => ({ time, price: 443.33 + i * 0.5 })),
      "1W": generateDateRange(1990, 2024, "1W").map((time, i) => ({ time, price: 440.12 + i * 1.2 })),
      "1M": generateDateRange(1990, 2024, "1M").map((time, i) => ({ time, price: 435.23 + i * 2.8 })),
      "3M": generateDateRange(1990, 2024, "3M").map((time, i) => ({ time, price: 425.34 + i * 6.8 })),
      "1Y": generateDateRange(1990, 2024, "1Y").map((time, i) => ({ time, price: 395.23 + i * 12.6 })),
      "2Y": generateDateRange(1990, 2024, "2Y").map((time, i) => ({ time, price: 365.45 + i * 40.1 })),
      "5Y": generateDateRange(1990, 2024, "5Y").map((time, i) => ({ time, price: 285.34 + i * 32.1 })),
    },
    performance: {
      "5min": 0.12,
      "1D": 0.53,
      "1W": 1.24,
      "1M": 2.41,
      "3M": 4.78,
      "1Y": 12.75,
      "2Y": 21.94,
      "5Y": 56.12,
    },
  },
  {
    symbol: "VOO",
    name: "Vanguard S&P 500 ETF",
    price: 408.23,
    change: 2.15,
    changePercent: 0.53,
    volume: "28.7M",
    marketCap: "$385.2B",
    expense: "0.03%",
    region: "US",
    category: "Large Cap Blend",
    topHoldings: [
      "Apple Inc. (7.1%)",
      "Microsoft Corp. (6.8%)",
      "Amazon.com Inc. (3.4%)",
      "NVIDIA Corp. (3.1%)",
      "Alphabet Inc. (2.9%)",
    ],
    sectorAllocation: [
      { sector: "Technology", percentage: 28.5 },
      { sector: "Healthcare", percentage: 13.2 },
      { sector: "Financials", percentage: 12.8 },
      { sector: "Consumer Discretionary", percentage: 10.4 },
      { sector: "Communication", percentage: 8.9 },
      { sector: "Industrials", percentage: 8.1 },
      { sector: "Other", percentage: 18.1 },
    ],
    chartData: {
      "5min": generateDateRange(1990, 2024, "5min").map((time, i) => ({
        time,
        price: 408.23 + Math.sin(i * 0.1) * 1.8 + (Math.random() - 0.5) * 0.4,
      })),
      "1D": generateDateRange(1990, 2024, "1D").map((time, i) => ({ time, price: 406.08 + i * 0.5 })),
      "1W": generateDateRange(1990, 2024, "1W").map((time, i) => ({ time, price: 404.12 + i * 1.2 })),
      "1M": generateDateRange(1990, 2024, "1M").map((time, i) => ({ time, price: 403.23 + i * 2.8 })),
      "3M": generateDateRange(1990, 2024, "3M").map((time, i) => ({ time, price: 402.34 + i * 6.8 })),
      "1Y": generateDateRange(1990, 2024, "1Y").map((time, i) => ({ time, price: 394.12 + i * 12.6 })),
      "2Y": generateDateRange(1990, 2024, "2Y").map((time, i) => ({ time, price: 393.23 + i * 40.1 })),
      "5Y": generateDateRange(1990, 2024, "5Y").map((time, i) => ({ time, price: 382.34 + i * 32.1 })),
    },
    performance: {
      "5min": 0.11,
      "1D": 0.53,
      "1W": 1.24,
      "1M": 2.41,
      "3M": 4.78,
      "1Y": 12.75,
      "2Y": 21.94,
      "5Y": 56.12,
    },
  },
  {
    symbol: "IVV",
    name: "iShares Core S&P 500 ETF",
    price: 445.89,
    change: 2.36,
    changePercent: 0.53,
    volume: "15.3M",
    marketCap: "$398.7B",
    expense: "0.03%",
    region: "US",
    category: "Large Cap Blend",
    topHoldings: [
      "Apple Inc. (7.1%)",
      "Microsoft Corp. (6.8%)",
      "Amazon.com Inc. (3.4%)",
      "NVIDIA Corp. (3.1%)",
      "Alphabet Inc. (2.9%)",
    ],
    sectorAllocation: [
      { sector: "Technology", percentage: 28.5 },
      { sector: "Healthcare", percentage: 13.2 },
      { sector: "Financials", percentage: 12.8 },
      { sector: "Consumer Discretionary", percentage: 10.4 },
      { sector: "Communication", percentage: 8.9 },
      { sector: "Industrials", percentage: 8.1 },
      { sector: "Other", percentage: 18.1 },
    ],
    chartData: {
      "5min": generateDateRange(1990, 2024, "5min").map((time, i) => ({
        time,
        price: 445.89 + Math.sin(i * 0.1) * 2.1 + (Math.random() - 0.5) * 0.6,
      })),
      "1D": generateDateRange(1990, 2024, "1D").map((time, i) => ({ time, price: 443.53 + i * 0.5 })),
      "1W": generateDateRange(1990, 2024, "1W").map((time, i) => ({ time, price: 442.53 + i * 1.2 })),
      "1M": generateDateRange(1990, 2024, "1M").map((time, i) => ({ time, price: 441.23 + i * 2.8 })),
      "3M": generateDateRange(1990, 2024, "3M").map((time, i) => ({ time, price: 440.34 + i * 6.8 })),
      "1Y": generateDateRange(1990, 2024, "1Y").map((time, i) => ({ time, price: 439.23 + i * 12.6 })),
      "2Y": generateDateRange(1990, 2024, "2Y").map((time, i) => ({ time, price: 438.23 + i * 40.1 })),
      "5Y": generateDateRange(1990, 2024, "5Y").map((time, i) => ({ time, price: 428.23 + i * 32.1 })),
    },
    performance: {
      "5min": 0.13,
      "1D": 0.53,
      "1W": 1.24,
      "1M": 2.41,
      "3M": 4.78,
      "1Y": 12.75,
      "2Y": 21.94,
      "5Y": 56.12,
    },
  },
  {
    symbol: "VTI",
    name: "Vanguard Total Stock Market ETF",
    price: 267.89,
    change: 1.78,
    changePercent: 0.67,
    volume: "18.3M",
    marketCap: "$341.2B",
    expense: "0.03%",
    region: "US",
    category: "Total Market",
    topHoldings: [
      "Apple Inc. (6.1%)",
      "Microsoft Corp. (5.8%)",
      "Amazon.com Inc. (2.9%)",
      "NVIDIA Corp. (2.7%)",
      "Alphabet Inc. (2.5%)",
    ],
    sectorAllocation: [
      { sector: "Technology", percentage: 26.8 },
      { sector: "Healthcare", percentage: 13.5 },
      { sector: "Financials", percentage: 13.1 },
      { sector: "Consumer Discretionary", percentage: 10.8 },
      { sector: "Communication", percentage: 8.2 },
      { sector: "Industrials", percentage: 8.9 },
      { sector: "Other", percentage: 18.7 },
    ],
    chartData: {
      "5min": generateDateRange(1990, 2024, "5min").map((time, i) => ({
        time,
        price: 267.89 + Math.sin(i * 0.1) * 1.5 + (Math.random() - 0.5) * 0.3,
      })),
      "1D": generateDateRange(1990, 2024, "1D").map((time, i) => ({ time, price: 266.11 + i * 0.5 })),
      "1W": generateDateRange(1990, 2024, "1W").map((time, i) => ({ time, price: 265.11 + i * 1.2 })),
      "1M": generateDateRange(1990, 2024, "1M").map((time, i) => ({ time, price: 264.11 + i * 2.8 })),
      "3M": generateDateRange(1990, 2024, "3M").map((time, i) => ({ time, price: 263.11 + i * 6.8 })),
      "1Y": generateDateRange(1990, 2024, "1Y").map((time, i) => ({ time, price: 262.11 + i * 12.6 })),
      "2Y": generateDateRange(1990, 2024, "2Y").map((time, i) => ({ time, price: 261.11 + i * 40.1 })),
      "5Y": generateDateRange(1990, 2024, "5Y").map((time, i) => ({ time, price: 251.11 + i * 32.1 })),
    },
    performance: {
      "5min": 0.15,
      "1D": 0.67,
      "1W": 2.41,
      "1M": 4.78,
      "3M": 12.75,
      "1Y": 21.94,
      "2Y": 56.12,
      "5Y": 89.45,
    },
  },
  {
    symbol: "QQQ",
    name: "Invesco QQQ Trust",
    price: 378.92,
    change: -1.45,
    changePercent: -0.38,
    volume: "32.1M",
    marketCap: "$198.4B",
    expense: "0.20%",
    region: "US",
    category: "Large Cap Growth",
    topHoldings: [
      "Apple Inc. (8.9%)",
      "Microsoft Corp. (8.1%)",
      "NVIDIA Corp. (4.8%)",
      "Amazon.com Inc. (4.2%)",
      "Meta Platforms (3.9%)",
    ],
    sectorAllocation: [
      { sector: "Technology", percentage: 48.2 },
      { sector: "Communication", percentage: 16.8 },
      { sector: "Consumer Discretionary", percentage: 15.4 },
      { sector: "Healthcare", percentage: 6.1 },
      { sector: "Industrials", percentage: 4.8 },
      { sector: "Consumer Staples", percentage: 4.2 },
      { sector: "Other", percentage: 4.5 },
    ],
    chartData: {
      "5min": generateDateRange(1990, 2024, "5min").map((time, i) => ({
        time,
        price: 378.92 + Math.sin(i * 0.1) * -1.2 + (Math.random() - 0.5) * 0.4,
      })),
      "1D": generateDateRange(1990, 2024, "1D").map((time, i) => ({ time, price: 380.37 + i * 0.5 })),
      "1W": generateDateRange(1990, 2024, "1W").map((time, i) => ({ time, price: 379.37 + i * 1.2 })),
      "1M": generateDateRange(1990, 2024, "1M").map((time, i) => ({ time, price: 378.37 + i * 2.8 })),
      "3M": generateDateRange(1990, 2024, "3M").map((time, i) => ({ time, price: 377.37 + i * 6.8 })),
      "1Y": generateDateRange(1990, 2024, "1Y").map((time, i) => ({ time, price: 376.37 + i * 12.6 })),
      "2Y": generateDateRange(1990, 2024, "2Y").map((time, i) => ({ time, price: 375.37 + i * 40.1 })),
      "5Y": generateDateRange(1990, 2024, "5Y").map((time, i) => ({ time, price: 365.37 + i * 32.1 })),
    },
    performance: {
      "5min": -0.08,
      "1D": -0.38,
      "1W": -1.12,
      "1M": -2.41,
      "3M": -4.78,
      "1Y": -12.75,
      "2Y": -21.94,
      "5Y": -56.12,
    },
  },
]

export default function ETFDashboard() {
  const [etfData, setEtfData] = useState(mockETFData)
  const [searchTerm, setSearchTerm] = useState("")
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [expandedETF, setExpandedETF] = useState<string | null>(null)
  const [regionFilter, setRegionFilter] = useState<string>("All")
  const [selectedPeriod, setSelectedPeriod] = useState<string>("1D")
  const [isLoading, setIsLoading] = useState(false)
  const [dateRange, setDateRange] = useState({ start: 1990, end: new Date().getFullYear() })

  const filteredETFs = etfData.filter(
    (etf) =>
      (etf.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        etf.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (regionFilter === "All" || etf.region === regionFilter),
  )

  const comparisonETFs = filteredETFs.slice(0, 5)

  const getUnifiedChartData = () => {
    if (comparisonETFs.length === 0) return []

    const timePoints = generateDateRange(dateRange.start, dateRange.end, selectedPeriod)

    return timePoints.map((time, index) => {
      const dataPoint: any = { time }

      comparisonETFs.forEach((etf) => {
        const etfData = etf.chartData[selectedPeriod]
        if (etfData && etfData[index]) {
          dataPoint[etf.symbol] = etfData[index].price
        }
      })

      return dataPoint
    })
  }

  const refreshData = async () => {
    setIsLoading(true)
    const updatedData = await Promise.all(
      etfData.map(async (etf) => {
        if (US_ETFS.includes(etf.symbol)) {
          try {
            const apiData = await getETFData(etf.symbol)
            if (apiData) {
              const transformedData = transformAlphaVantageData(apiData, selectedPeriod)
              const latestPrice = transformedData[transformedData.length - 1]?.price || etf.price
              const previousPrice = transformedData[transformedData.length - 2]?.price || etf.price
              const change = latestPrice - previousPrice
              const changePercent = (change / previousPrice) * 100

              return {
                ...etf,
                price: latestPrice,
                change: change,
                changePercent: changePercent,
                chartData: {
                  ...etf.chartData,
                  "1D": transformedData,
                },
                isSimulated: false,
              }
            }
          } catch (error) {
            console.error(`Failed to fetch data for ${etf.symbol}:`, error)
          }
        }

        return {
          ...etf,
          price: etf.price + (Math.random() - 0.5) * 2,
          change: etf.change + (Math.random() - 0.5) * 0.5,
          changePercent: etf.changePercent + (Math.random() - 0.5) * 0.2,
          isSimulated: EUROPEAN_ETFS.includes(etf.symbol) || !US_ETFS.includes(etf.symbol),
        }
      }),
    )
    setEtfData(updatedData)
    setLastUpdated(new Date())
    setIsLoading(false)
  }

  const timePeriods = [
    { key: "5min", label: "5min" },
    { key: "1D", label: "1D" },
    { key: "1W", label: "1W" },
    { key: "1M", label: "1M" },
    { key: "3M", label: "3M" },
    { key: "1Y", label: "1Y" },
    { key: "2Y", label: "2Y" },
    { key: "5Y", label: "5Y" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex justify-center gap-4 mb-6">
          <Button variant="default" asChild>
            <Link href="/">
              <TrendingUp className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/api-test">
              <TestTube className="w-4 h-4 mr-2" />
              API Test
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ETF Market Dashboard
          </h1>
          <p className="text-muted-foreground">Real-time tracking of major Exchange-Traded Funds</p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <Button
              onClick={refreshData}
              disabled={isLoading}
              size="sm"
              variant="outline"
              className="glass-card bg-transparent"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Updating..." : "Refresh"}
            </Button>
          </div>
        </div>

        {/* Market Comparison Frame */}
        <Card className="glass-card border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Market Comparison - Top 5 ETFs
            </CardTitle>
            <div className="flex flex-wrap gap-2 items-center">
              {timePeriods.map((period) => (
                <Button
                  key={period.key}
                  variant={selectedPeriod === period.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period.key)}
                  className="text-xs"
                >
                  {period.label}
                </Button>
              ))}
              <div className="flex items-center gap-2 ml-4">
                <span className="text-xs text-muted-foreground">Date Range:</span>
                <Input
                  type="number"
                  min="1990"
                  max={new Date().getFullYear()}
                  value={dateRange.start}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, start: Number.parseInt(e.target.value) }))}
                  className="w-20 h-8 text-xs"
                />
                <span className="text-xs">to</span>
                <Input
                  type="number"
                  min="1990"
                  max={new Date().getFullYear()}
                  value={dateRange.end}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, end: Number.parseInt(e.target.value) }))}
                  className="w-20 h-8 text-xs"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getUnifiedChartData()}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="time" className="text-xs" tick={{ fontSize: 12 }} />
                  <YAxis className="text-xs" tick={{ fontSize: 12 }} domain={["dataMin - 5", "dataMax + 5"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  {comparisonETFs.map((etf, index) => (
                    <Line
                      key={etf.symbol}
                      type="monotone"
                      dataKey={etf.symbol}
                      stroke={etf.changePercent >= 0 ? "#10b981" : "#ef4444"}
                      strokeWidth={2}
                      dot={false}
                      name={etf.symbol}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-5 gap-4 mt-4">
              {comparisonETFs.map((etf) => (
                <div key={etf.symbol} className="text-center space-y-1">
                  <div className="font-semibold text-sm">{etf.symbol}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {etf.name.split(" ").slice(0, 3).join(" ")}
                  </div>
                  <div
                    className={`text-sm font-medium ${etf.changePercent >= 0 ? "text-emerald-600" : "text-red-600"}`}
                  >
                    {etf.performance[selectedPeriod] >= 0 ? "+" : ""}
                    {etf.performance[selectedPeriod].toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter Controls */}
        <Card className="glass-card border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search ETF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-0 shadow-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground mr-2">Region:</span>
                <Button
                  variant={regionFilter === "All" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setRegionFilter("All")}
                  className="smooth-transition"
                >
                  All
                </Button>
                <Button
                  variant={regionFilter === "US" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setRegionFilter("US")}
                  className="smooth-transition"
                >
                  US
                </Button>
                <Button
                  variant={regionFilter === "Europe" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setRegionFilter("Europe")}
                  className="smooth-transition"
                >
                  Europe
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ETF Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredETFs.map((etf) => (
            <Card
              key={etf.symbol}
              className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg font-bold">{etf.symbol}</CardTitle>
                      {etf.isSimulated && (
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
                          Simulated
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{etf.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">${etf.price.toFixed(2)}</div>
                    <div className="flex items-center gap-1">
                      {etf.changePercent >= 0 ? (
                        <div className="flex items-center text-emerald-600">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">{etf.changePercent.toFixed(2)}%</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <TrendingDown className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">{etf.changePercent.toFixed(2)}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mini Chart */}
                <div className="h-24 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={etf.chartData[selectedPeriod]}>
                      <defs>
                        <linearGradient id={`miniGradient-${etf.symbol}`} x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor={etf.changePercent >= 0 ? "#10b981" : "#ef4444"}
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor={etf.changePercent >= 0 ? "#10b981" : "#ef4444"}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke={etf.changePercent >= 0 ? "#10b981" : "#ef4444"}
                        strokeWidth={2}
                        fill={`url(#miniGradient-${etf.symbol})`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Volume:</span>
                    <div className="font-medium">{etf.volume}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Market Cap:</span>
                    <div className="font-medium">{etf.marketCap}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Expense Ratio:</span>
                    <div className="font-medium">{etf.expense}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <div className="font-medium text-xs">{etf.category}</div>
                  </div>
                </div>

                {/* Region Badge */}
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="text-xs">
                    {etf.region}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedETF(expandedETF === etf.symbol ? null : etf.symbol)}
                    className="text-xs"
                  >
                    {expandedETF === etf.symbol ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1" />
                        Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-1" />
                        More
                      </>
                    )}
                  </Button>
                </div>

                {/* Expanded Content */}
                {expandedETF === etf.symbol && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Top Holdings</h4>
                      <div className="space-y-1">
                        {etf.topHoldings.slice(0, 5).map((holding, index) => (
                          <div key={index} className="text-xs text-muted-foreground">
                            {holding}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Sector Allocation</h4>
                      <div className="space-y-2">
                        {etf.sectorAllocation.slice(0, 4).map((sector, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">{sector.sector}</span>
                            <span className="text-xs font-medium">{sector.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
