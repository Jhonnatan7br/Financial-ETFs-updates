"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, Search, RefreshCw } from "lucide-react"

// Mock ETF data - in a real app, this would come from a financial API
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
    chartData: [
      { time: "9:30", price: 443.33 },
      { time: "10:00", price: 444.12 },
      { time: "10:30", price: 443.89 },
      { time: "11:00", price: 445.23 },
      { time: "11:30", price: 444.78 },
      { time: "12:00", price: 445.67 },
    ],
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
    chartData: [
      { time: "9:30", price: 380.37 },
      { time: "10:00", price: 379.84 },
      { time: "10:30", price: 380.12 },
      { time: "11:00", price: 379.23 },
      { time: "11:30", price: 378.67 },
      { time: "12:00", price: 378.92 },
    ],
  },
  {
    symbol: "IWM",
    name: "iShares Russell 2000 ETF",
    price: 218.45,
    change: 3.21,
    changePercent: 1.49,
    volume: "28.7M",
    marketCap: "$28.9B",
    expense: "0.19%",
    chartData: [
      { time: "9:30", price: 215.24 },
      { time: "10:00", price: 216.78 },
      { time: "10:30", price: 217.12 },
      { time: "11:00", price: 217.89 },
      { time: "11:30", price: 218.23 },
      { time: "12:00", price: 218.45 },
    ],
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
    chartData: [
      { time: "9:30", price: 266.11 },
      { time: "10:00", price: 266.89 },
      { time: "10:30", price: 267.23 },
      { time: "11:00", price: 267.45 },
      { time: "11:30", price: 267.67 },
      { time: "12:00", price: 267.89 },
    ],
  },
  {
    symbol: "EFA",
    name: "iShares MSCI EAFE ETF",
    price: 78.34,
    change: -0.89,
    changePercent: -1.12,
    volume: "12.4M",
    marketCap: "$68.7B",
    expense: "0.32%",
    chartData: [
      { time: "9:30", price: 79.23 },
      { time: "10:00", price: 78.98 },
      { time: "10:30", price: 78.67 },
      { time: "11:00", price: 78.45 },
      { time: "11:30", price: 78.23 },
      { time: "12:00", price: 78.34 },
    ],
  },
  {
    symbol: "EEM",
    name: "iShares MSCI Emerging Markets ETF",
    price: 42.67,
    change: 0.45,
    changePercent: 1.07,
    volume: "35.6M",
    marketCap: "$24.8B",
    expense: "0.68%",
    chartData: [
      { time: "9:30", price: 42.22 },
      { time: "10:00", price: 42.34 },
      { time: "10:30", price: 42.45 },
      { time: "11:00", price: 42.56 },
      { time: "11:30", price: 42.61 },
      { time: "12:00", price: 42.67 },
    ],
  },
]

export default function ETFDashboard() {
  const [etfData, setEtfData] = useState(mockETFData)
  const [searchTerm, setSearchTerm] = useState("")
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const filteredETFs = etfData.filter(
    (etf) =>
      etf.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      etf.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const refreshData = () => {
    // Simulate data refresh with small random changes
    const updatedData = etfData.map((etf) => ({
      ...etf,
      price: etf.price + (Math.random() - 0.5) * 2,
      change: etf.change + (Math.random() - 0.5) * 0.5,
      changePercent: etf.changePercent + (Math.random() - 0.5) * 0.2,
    }))
    setEtfData(updatedData)
    setLastUpdated(new Date())
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold">ETF Tracker</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm opacity-90">Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <Button variant="secondary" size="sm" onClick={refreshData} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Search and Controls */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search ETFs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Badge variant="outline" className="text-sm">
            {filteredETFs.length} ETFs
          </Badge>
        </div>

        {/* ETF Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredETFs.map((etf) => (
            <Card key={etf.symbol} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold">{etf.symbol}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{etf.name}</p>
                  </div>
                  <Badge variant={etf.change >= 0 ? "default" : "destructive"} className="gap-1">
                    {etf.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {etf.changePercent >= 0 ? "+" : ""}
                    {etf.changePercent.toFixed(2)}%
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Price Information */}
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">${etf.price.toFixed(2)}</span>
                    <span className={`text-sm font-medium ${etf.change >= 0 ? "text-accent" : "text-destructive"}`}>
                      {etf.change >= 0 ? "+" : ""}${etf.change.toFixed(2)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Volume:</span>
                      <div className="font-medium">{etf.volume}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expense:</span>
                      <div className="font-medium">{etf.expense}</div>
                    </div>
                  </div>
                </div>

                {/* Mini Chart */}
                <div className="h-24">
                  <ChartContainer
                    config={{
                      price: {
                        label: "Price",
                        color: etf.change >= 0 ? "hsl(var(--accent))" : "hsl(var(--destructive))",
                      },
                    }}
                    className="h-full w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={etf.chartData}>
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke={etf.change >= 0 ? "hsl(var(--accent))" : "hsl(var(--destructive))"}
                          strokeWidth={2}
                          dot={false}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>

                <div className="text-xs text-muted-foreground">Market Cap: {etf.marketCap}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredETFs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No ETFs found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  )
}
