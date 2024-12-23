<?php

use App\Http\Controllers\MQTT\MainController;
use App\Http\Controllers\MqttController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/final_project');
});
//Final Project
Route::get('/final_project', [MainController::class, 'final_project'])->name('final_project');

//di na muna ginamit
// Main Dashboard
Route::get('/main_dashboard', [MainController::class, 'main_dashboard'])->name('main_dashboard');

//Dashboard 
Route::get('/dashboard', [MainController::class, 'dashboard'])->name('dashboard');

//////////
// Room 115 Page
Route::get('/dashboard/room_115', [MainController::class, 'room_115'])->name('dashboard.room_115');

// Room 116 Page
Route::get('/dashboard/room_116', [MainController::class, 'room_116'])->name('dashboard.room_116');

// Temperature Chart Page
Route::get('/dashboard/temp_chart', [MainController::class, 'temp_chart'])->name('dashboard.temp_chart');

// humidity Chart Page
Route::get('/dashboard/humid_chart', [MainController::class, 'humid_chart'])->name('dashboard.humid_chart');
////////

Route::get('/dashboard/control_panel', [MainController::class, 'control_panel'])->name('dashboard.control_panel');
Route::get('/dashboard/connect', [MainController::class, 'connect'])->name('dashboard.connect');

//MQTT Connection

require __DIR__.'/auth.php';
