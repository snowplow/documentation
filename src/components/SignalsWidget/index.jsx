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

// Function to extract domain_sessionid from Snowplow cookie
const extractSessionId = () => {
  try {
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
    // console.warn('Error extracting session ID from cookies:', error)
    return null
  }
}

const transformApiResponse = (apiResponse) => {
  const pageViews = apiResponse.page_views[0]
  const engagedTime = apiResponse.engaged_time_page_pings[0]
  const firstReferrer = apiResponse.first_referrer_seen[0]

  // Get the last 5 pages and reverse the order
  const allPages = apiResponse.recent_pages_visited[0]
  const lastFivePages = allPages.slice(-5).reverse()

  const result = {
    page_views: pageViews,
    engaged_time_page_pings: engagedTime,
    first_referrer_seen: firstReferrer,
  }

  // Add pages as separate properties starting from recent_page_1
  for (let i = 0; i < lastFivePages.length; i++) {
    result[`recent_page_${i + 1}`] = lastFivePages[i]
  }

  return result
}

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
    recent_page_1: 'Recent pages visited',
    recent_page_2: '',
    recent_page_3: '',
    recent_page_4: '',
    recent_page_5: '',
  }
  // Return the mapped value, even if it's an empty string
  return labelMap.hasOwnProperty(attribute) ? labelMap[attribute] : attribute
}

const SignalsWidget = ({ refreshInterval = 5000 }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [domainSessionId, setDomainSessionId] = useState(null)
  const intervalRef = useRef(null)

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

        let processedData
        if (typeof result === 'object' && result !== null) {
          processedData = transformApiResponse(result)
        } else {
          throw new Error('Invalid data format')
        }

        setData(processedData)
        setLastUpdated(new Date())
        setError(null)
      } catch (err) {
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
            {Object.entries(data).map(([key, value]) => (
              <TableRow
                key={key}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <TableCell component="th" scope="row">
                  <Typography variant="body2">
                    {getDisplayLabel(key) || ''}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatValue(key, value)}
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
