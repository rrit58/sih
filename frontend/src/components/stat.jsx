import React, { useRef, useEffect } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-flip';
import 'swiper/css/pagination';
import '../components/stat.css'
import './stat.css';

// Import required modules
import { EffectFlip, Pagination, Autoplay } from 'swiper/modules';

// Import Chart.js
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    DoughnutController,
    PieController
} from 'chart.js';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';

// Import the CSS

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    DoughnutController,
    PieController
);

// --- CONFIGURATION ---
const BLUE_THEME = {
    primary: '#0ea5e9',   // Sky 500
    secondary: '#3b82f6', // Blue 500
    info: '#06b6d4',      // Cyan 500
    accent: '#6366f1',    // Indigo 500
    success: '#10b981',   // Emerald 500 (for seeded)
    danger: '#ef4444',    // Red 500
    warning: '#f59e0b',   // Amber 500
    text: '#f0f9ff',
    grid: 'rgba(255, 255, 255, 0.1)'
};

ChartJS.defaults.color = '#94a3b8';
ChartJS.defaults.borderColor = BLUE_THEME.grid;
ChartJS.defaults.font.family = 'Outfit';

const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                color: BLUE_THEME.text,
                padding: 10,
                font: { size: 12 }
            }
        }
    },
    scales: {
        // Some charts might not use scales (Pie/Doughnut), but this won't break them
        x: { grid: { display: false }, ticks: { color: BLUE_THEME.text } },
        y: { grid: { color: BLUE_THEME.grid }, ticks: { color: BLUE_THEME.text } }
    }
};

const AadhaarImpactDashboard = () => {

    // Data Definitions
    const impactData = {
        labels: ['SC Post', 'SC Pre', 'OBC Post', 'OBC Pre'],
        datasets: [{
            label: 'Beneficiaries (Lakhs)',
            data: [41.32, 18.72, 32.73, 26.03],
            backgroundColor: [BLUE_THEME.primary, BLUE_THEME.secondary, BLUE_THEME.info, BLUE_THEME.accent],
            borderRadius: 8
        }]
    };

    const gapData = {
        labels: ['Seeded Accounts', 'Not Seeded'],
        datasets: [{
            data: [788, 592],
            backgroundColor: [BLUE_THEME.success, BLUE_THEME.danger],
            borderWidth: 0
        }]
    };

    const failureData = {
        labels: ['Aadhaar Not Seeded', 'Other Reasons'],
        datasets: [{
            data: [51.3, 48.7],
            backgroundColor: [BLUE_THEME.danger, '#475569'],
            borderColor: '#0f172a',
            borderWidth: 2
        }]
    };

    const awarenessData = {
        labels: ['SC', 'BC', 'General', 'OBC'],
        datasets: [{
            label: 'Awareness (%)',
            data: [73.3, 44.4, 27.6, 25.0],
            backgroundColor: BLUE_THEME.warning,
            borderRadius: 5
        }]
    };

    // Ref to hold chart instances to manually trigger animations if needed
    // Note: react-chartjs-2 handles re-rendering on prop change, but for 'flip' effect 
    // simply remounting or letting the key change usually triggers animation.
    // Swiper's 'loop' might duplicate slides, so unique keys are important.

    return (
        <div className="aadhaar-dashboard-wrapper">
            <Swiper
                effect={'flip'}
                grabCursor={true}
                pagination={{ clickable: true }}
                modules={[EffectFlip, Pagination, Autoplay]}
                className="dashboard-swiper"
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                }}
                speed={800} // Speed of the flip animation
            >
                {/* Slide 1: Impact */}
                <SwiperSlide>
                    <div className="dashboard-card">
                        <h2>Student Impact</h2>
                        <div className="chart-area">
                            <Bar
                                data={impactData}
                                options={{
                                    ...commonOptions,
                                    plugins: { legend: { display: false } }, // Hide legend
                                    animation: { duration: 1000, easing: 'easeOutQuart' } // Animation per slide
                                }}
                            // Key forces component remount on re-visit if logic requires it, 
                            // but Swiper keeps DOM. ChartJS usually animates on mount.
                            />
                        </div>
                    </div>
                </SwiperSlide>

                {/* Slide 2: Gap */}
                <SwiperSlide>
                    <div className="dashboard-card">
                        <h2>The Seeding Gap</h2>
                        <div className="chart-area">
                            <Doughnut
                                data={gapData}
                                options={{
                                    ...commonOptions,
                                    cutout: '70%',
                                    scales: { x: { display: false }, y: { display: false } },
                                    animation: { animateRotate: true, animateScale: true }
                                }}
                            />
                        </div>
                    </div>
                </SwiperSlide>

                {/* Slide 3: Failure */}
                <SwiperSlide>
                    <div className="dashboard-card">
                        <h2>DBT Failure Reasons</h2>
                        <div className="chart-area">
                            <Pie
                                data={failureData}
                                options={{
                                    ...commonOptions,
                                    scales: { x: { display: false }, y: { display: false } },
                                    animation: { animateRotate: true }
                                }}
                            />
                        </div>
                    </div>
                </SwiperSlide>

                {/* Slide 4: Awareness */}
                <SwiperSlide>
                    <div className="dashboard-card">
                        <h2>Awareness Stats</h2>
                        <div className="chart-area">
                            <Bar
                                data={awarenessData}
                                options={{
                                    ...commonOptions,
                                    indexAxis: 'y', // Horizontal
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        x: {
                                            max: 100,
                                            grid: { color: BLUE_THEME.grid },
                                            ticks: { color: BLUE_THEME.text }
                                        },
                                        y: { grid: { display: false }, ticks: { color: BLUE_THEME.text } }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </SwiperSlide>

            </Swiper>
        </div>
    );
};

export default AadhaarImpactDashboard;
