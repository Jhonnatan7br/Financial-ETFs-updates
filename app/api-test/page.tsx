"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Clock, Database, Activity, AlertCircle, ArrowLeft, TrendingUp } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Link from "next/link"
import { getETFData, US_ETFS, EUROPEAN_ETFS } from "@/lib/alpha-vantage"

interface APIResponse {
  data: any
  metadata: {
    symbol: string
    requestTime: number
    responseSize: string
    timestamp: string
    dataPoints: number
    apiFunction: string
    interval?: string
    outputSize?: string
  }
  error?: string
}

export default function APITestPage() {
  const [selectedETF, setSelectedETF] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [apiResponse, setApiResponse] = useState<APIResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [interval, setInterval] = useState<string>("daily")

  const allETFs = [
    ...US_ETFS.map((symbol) => ({ symbol, region: "US", supported: true })),
    ...EUROPEAN_ETFS.map((symbol) => ({ symbol, region: "Europe", supported: false })),
  ]

  const filteredETFs = allETFs.filter((etf) => etf.symbol.toLowerCase().includes(searchTerm.toLowerCase()))

  const prepareChartData = (data: any) => {
    if (!data) return []

    const timeSeries =
      data["Time Series (Daily)"] ||
      data["Time Series (5min)"] ||
      data["Weekly Time Series"] ||
      data["Monthly Time Series"] ||
      {}

    return Object.entries(timeSeries)
      .map(([date, values]: [string, any]) => ({
        date: new Date(date).toLocaleDateString(),
        timestamp: new Date(date).getTime(),
        open: Number.parseFloat(values["1. open"]),
        high: Number.parseFloat(values["2. high"]),
        low: Number.parseFloat(values["3. low"]),
        close: Number.parseFloat(values["4. close"]),
        volume: Number.parseInt(values["5. volume"]),
      }))
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-50) // Show last 50 data points for better visualization
  }

  const testAPI = async () => {
    if (!selectedETF) return

    setIsLoading(true)
    const startTime = Date.now()

    try {
      const data = await getETFData(selectedETF, interval)
      const endTime = Date.now()
      const requestTime = endTime - startTime

      if (data) {
        // Extract metadata from Alpha Vantage response
        const metaData = data["Meta Data"] || {}
        const timeSeries =
          data["Time Series (5min)"] ||
          data["Time Series (Daily)"] ||
          data["Weekly Time Series"] ||
          data["Monthly Time Series"] ||
          {}
        const dataPoints = Object.keys(timeSeries).length
        const responseSize = `${JSON.stringify(data).length} bytes`

        setApiResponse({
          data,
          metadata: {
            symbol: selectedETF,
            requestTime,
            responseSize,
            timestamp: new Date().toISOString(),
            dataPoints,
            apiFunction: metaData["1. Information"] || "Unknown",
            interval: metaData["4. Interval"] || interval,
            outputSize: metaData["5. Output Size"] || "compact",
          },
        })
      } else {
        setApiResponse({
          data: null,
          metadata: {
            symbol: selectedETF,
            requestTime,
            responseSize: "0 bytes",
            timestamp: new Date().toISOString(),
            dataPoints: 0,
            apiFunction: "Failed Request",
          },
          error: "API request failed or returned no data",
        })
      }
    } catch (error) {
      const endTime = Date.now()
      const requestTime = endTime - startTime

      setApiResponse({
        data: null,
        metadata: {
          symbol: selectedETF,
          requestTime,
          responseSize: "0 bytes",
          timestamp: new Date().toISOString(),
          dataPoints: 0,
          apiFunction: "Error",
        },
        error: error instanceof Error ? error.message : "Unknown error occurred",
      })
    }

    setIsLoading(false)
  }

  const formatJSON = (obj: any) => {
    return JSON.stringify(obj, null, 2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Alpha Vantage API Test Console
            </h1>
            <p className="text-muted-foreground">Test and inspect ETF data API responses</p>
          </div>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>

        {/* Controls */}
        <Card className="glass-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-500" />
              API Test Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* ETF Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search ETF</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* ETF Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select ETF</label>
                <Select value={selectedETF} onValueChange={setSelectedETF}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose ETF..." />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredETFs.map((etf) => (
                      <SelectItem key={etf.symbol} value={etf.symbol}>
                        <div className="flex items-center gap-2">
                          <span>{etf.symbol}</span>
                          <Badge variant={etf.supported ? "default" : "secondary"} className="text-xs">
                            {etf.region}
                          </Badge>
                          {!etf.supported && (
                            <Badge variant="outline" className="text-xs">
                              Simulated
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Interval Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Period</label>
                <Select value={interval} onValueChange={setInterval}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5min">5 Minutes</SelectItem>
                    <SelectItem value="daily">Daily (Week)</SelectItem>
                    <SelectItem value="weekly">Weekly (Month)</SelectItem>
                    <SelectItem value="monthly">Monthly (3 Months)</SelectItem>
                    <SelectItem value="daily">Daily (6 Months)</SelectItem>
                    <SelectItem value="weekly">Weekly (Year)</SelectItem>
                    <SelectItem value="monthly">Monthly (2 Years)</SelectItem>
                    <SelectItem value="monthly">Monthly (5 Years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Test Button */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Action</label>
                <Button onClick={testAPI} disabled={!selectedETF || isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Activity className="w-4 h-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4 mr-2" />
                      Test API
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Response */}
        {apiResponse && (
          <div className="space-y-6">
            {/* Chart Visualization */}
            {apiResponse.data && (
              <Card className="glass-card border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Price Chart Visualization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={prepareChartData(apiResponse.data)}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                        <YAxis tick={{ fontSize: 12 }} domain={["dataMin - 1", "dataMax + 1"]} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                            border: "none",
                            borderRadius: "8px",
                            color: "white",
                          }}
                          formatter={(value: any, name: string) => [
                            `$${Number.parseFloat(value).toFixed(2)}`,
                            name.charAt(0).toUpperCase() + name.slice(1),
                          ]}
                        />
                        <Line
                          type="monotone"
                          dataKey="close"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={false}
                          name="Close Price"
                        />
                        <Line
                          type="monotone"
                          dataKey="high"
                          stroke="#3b82f6"
                          strokeWidth={1}
                          strokeDasharray="5 5"
                          dot={false}
                          name="High"
                        />
                        <Line
                          type="monotone"
                          dataKey="low"
                          stroke="#ef4444"
                          strokeWidth={1}
                          strokeDasharray="5 5"
                          dot={false}
                          name="Low"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Metadata */}
              <Card className="glass-card border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-500" />
                    Response Metadata
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Symbol:</span>
                      <Badge variant="outline">{apiResponse.metadata.symbol}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Request Time:</span>
                      <span className="text-sm font-medium">{apiResponse.metadata.requestTime}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Response Size:</span>
                      <span className="text-sm font-medium">{apiResponse.metadata.responseSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Data Points:</span>
                      <span className="text-sm font-medium">{apiResponse.metadata.dataPoints}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">API Function:</span>
                      <span className="text-sm font-medium text-right max-w-32 truncate">
                        {apiResponse.metadata.apiFunction}
                      </span>
                    </div>
                    {apiResponse.metadata.interval && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Interval:</span>
                        <span className="text-sm font-medium">{apiResponse.metadata.interval}</span>
                      </div>
                    )}
                    {apiResponse.metadata.outputSize && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Output Size:</span>
                        <span className="text-sm font-medium">{apiResponse.metadata.outputSize}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Timestamp:</span>
                      <span className="text-sm font-medium">
                        {new Date(apiResponse.metadata.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  {apiResponse.error && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Error</span>
                      </div>
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{apiResponse.error}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Raw Response */}
              <Card className="lg:col-span-2 glass-card border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-500" />
                    Raw API Response
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 max-h-96 overflow-auto">
                    <pre className="text-xs font-mono whitespace-pre-wrap">
                      {apiResponse.data ? formatJSON(apiResponse.data) : "No data received"}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* API Information */}
        <Card className="glass-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle>API Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Supported US ETFs (Real Data)</h4>
                <div className="flex flex-wrap gap-2">
                  {US_ETFS.map((symbol) => (
                    <Badge key={symbol} variant="default" className="text-xs">
                      {symbol}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">European ETFs (Simulated Data)</h4>
                <div className="flex flex-wrap gap-2">
                  {EUROPEAN_ETFS.map((symbol) => (
                    <Badge key={symbol} variant="secondary" className="text-xs">
                      {symbol}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>
                <strong>Note:</strong> US ETFs use real-time data from Alpha Vantage API. European ETFs use simulated
                data as they are not supported by the current API configuration.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
