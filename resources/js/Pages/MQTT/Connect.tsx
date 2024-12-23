import React from 'react'
import MainDashboard from '@/Pages/MQTT/MainDashboard';
import MqttConnect from '@/Components/MQTT/mqtt-connect';

export default function Connect() {
  return (
    <div>
      <MqttConnect/>
    </div>
  )
}

Connect.layout = (page: React.ReactNode) => <MainDashboard>{page}</MainDashboard>;