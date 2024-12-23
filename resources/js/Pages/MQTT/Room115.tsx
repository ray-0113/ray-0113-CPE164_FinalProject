import React from 'react'
import MainDashboard from '@/Pages/MQTT/MainDashboard';

export default function Room115() {
  return (
    <div>
      Room 115
    </div>
  )
}

Room115.layout = (page: React.ReactNode) => <MainDashboard>{page}</MainDashboard>;