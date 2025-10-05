import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { useAuth } from '../hooks/useAuth';
import { SafetyStatus } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import axios from 'axios';

// --- ADDING BACK YOUR MOCK DATA AND HELPER COMPONENT ---
const SAFETY_CONTACTS = [
    { id: 1, name: 'Jane Doe (Spouse)', avatarUrl: 'https://i.pravatar.cc/150?img=1', status: SafetyStatus.SAFE, lastUpdate: '1h ago' },
    { id: 2, name: 'John Smith (Friend)', avatarUrl: 'https://i.pravatar.cc/150?img=2', status: SafetyStatus.UNKNOWN, lastUpdate: '8h ago' },
    { id: 3, name: 'Local Authority', avatarUrl: 'https://i.pravatar.cc/150?img=3', status: SafetyStatus.SAFE, lastUpdate: '30m ago' },
];

const ContactCard = ({ contact }) => {
    const statusStyles = {
        [SafetyStatus.SAFE]: { border: 'border-green-400', text: 'text-green-600', bg: 'bg-green-50', icon: '✔️' },
        [SafetyStatus.NEEDS_HELP]: { border: 'border-red-400', text: 'text-red-600', bg: 'bg-red-50', icon: '❗' },
        [SafetyStatus.UNKNOWN]: { border: 'border-gray-300', text: 'text-gray-500', bg: 'bg-gray-50', icon: '❓' }
    };
    const style = statusStyles[contact.status] || statusStyles[SafetyStatus.UNKNOWN];
    return (
        <div className={`p-4 rounded-lg flex items-center space-x-4 border-l-4 transition-shadow hover:shadow-md ${style.border} ${style.bg}`}>
            <img src={contact.avatarUrl} alt={contact.name} className="w-14 h-14 rounded-full border-2 border-white" />
            <div className="flex-1">
                <p className="font-bold text-gray-800">{contact.name}</p>
                <p className={`text-sm font-semibold ${style.text}`}>{style.icon} Marked as {contact.status}</p>
            </div>
            <p className="text-xs text-gray-400 self-start">{contact.lastUpdate}</p>
        </div>
    );
};
// --- END OF RESTORED COMPONENTS ---


const StatusUpdateConfirmation = ({ isVisible, status }) => {
    if (!isVisible) return null;
    const isSafe = status === 'SAFE';
    return (
        <div className="fixed top-24 right-4 z-[1001] animate-fade-in-down">
            <div className={`p-4 text-white rounded-lg shadow-lg flex items-center space-x-3 ${isSafe ? 'bg-green-500' : 'bg-red-500'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="font-semibold">Your status has been updated to "{status}"!</span>
            </div>
        </div>
    );
};


export const SafetyCheckPage = () => {
    const { user, updateUser } = useAuth();
    const { t } = useLanguage();
    
    const [statusUpdated, setStatusUpdated] = useState(false);
    const [lastStatus, setLastStatus] = useState(null);
    const [location, setLocation] = useState(null);
    const [locationStatus, setLocationStatus] = useState('Waiting for location...');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationStatus('Geolocation is not supported by your browser.');
            return;
        }
        setLocationStatus('Fetching location...');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lon: longitude });
                setLocationStatus(`Location Captured: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            },
            () => {
                setLocationStatus('Permission denied. Please enable location services to check in.');
            }
        );
    }, []);

    useEffect(() => {
        if (statusUpdated) {
            const timer = setTimeout(() => setStatusUpdated(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [statusUpdated]);

    const handleSafetyCheck = async (statusString) => {
        if (!location) {
            alert('Cannot submit safety check without a location. Please enable location services.');
            return;
        }
        setIsSubmitting(true);

        const checkInData = {
            status: statusString, // --- THE FIX: Use the simple string 'SAFE' or 'NEEDS_HELP' ---
            location: {
                type: 'Point',
                coordinates: [location.lon, location.lat]
            },
        };

        try {
            await axios.post('/api/safety', checkInData);
            const newSafetyStatus = { status: statusString, timestamp: new Date().toISOString() };
            updateUser({ safetyStatus: newSafetyStatus });
            
            setLastStatus(statusString);
            setStatusUpdated(true);

        } catch (error) {
            console.error("Failed to submit safety check:", error);
            alert("Could not submit safety check. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const currentStatus = user?.safetyStatus?.status || SafetyStatus.UNKNOWN;
    const lastUpdate = user?.safetyStatus?.timestamp ? new Date(user.safetyStatus.timestamp).toLocaleString() : null;

    if (!user) {
        return <div className="p-8 text-center text-gray-600">Loading...</div>;
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-8">
            <StatusUpdateConfirmation isVisible={statusUpdated} status={lastStatus} />

            <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Safety Check</h1>
                <p className="text-gray-500 mt-2">Update your status to notify admins and emergency contacts.</p>
                <p className="text-sm text-gray-400 mt-1">{locationStatus}</p>
            </div>

            <Card className="text-center p-6 md:p-8 bg-gradient-to-br from-blue-50 to-white">
                <h2 className="text-2xl font-bold mb-6 text-neutral-dark">Update Your Status</h2>
                
                <div className="flex justify-center gap-4 md:gap-8">
                    <button
                        onClick={() => handleSafetyCheck('SAFE')}
                        disabled={isSubmitting || !location}
                        className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-green-500 text-white flex flex-col items-center justify-center shadow-lg transition-transform duration-150 ease-in-out transform hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        <span className="text-5xl mb-2">✔️</span>
                        <span className="font-bold text-lg">I'm Safe</span>
                    </button>

                    <button
                        onClick={() => handleSafetyCheck('NEEDS_HELP')}
                        disabled={isSubmitting || !location}
                        className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-red-500 text-white flex flex-col items-center justify-center shadow-lg transition-transform duration-150 ease-in-out transform hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        <span className="text-5xl mb-2">❗</span>
                        <span className="font-bold text-lg">I Need Help</span>
                    </button>
                </div>
                
                {currentStatus !== SafetyStatus.UNKNOWN && lastUpdate && (
                    <p className="mt-6 text-sm text-gray-500">
                        Your current status is <span className="font-bold">{currentStatus}</span> (Last updated: {lastUpdate})
                    </p>
                )}
            </Card>
            
            <Card>
                <h2 className="text-2xl font-bold mb-4">Emergency Contacts' Status</h2>
                <div className="space-y-4">
                    {SAFETY_CONTACTS.map(contact => (
                        <ContactCard key={contact.id} contact={contact} />
                    ))}
                </div>
            </Card>
        </div>
    );
};