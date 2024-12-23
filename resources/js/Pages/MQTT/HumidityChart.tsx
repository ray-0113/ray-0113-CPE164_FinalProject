import React from 'react'
import MainDashboard from '@/Pages/MQTT/MainDashboard';

export default function HumidityChart() {
  return (
    <div>
      Humidity Chart
    </div>
  )
}

HumidityChart.layout = (page: React.ReactNode) => <MainDashboard>{page}</MainDashboard>;