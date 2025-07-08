'use client'

import { formatDateTime } from '@/lib/utils'
import { useEffect, useState } from 'react'

type ClientDateTimeProps = {
  date: Date
  showDateOnly?: boolean
  showTimeOnly?: boolean
}

const ClientDateTime = ({ date, showDateOnly, showTimeOnly }: ClientDateTimeProps) => {
  const [formattedDate, setFormattedDate] = useState<string>('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const formatted = formatDateTime(date)
    
    if (showDateOnly) {
      setFormattedDate(formatted.dateOnly)
    } else if (showTimeOnly) {
      setFormattedDate(formatted.timeOnly)
    } else {
      setFormattedDate(formatted.dateTime)
    }
  }, [date, showDateOnly, showTimeOnly])

  // Show placeholder during SSR to prevent hydration mismatch
  if (!isClient) {
    return <span>Loading...</span>
  }

  return <span>{formattedDate}</span>
}

export default ClientDateTime