import React, { useState, useEffect, useRef } from 'react'
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
} from '@mui/material'

const SignalsWidget = ({ refreshInterval = 5000 }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [domainSessionId, setDomainSessionId] = useState(null)
  const intervalRef = useRef(null)

  // Function to extract domain_sessionid from Snowplow cookie
  const extractSessionId = () => {
    try {
      // Look for Snowplow cookies - common patterns are _sp_id.xxxx
      const cookies = document.cookie.split(';')

      for (let cookie of cookies) {
        const trimmedCookie = cookie.trim()

        if (trimmedCookie.startsWith('_sp_biz1_id.')) {
          const cookieValue = trimmedCookie.split('=')[1]
          if (cookieValue) {
            // Snowplow cookie format: userid.timestamp.count.timestamp.sessionid.userid
            // domain_sessionid is at index 5 (6th position)
            const parts = cookieValue.split('.')
            if (parts.length >= 6 && parts[5]) {
              return parts[5]
            }
          }
        }
      }

      // If no Snowplow cookie found, return null
      return null
    } catch (error) {
      console.warn('Error extracting session ID from cookies:', error)
      return null
    }
  }

  useEffect(() => {
    // Extract session ID from cookie on component mount
    setDomainSessionId(extractSessionId())
  }, [])

  // Effect for fetching data when session ID changes or on interval
  useEffect(() => {
    // Don't fetch if we don't have a session ID
    if (!domainSessionId) {
      setError('No session ID available from cookies')
      setLoading(false)
      return
    }

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

        // Fetch real data from Signals API
        const response = await fetch(
          `http://mir.localhost.snowplow.io:3001/api/docs_features?domainSessionId=${domainSessionId}`,
          {
            method: 'GET',
            headers: {
              'ngrok-skip-browser-warning': '69420',
            },
          }
        )

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
          // Convert object to array format and unwrap arrays
          processedData = Object.entries(result).map(([key, value]) => {
            // API returns values wrapped in arrays, so unwrap them
            let unwrappedValue = Array.isArray(value) ? value[0] : value

            return {
              attribute: key,
              value: unwrappedValue,
            }
          })
        } else {
          throw new Error('Invalid data format')
        }

        setData(processedData)
        setLastUpdated(new Date())
        setError(null)
      } catch (err) {
        console.error('❌ SignalsWidget error:', err)
        setError(`Failed to load data: ${err.message}`)
      } finally {
        setLoading(false)
        setIsRefreshing(false)
      }
    }

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Initial fetch
    fetchData()

    // Set up interval for periodic updates
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchData()
      }, refreshInterval)
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [domainSessionId, refreshInterval])

  const formatValue = (attribute, value) => {
    // Handle None/null/empty values
    if (
      value === 'None' ||
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return 'n/a'
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
      page_views: 'Page views this session',
      engaged_time_page_pings: 'Engaged time',
      first_referrer_seen: 'Referrer URL',
      recent_page_1: 'Recent unique pages visited',
      recent_page_2: '',
      recent_page_3: '',
      recent_page_4: '',
      recent_page_5: '',
      browser_name: 'Browser',
      location: 'Location',
    }
    // Return the mapped value, even if it's an empty string
    return labelMap.hasOwnProperty(attribute) ? labelMap[attribute] : attribute
  }

  const processDataForDisplay = (rawData) => {
    const filtered = rawData.filter(
      (item) => item.attribute !== 'domain_sessionid'
    )

    // Find city and country to combine into location
    const cityItem = filtered.find((item) => item.attribute === 'geo_city')
    const countryItem = filtered.find(
      (item) => item.attribute === 'geo_country'
    )

    // Find recent pages to break into separate rows
    const recentPagesItem = filtered.find(
      (item) => item.attribute === 'recent_pages_visited'
    )

    // Remove individual city, country, and recent pages items
    const withoutSpecialItems = filtered.filter(
      (item) =>
        item.attribute !== 'geo_city' &&
        item.attribute !== 'geo_country' &&
        item.attribute !== 'recent_pages_visited'
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

      withoutSpecialItems.push({
        attribute: 'location',
        value: `${cityItem.value}, ${countryName}`,
      })
    }

    // Create separate rows for recent pages (up to 5)
    if (recentPagesItem && Array.isArray(recentPagesItem.value)) {
      // Reverse the array to show most recent first (API returns oldest first)
      const pages = recentPagesItem.value.slice().reverse().slice(0, 5)
      pages.forEach((page, index) => {
        // Convert page to string and check if it's not empty
        const pageString = String(page || '').trim()
        if (pageString) {
          withoutSpecialItems.push({
            attribute: `recent_page_${index + 1}`,
            value: pageString,
          })
        }
      })
    }

    // Define the desired order
    const order = [
      'page_views',
      'engaged_time_page_pings',
      'first_referrer_seen',
      'recent_page_1',
      'recent_page_2',
      'recent_page_3',
      'recent_page_4',
      'recent_page_5',
      'browser_name',
      'location',
    ]

    // Sort items according to the defined order
    return withoutSpecialItems.sort((a, b) => {
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
                    {getDisplayLabel(item.attribute) || ''}
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
