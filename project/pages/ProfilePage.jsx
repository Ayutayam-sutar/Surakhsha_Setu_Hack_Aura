import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { Badge } from '../components/Badge';
import { Role, SafetyStatus } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { useTraining } from '../hooks/useTraining';
import axios from 'axios';

// --- Helper Components ---
const ActivityLogItem = ({ log }) => (
    <div className="flex items-start space-x-4 p-4 transition-colors hover:bg-gray-50">
        <div className={`flex-shrink-0 p-2 rounded-full ${log.type === 'assignment_completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-brand-blue'}`}>
            {log.type === 'assignment_completed' ? 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> :
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            }
        </div>
        <div>
            <p className="font-semibold text-gray-800">{log.description}</p>
            <p className="text-sm text-gray-500">{new Date(log.date).toLocaleDateString()}</p>
        </div>
    </div>
);

const AvailabilityToggle = ({ isAvailable, onToggle }) => (
    <Card>
        <h3 className="text-xl font-bold mb-4">Availability Status</h3>
        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
            <p className={`font-bold text-lg ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                {isAvailable ? 'Available for missions' : 'Currently unavailable'}
            </p>
            <button
                onClick={onToggle}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}
            >
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
    </Card>
);


// --- Main Profile Page Component ---
export const ProfilePage = () => {
    const { user, login } = useAuth();
    const { t } = useLanguage();
    const { modules } = useTraining();
    
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                contact: user.contact || '',
                emergencyContact: user.emergencyContact || '',
                bio: user.bio || '',
                skills: user.skills || [],
                isAvailable: user.isAvailable ?? true,
            });
        }
    }, [user]);

    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => setToastMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    if (!user) {
        return <div className="p-8 text-center text-gray-600">Loading profile...</div>;
    }

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data: updatedUser } = await axios.put('/api/users/profile', formData);
            login(updatedUser);
            setEditModalOpen(false);
            setToastMessage('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile:', error);
            setToastMessage(error.response?.data?.message || 'Failed to update profile.');
        }
    };

    const handleAvailabilityChange = async () => {
        const newAvailability = !formData.isAvailable;
        try {
            const { data: updatedUser } = await axios.put('/api/users/profile', { isAvailable: newAvailability });
            login(updatedUser);
            setToastMessage(`Availability set to: ${newAvailability ? 'Available' : 'Unavailable'}`);
        } catch (error) {
            console.error('Failed to update availability:', error);
            setToastMessage('Error updating availability.');
        }
    };
    
    const activityLogs = user.role === Role.VOLUNTEER ? [] : [];
    const completedModules = modules.filter(m => m.progress === 100);
    
    const safetyStatus = user.safetyStatus || { status: SafetyStatus.UNKNOWN };
    const statusStyles = {
        [SafetyStatus.SAFE]: { bg: 'bg-green-100', text: 'text-green-800', icon: '✔️' },
        [SafetyStatus.NEEDS_HELP]: { bg: 'bg-red-100', text: 'text-red-800', icon: '❗' },
        [SafetyStatus.UNKNOWN]: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '❓' }
    };
    const currentStatusStyle = statusStyles[safetyStatus.status] || statusStyles[SafetyStatus.UNKNOWN];

    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-8">
            {toastMessage && <div className="fixed top-6 right-6 bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg z-[1001] animate-fade-in">{toastMessage}</div>}
            
            <Card className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 animate-fade-in">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="font-bold">Weather Alert: High Wind Warning</h3>
                        <p className="text-sm mt-1">A cyclone is approaching. Secure loose objects and stay indoors.</p>
                    </div>
                </div>
            </Card>

            <Card className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 p-6">
                <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserCircleIcon className="w-16 h-16 text-gray-400" />
                </div>
                <div className="text-center md:text-left flex-grow">
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    <p className="text-gray-500">{user.email}</p>
                    <span className="inline-block mt-2 px-3 py-1 text-sm font-semibold text-brand-blue bg-blue-100 rounded-full">{user.role}</span>
                </div>
                <Button onClick={() => setEditModalOpen(true)}>{t('editProfile')}</Button>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-8">
                    {user.role === 'VOLUNTEER' && (
                        <AvailabilityToggle isAvailable={formData.isAvailable} onToggle={handleAvailabilityChange} />
                    )}
                    <Card>
                        <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                        <div className="space-y-3 text-sm text-gray-700">
                            <p><span className="font-semibold text-neutral-dark">{t('contactLabel')}:</span> {user.contact || 'N/A'}</p>
                            <p><span className="font-semibold text-neutral-dark">{t('emergencyContactLabel')}:</span> {user.emergencyContact || 'N/A'}</p>
                        </div>
                    </Card>
                    <Card>
                        <h3 className="text-xl font-bold mb-4">My Safety Status</h3>
                        <div className={`p-4 rounded-lg flex items-center ${currentStatusStyle.bg}`}>
                            <span className="text-2xl mr-4">{currentStatusStyle.icon}</span>
                            <div>
                                <p className={`font-bold ${currentStatusStyle.text}`}>You are marked as {safetyStatus.status}</p>
                                {safetyStatus.timestamp && <p className={`text-xs ${currentStatusStyle.text}`}>Last updated: {new Date(safetyStatus.timestamp).toLocaleString()}</p>}
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-2 space-y-8">
                    {user.role === Role.VOLUNTEER && (
                        <Card>
                            <h3 className="text-xl font-bold mb-4">{t('volunteerBio')}</h3>
                            <p className="text-gray-600 italic whitespace-pre-wrap">{user.bio || 'No bio provided.'}</p>
                        </Card>
                    )}
                    {user.role === Role.VOLUNTEER && (
                        <Card>
                            <h3 className="text-xl font-bold mb-4">Certification Badges</h3>
                            <div className="flex flex-wrap gap-4">
                                {completedModules.length > 0 ? completedModules.map(m => (
                                    <Badge key={m.id} icon={m.badgeIcon} label={m.title} />
                                )) : (
                                    <p className="text-gray-500">No badges earned yet. Visit the Training Hub to get started!</p>
                                )}
                            </div>
                        </Card>
                    )}
                    <Card>
                        <h3 className="text-xl font-bold mb-4">Activity Log</h3>
                        <div className="divide-y divide-gray-200 -mx-6">
                            {activityLogs.length > 0 ? activityLogs.map(log => <ActivityLogItem key={log.id} log={log} />) : <p className="p-4 text-center text-gray-500">No activity to show.</p>}
                        </div>
                    </Card>
                </div>
            </div>

            <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title={t('editProfile')}>
                <form className="space-y-4" onSubmit={handleFormSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('nameLabel')}</label>
                        <input type="text" id="name" name="name" value={formData.name || ''} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-neutral-dark"/>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('emailAddress')}</label>
                        <input type="email" id="email" name="email" value={formData.email || ''} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-neutral-dark"/>
                    </div>
                    <div>
                        <label htmlFor="contact" className="block text-sm font-medium text-gray-700">{t('contactLabel')}</label>
                        <input type="text" id="contact" name="contact" value={formData.contact || ''} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-neutral-dark"/>
                    </div>
                    <div>
                        <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700">{t('emergencyContactLabel')}</label>
                        <input type="text" id="emergencyContact" name="emergencyContact" value={formData.emergencyContact || ''} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-neutral-dark"/>
                    </div>
                    {user.role === 'VOLUNTEER' && (
                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">{t('volunteerBio')}</label>
                            <textarea id="bio" name="bio" rows={4} value={formData.bio || ''} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-neutral-dark" placeholder={t('bioDescription')}></textarea>
                        </div>
                    )}
                    <Button type="submit" className="w-full">{t('saveChanges')}</Button>
                </form>
            </Modal>
        </div>
    );
};

