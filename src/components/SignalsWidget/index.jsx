import React, { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'

const SignalsWidget = ({
  dataFile = '/data/signals-data.json',
  refreshInterval = 5000,
  title = 'Signals Live Data',
}) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchData = async () => {
    try {
      if (data.length > 0) {
        setIsRefreshing(true)
      } else {
        setLoading(true)
        // Only set lastUpdated on the very first successful load
        if (!lastUpdated) {
          setLastUpdated(new Date())
        }
      }

      const response = await fetch(dataFile)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      // Handle different data formats
      let processedData
      if (Array.isArray(result)) {
        // Expect array of {attribute, value} objects
        processedData = result
      } else if (typeof result === 'object' && result !== null) {
        // Convert object to array format
        processedData = Object.entries(result).map(([key, value]) => ({
          attribute: key,
          value: value,
        }))
      } else {
        throw new Error('Invalid data format')
      }

      setData(processedData)
      // Only set lastUpdated on the very first successful load
      if (!lastUpdated) {
        setLastUpdated(new Date())
      }
      setError(null)
    } catch (err) {
      console.error('SignalsWidget error:', err)
      setError(`Failed to load data: ${err.message}`)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchData()

    // Set up interval for periodic updates
    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        fetchData()
      }, refreshInterval)

      return () => clearInterval(interval)
    }
  }, [dataFile, refreshInterval])

  const formatValue = (attribute, value) => {
    // Handle None/null/empty values
    if (value === "None" || value === null || value === undefined || value === "") {
      return "n/a"
    }

    // Convert page ping counts to approximate seconds (each ping ≈ 10 seconds)
    if (attribute && attribute.toLowerCase().includes('page_ping')) {
      const numericValue = parseInt(value)
      if (!isNaN(numericValue)) {
        const totalSeconds = numericValue * 10
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60
        
        if (minutes > 0) {
          return `${minutes}m ${seconds}s`
        } else {
          return `${seconds}s`
        }
      }
    }

    // Convert 2-letter country codes to full country names
    if (attribute && attribute.toLowerCase().includes('country')) {
      try {
        const displayNames = new Intl.DisplayNames(['en'], { type: 'region' })
        const countryName = displayNames.of(value)
        if (countryName && countryName !== value) {
          return countryName
        }
      } catch (error) {
        // If conversion fails, fall back to original value
        console.warn('Country code conversion failed:', error)
      }
    }

    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value)
    }
    return String(value)
  }

  const getDisplayLabel = (attribute) => {
    const labelMap = {
      'page_views_last_15_min': 'Page views in last 15 minutes',
      'engaged_time_page_pings': 'Engaged time',
      'first_referrer_seen': 'Referrer URL',
      'last_search_term': 'Last search term',
      'browser_name': 'Browser',
      'location': 'Location' // This will be our combined city + country
    }
    return labelMap[attribute] || attribute
  }

  const processDataForDisplay = (rawData) => {
    const filtered = rawData.filter(item => item.attribute !== 'domain_sessionid')
    
    // Find city and country to combine into location
    const cityItem = filtered.find(item => item.attribute === 'geo_city')
    const countryItem = filtered.find(item => item.attribute === 'geo_country')
    
    // Remove individual city and country items
    const withoutGeoItems = filtered.filter(item => 
      item.attribute !== 'geo_city' && item.attribute !== 'geo_country'
    )
    
    // Create combined location if both city and country exist
    if (cityItem && countryItem) {
      const countryName = (() => {
        try {
          const displayNames = new Intl.DisplayNames(['en'], { type: 'region' })
          return displayNames.of(countryItem.value) || countryItem.value
        } catch {
          return countryItem.value
        }
      })()
      
      withoutGeoItems.push({
        attribute: 'location',
        value: `${cityItem.value}, ${countryName}`
      })
    }
    
    // Define the desired order
    const order = [
      'page_views_last_15_min',
      'engaged_time_page_pings', 
      'first_referrer_seen',
      'last_search_term',
      'browser_name',
      'location'
    ]
    
    // Sort items according to the defined order
    return withoutGeoItems.sort((a, b) => {
      const indexA = order.indexOf(a.attribute)
      const indexB = order.indexOf(b.attribute)
      
      // If both items are in the order array, sort by their position
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB
      }
      
      // If only one item is in the order array, prioritize it
      if (indexA !== -1) return -1
      if (indexB !== -1) return 1
      
      // If neither item is in the order array, maintain original order
      return 0
    })
  }

  if (loading && data.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, my: 2 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" py={4}>
          <CircularProgress size={24} sx={{ mr: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Loading signals data...
          </Typography>
        </Box>
      </Paper>
    )
  }

  if (error && data.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, my: 2 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Paper>
    )
  }

  return (
    <Paper elevation={2} sx={{ my: 2, overflow: 'hidden' }}>
      <TableContainer sx={{ pt: 0 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Attribute</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processDataForDisplay(data).map((item, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <TableCell component="th" scope="row">
                  <Typography variant="body2">
                    {getDisplayLabel(item.attribute)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatValue(item.attribute, item.value)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {lastUpdated && (
        <Box
          sx={{
            px: 2,
            py: 1,
            bgcolor: 'grey.50',
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="caption" color="text.secondary">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </Typography>
            {refreshInterval > 0 && (
              <Typography variant="caption" color="text.secondary">
                Updates every {Math.round(refreshInterval / 1000)} seconds
              </Typography>
            )}
          </Box>
        </Box>
      )}

      {error && data.length > 0 && (
        <Alert severity="warning" sx={{ m: 2, mt: 0 }}>
          {error}
        </Alert>
      )}
    </Paper>
  )
}

export default SignalsWidget
