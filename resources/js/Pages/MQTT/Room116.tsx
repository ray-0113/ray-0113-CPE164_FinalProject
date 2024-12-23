import React from 'react'
import MainDashboard from '@/Pages/MQTT/MainDashboard';

export default function Room116() {
  return (
    <div>
      Room 116
    </div>
  )
}

Room116.layout = (page: React.ReactNode) => <MainDashboard>{page}</MainDashboard>;