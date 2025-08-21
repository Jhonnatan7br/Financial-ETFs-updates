"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Globe, RefreshCw, TrendingUp, TrendingDown, ChevronDown, ChevronUp } from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"

import { getETFData, transformAlphaVantageData, US_ETFS, EUROPEAN_ETFS } from "@/lib/alpha-vantage"

const mockETFData = [
  // US ETFs
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
      "1D": [
        { time: "9:30", price: 443.33 },
        { time: "10:00", price: 444.12 },
        { time: "10:30", price: 443.89 },
        { time: "11:00", price: 445.23 },
        { time: "11:30", price: 444.78 },
        { time: "12:00", price: 445.67 },
        { time: "12:30", price: 446.12 },
        { time: "1:00", price: 445.89 },
      ],
      "1W": [
        { time: "Mon", price: 440.12 },
        { time: "Tue", price: 442.34 },
        { time: "Wed", price: 441.89 },
        { time: "Thu", price: 444.56 },
        { time: "Fri", price: 445.67 },
      ],
      "1M": [
        { time: "Week 1", price: 435.23 },
        { time: "Week 2", price: 438.45 },
        { time: "Week 3", price: 442.12 },
        { time: "Week 4", price: 445.67 },
      ],
      "3M": [
        { time: "Month 1", price: 425.34 },
        { time: "Month 2", price: 435.67 },
        { time: "Month 3", price: 445.67 },
      ],
      "1Y": [
        { time: "Q1", price: 395.23 },
        { time: "Q2", price: 415.45 },
        { time: "Q3", price: 435.12 },
        { time: "Q4", price: 445.67 },
      ],
      "2Y": [
        { time: "2022", price: 365.45 },
        { time: "2023", price: 415.23 },
        { time: "2024", price: 445.67 },
      ],
      "5Y": [
        { time: "2019", price: 285.34 },
        { time: "2020", price: 325.67 },
        { time: "2021", price: 385.12 },
        { time: "2022", price: 365.45 },
        { time: "2023", price: 415.23 },
        { time: "2024", price: 445.67 },
      ],
    },
    performance: {
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
      "1D": [
        { time: "9:30", price: 406.08 },
        { time: "10:00", price: 406.89 },
        { time: "10:30", price: 406.67 },
        { time: "11:00", price: 407.98 },
        { time: "11:30", price: 407.56 },
        { time: "12:00", price: 408.23 },
        { time: "12:30", price: 408.67 },
        { time: "1:00", price: 408.45 },
      ],
      "1W": [
        { time: "Mon", price: 404.12 },
        { time: "Tue", price: 406.34 },
        { time: "Wed", price: 405.89 },
        { time: "Thu", price: 407.56 },
        { time: "Fri", price: 408.23 },
      ],
      "1M": [
        { time: "Week 1", price: 403.23 },
        { time: "Week 2", price: 406.45 },
        { time: "Week 3", price: 405.12 },
        { time: "Week 4", price: 408.23 },
      ],
      "3M": [
        { time: "Month 1", price: 402.34 },
        { time: "Month 2", price: 405.67 },
        { time: "Month 3", price: 408.23 },
      ],
      "1Y": [
        { time: "Q1", price: 394.12 },
        { time: "Q2", price: 404.34 },
        { time: "Q3", price: 405.89 },
        { time: "Q4", price: 408.23 },
      ],
      "2Y": [
        { time: "2022", price: 393.23 },
        { time: "2023", price: 403.45 },
        { time: "2024", price: 408.23 },
      ],
      "5Y": [
        { time: "2019", price: 382.34 },
        { time: "2020", price: 392.45 },
        { time: "2021", price: 402.12 },
        { time: "2022", price: 403.23 },
        { time: "2023", price: 406.45 },
        { time: "2024", price: 408.23 },
      ],
    },
    performance: {
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
      "1D": [
        { time: "9:30", price: 443.53 },
        { time: "10:00", price: 444.34 },
        { time: "10:30", price: 444.12 },
        { time: "11:00", price: 445.45 },
        { time: "11:30", price: 445.01 },
        { time: "12:00", price: 445.89 },
        { time: "12:30", price: 446.34 },
        { time: "1:00", price: 446.12 },
      ],
      "1W": [
        { time: "Mon", price: 442.53 },
        { time: "Tue", price: 444.78 },
        { time: "Wed", price: 444.12 },
        { time: "Thu", price: 445.89 },
        { time: "Fri", price: 446.34 },
      ],
      "1M": [
        { time: "Week 1", price: 441.23 },
        { time: "Week 2", price: 444.45 },
        { time: "Week 3", price: 444.12 },
        { time: "Week 4", price: 446.34 },
      ],
      "3M": [
        { time: "Month 1", price: 440.34 },
        { time: "Month 2", price: 444.67 },
        { time: "Month 3", price: 446.34 },
      ],
      "1Y": [
        { time: "Q1", price: 439.23 },
        { time: "Q2", price: 443.45 },
        { time: "Q3", price: 444.12 },
        { time: "Q4", price: 446.34 },
      ],
      "2Y": [
        { time: "2022", price: 438.23 },
        { time: "2023", price: 443.45 },
        { time: "2024", price: 446.34 },
      ],
      "5Y": [
        { time: "2019", price: 428.23 },
        { time: "2020", price: 433.45 },
        { time: "2021", price: 443.12 },
        { time: "2022", price: 444.23 },
        { time: "2023", price: 444.45 },
        { time: "2024", price: 446.34 },
      ],
    },
    performance: {
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
      "1D": [
        { time: "9:30", price: 266.11 },
        { time: "10:00", price: 266.89 },
        { time: "10:30", price: 267.23 },
        { time: "11:00", price: 267.45 },
        { time: "11:30", price: 267.67 },
        { time: "12:00", price: 267.89 },
        { time: "12:30", price: 268.12 },
        { time: "1:00", price: 267.98 },
      ],
      "1W": [
        { time: "Mon", price: 265.11 },
        { time: "Tue", price: 266.89 },
        { time: "Wed", price: 267.23 },
        { time: "Thu", price: 267.45 },
        { time: "Fri", price: 267.89 },
      ],
      "1M": [
        { time: "Week 1", price: 264.11 },
        { time: "Week 2", price: 266.89 },
        { time: "Week 3", price: 267.23 },
        { time: "Week 4", price: 267.89 },
      ],
      "3M": [
        { time: "Month 1", price: 263.11 },
        { time: "Month 2", price: 266.89 },
        { time: "Month 3", price: 267.89 },
      ],
      "1Y": [
        { time: "Q1", price: 262.11 },
        { time: "Q2", price: 266.89 },
        { time: "Q3", price: 267.23 },
        { time: "Q4", price: 267.89 },
      ],
      "2Y": [
        { time: "2022", price: 261.11 },
        { time: "2023", price: 266.89 },
        { time: "2024", price: 267.89 },
      ],
      "5Y": [
        { time: "2019", price: 251.11 },
        { time: "2020", price: 261.89 },
        { time: "2021", price: 266.23 },
        { time: "2022", price: 266.89 },
        { time: "2023", price: 267.23 },
        { time: "2024", price: 267.89 },
      ],
    },
    performance: {
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
      "1D": [
        { time: "9:30", price: 380.37 },
        { time: "10:00", price: 379.84 },
        { time: "10:30", price: 380.12 },
        { time: "11:00", price: 379.23 },
        { time: "11:30", price: 378.67 },
        { time: "12:00", price: 378.92 },
        { time: "12:30", price: 378.45 },
        { time: "1:00", price: 378.78 },
      ],
      "1W": [
        { time: "Mon", price: 379.37 },
        { time: "Tue", price: 378.84 },
        { time: "Wed", price: 380.12 },
        { time: "Thu", price: 379.23 },
        { time: "Fri", price: 378.67 },
      ],
      "1M": [
        { time: "Week 1", price: 378.37 },
        { time: "Week 2", price: 378.84 },
        { time: "Week 3", price: 380.12 },
        { time: "Week 4", price: 378.67 },
      ],
      "3M": [
        { time: "Month 1", price: 377.37 },
        { time: "Month 2", price: 378.84 },
        { time: "Month 3", price: 378.67 },
      ],
      "1Y": [
        { time: "Q1", price: 376.37 },
        { time: "Q2", price: 378.84 },
        { time: "Q3", price: 380.12 },
        { time: "Q4", price: 378.67 },
      ],
      "2Y": [
        { time: "2022", price: 375.37 },
        { time: "2023", price: 378.84 },
        { time: "2024", price: 378.67 },
      ],
      "5Y": [
        { time: "2019", price: 365.37 },
        { time: "2020", price: 375.84 },
        { time: "2021", price: 378.12 },
        { time: "2022", price: 379.23 },
        { time: "2023", price: 378.67 },
        { time: "2024", price: 378.67 },
      ],
    },
    performance: {
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

  const filteredETFs = etfData.filter(
    (etf) =>
      (etf.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        etf.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (regionFilter === "All" || etf.region === regionFilter),
  )

  const comparisonETFs = filteredETFs.slice(0, 5)

  const refreshData = async () => {
    setIsLoading(true)
    const updatedData = await Promise.all(
      etfData.map(async (etf) => {
        // Check if this is a US ETF that can use real API data
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

        // Fallback to simulated data for European ETFs or API failures
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
            <div className="flex flex-wrap gap-2">
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
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={comparisonETFs[0]?.chartData[selectedPeriod] || []}>
                  <defs>
                    {comparisonETFs.map((etf, index) => (
                      <linearGradient key={etf.symbol} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={etf.changePercent >= 0 ? "#10b981" : "#ef4444"}
                          stopOpacity={0.3}
                        />
                        <stop offset="95%" stopColor={etf.changePercent >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
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
                    <Area
                      key={etf.symbol}
                      type="monotone"
                      dataKey="price"
                      data={etf.chartData[selectedPeriod]}
                      stroke={etf.changePercent >= 0 ? "#10b981" : "#ef4444"}
                      strokeWidth={2}
                      fill={`url(#gradient-${index})`}
                      name={etf.symbol}
                    />
                  ))}
                </AreaChart>
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
                    <AreaChart data={etf.chartData["1D"]}>
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
