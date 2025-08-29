const ALPHA_VANTAGE_API_KEY = "YOZE3F9BHYOEVKFC"
const BASE_URL = "https://www.alphavantage.co/query"

interface AlphaVantageResponse {
  "Meta Data": any
  "Time Series (5min)"?: {
    [timestamp: string]: {
      "1. open": string
      "2. high": string
      "3. low": string
      "4. close": string
      "5. volume": string
    }
  }
  "Time Series (Daily)"?: {
    [timestamp: string]: {
      "1. open": string
      "2. high": string
      "3. low": string
      "4. close": string
      "5. volume": string
    }
  }
}

export async function getETFData(symbol: string, interval = "5min"): Promise<any | null> {
  try {
    const functionType = interval === "5min" ? "TIME_SERIES_INTRADAY" : "TIME_SERIES_DAILY_ADJUSTED"
    const params: any = {
      function: functionType,
      symbol: symbol,
      adjusted: "true",
      outputsize: "compact",
      datatype: "json",
      apikey: ALPHA_VANTAGE_API_KEY,
    }

    if (interval === "5min") {
      params.interval = "5min"
    }

    const response = await fetch(`${BASE_URL}?${new URLSearchParams(params)}`)
    const data = await response.json()

    if (data["Error Message"] || data["Note"]) {
      console.warn(`API limit or error for ${symbol}:`, data)
      return null
    }

    return data
  } catch (error) {
    console.error("Error fetching data from Alpha Vantage:", error)
    return null
  }
}

export function transformAlphaVantageData(data: AlphaVantageResponse, timeframe: string) {
  const timeSeries = data["Time Series (5min)"] || data["Time Series (Daily)"] || {}
  const entries = Object.entries(timeSeries)
    .slice(0, timeframe === "5min" ? 78 : 20)
    .reverse()

  return entries.map(([timestamp, values]) => ({
    time:
      timeframe === "5min"
        ? new Date(timestamp).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : new Date(timestamp).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
    price: Number.parseFloat(values["4. close"]),
    high: Number.parseFloat(values["2. high"]),
    low: Number.parseFloat(values["3. low"]),
    open: Number.parseFloat(values["1. open"]),
    volume: Number.parseInt(values["5. volume"]),
  }))
}

// US ETFs that are supported by Alpha Vantage
export const US_ETFS = ["SPY", "VOO", "IVV", "VTI", "QQQ", "VUG", "BND", "AGG", "GLD", "SCHD", "VYM"]

// European ETFs that need simulated data
export const EUROPEAN_ETFS = ["IMEU", "IMAE", "VUSA", "VUAG", "EQQQ", "VWRL", "VWRP"]
