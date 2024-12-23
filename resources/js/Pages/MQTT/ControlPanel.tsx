import React from 'react'
import MainDashboard from '@/Pages/MQTT/MainDashboard';

export default function ControlPanel() {
  return (
    <div>
      Control Panel
    </div>
  )
}

ControlPanel.layout = (page: React.ReactNode) => <MainDashboard>{page}</MainDashboard>;