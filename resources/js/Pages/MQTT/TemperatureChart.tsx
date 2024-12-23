import React from 'react'
import MainDashboard from '@/Pages/MQTT/MainDashboard';

export default function TemperatureChart() {
  return (
    <div>
      Temperature Chart
    </div>
  )
}

TemperatureChart.layout = (page: React.ReactNode) => <MainDashboard>{page}</MainDashboard>;