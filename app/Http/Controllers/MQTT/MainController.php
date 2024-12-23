<?php

namespace App\Http\Controllers\MQTT;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;

class MainController extends Controller
{
    public function final_project()
    {
        return Inertia::render('MQTT/ProjectDashboard');
    }

    public function main_dashboard()
    {
        return Inertia::render('MQTT/MainDashboard');
    }

    public function dashboard()
    {
        return Inertia::render('MQTT/Dashboard');
    }

    public function room_115()
    {
        return Inertia::render('MQTT/Room115');
    }

    public function room_116()
    {
        return Inertia::render('MQTT/Room116');
    }

    public function temp_chart()
    {
        return Inertia::render('MQTT/TemperatureChart');
    }

    public function humid_chart()
    {
        return Inertia::render('MQTT/HumidityChart');
    }

    public function control_panel()
    {
        return Inertia::render('MQTT/ControlPanel');
    }

    public function connect()
    {
        return Inertia::render('MQTT/Connect');
    }
}
