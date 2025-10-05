import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Role, UrgencyLevel } from '../types'; // Assuming you have these defined
import { InteractiveMap } from '../components/Map';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Card } from '../components/Card';
import { FileUpload } from '../components/FileUpload';
import { NotificationFeed } from '../components/NotificationFeed';
import { HELP_REQUESTS } from '../constants'; // Assuming this is your mock data
import { useLanguage } from '../hooks/useLanguage';
import axios from 'axios';

// Replace your old "HelpRequestCard" component with this new "IncidentCard"

const IncidentCard = ({ incident, onAccept }) => {
    const urgencyColors = {
        [UrgencyLevel.LOW]: 'bg-green-100 text-green-800',
        [UrgencyLevel.MEDIUM]: 'bg-yellow-100 text-yellow-800',
        [UrgencyLevel.HIGH]: 'bg-red-100 text-red-800',
    };
    return (
        <Card className="animate-fade-in">
            <div className="flex justify-between items-start">
                <div>
                    {/* Use data from the real incident object */}
                    <h4 className="font-bold text-lg">{incident.type}</h4>
                    <p className="text-sm text-gray-500">From: {incident.reportedBy?.name || 'Unknown'}</p>
                </div>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${urgencyColors[incident.urgency]}`}>{incident.urgency}</span>
            </div>
            <p className="mt-2 text-gray-700">{incident.description}</p>

            {/* This checks if the incident is already assigned to someone */}
            {incident.assignedTo ? (
                <p className="w-full mt-4 text-center text-sm font-semibold text-gray-500">Already Assigned</p>
            ) : (
                <Button onClick={onAccept} className="w-full mt-4">Accept Request</Button>
            )}
        </Card>
    );
};

// Helper component for showing online/offline status
const OfflineIndicator = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showSyncing, setShowSyncing] = useState(false);
    const [showSynced, setShowSynced] = useState(false);

    React.useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setShowSyncing(true);
            // Simulate sync
            setTimeout(() => {
                setShowSyncing(false);
                setShowSynced(true);
                setTimeout(() => setShowSynced(false), 2000);
            }, 1500);
        };
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (isOnline) {
        if (showSyncing) {
            return (
                <div className="fixed bottom-4 right-4 bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in z-50">
                    Syncing your data...
                </div>
            );
        }
        if (showSynced) {
            return (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in z-50">
                    ✓ Synced
                </div>
            );
        }
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in z-50">
            Offline Mode: Reports will sync when you're back online.
        </div>
    );
};

export const DashboardPage = () => {
    const { user } = useAuth();
    const { t } = useLanguage();

    // --- STATE MANAGEMENT ---
    // Data fetching state
    const [incidents, setIncidents] = useState([]);
    const [loadingIncidents, setLoadingIncidents] = useState(true);
    
    // Modal visibility state
    const [isHelpModalOpen, setHelpModalOpen] = useState(false);
    const [isIncidentModalOpen, setIncidentModalOpen] = useState(false);
    
    // Shared state for forms
    const [formError, setFormError] = useState('');
    const [formLocation, setFormLocation] = useState(null);
    const [locationStatus, setLocationStatus] = useState('Click the button to capture your location.');

    // State for "Report Incident" modal
    const [reportType, setReportType] = useState('Flood');
    const [reportDescription, setReportDescription] = useState('');

    // State for "Request Assistance" modal
    const [helpType, setHelpType] = useState('Medical');
    const [helpUrgency, setHelpUrgency] = useState('Medium');
    const [helpDescription, setHelpDescription] = useState('');
const [reportFile, setReportFile] = useState(null);

    // --- DATA FETCHING ---
    const fetchIncidents = async () => {
        try {
            setLoadingIncidents(true);
            const { data } = await axios.get('http://localhost:5000/api/incidents');
            setIncidents(data);
        } catch (error) {
            console.error("Failed to fetch incidents:", error);
        } finally {
            setLoadingIncidents(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchIncidents();
        }
    }, [user]);


    // --- EVENT HANDLERS ---
    const fetchLocation = () => {
        if (!navigator.geolocation) {
            setLocationStatus('Geolocation is not supported by your browser.');
            return;
        }
        setFormLocation(null);
        setLocationStatus('Fetching location...');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setFormLocation({ lat: latitude, lon: longitude });
                setLocationStatus(`Location Captured: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            },
            () => {
                setLocationStatus('Permission denied. Please enable location services.');
            }
        );
    };
    
   const handleReportIncident = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!formLocation) {
      setFormError('Location is required to submit a report.');
      return;
    }

    // 1. Create a FormData object
    const formData = new FormData();

    // 2. Append all the text fields
    formData.append('type', reportType);
    formData.append('description', reportDescription);
    formData.append('urgency', 'MEDIUM'); // Defaulting urgency for general reports
    
    // The location object must be converted to a string to be sent in FormData
    const locationData = {
        type: 'Point',
        coordinates: [formLocation.lon, formLocation.lat]
    };
    formData.append('location', JSON.stringify(locationData));

    // 3. Append the image file if it exists
    if (reportFile) {
      // The 'image' key MUST match the key we used in our multer middleware
      formData.append('image', reportFile);
    }

    // 4. Send the FormData object to the backend
    try {
      // Axios will automatically set the correct 'Content-Type: multipart/form-data' header
      await axios.post('http://localhost:5000/api/incidents', formData);
      
      alert('Incident reported successfully!');
      
      // Reset form and close modal
      setIncidentModalOpen(false);
      setReportDescription('');
      setReportFile(null);
      setFormLocation(null);
      setLocationStatus('Click the button to capture your location.');
      
      fetchIncidents(); // Refresh the incident list
      
    } catch (error) {
      console.error("Failed to report incident:", error);
      setFormError(error.response?.data?.message || 'An error occurred while uploading.');
    }
  };

    const handleRequestHelp = async (e) => {
        e.preventDefault();
        setFormError('');
        if (!formLocation) {
            setFormError('Location is required to request assistance.');
            return;
        }

        const helpRequestData = {
            type: helpType,
            description: helpDescription,
            urgency: helpUrgency.toUpperCase(),
            location: {
                type: 'Point',
                coordinates: [formLocation.lon, formLocation.lat]
            },
        };

        try {
        // Send the data to the same endpoint as reporting an incident
        await axios.post('http://localhost:5000/api/incidents', helpRequestData);
        
        alert('Help request submitted successfully!');
        
        // Reset the form, close the modal, and refresh the incident list
        setHelpModalOpen(false);
        setHelpDescription('');
        setFormLocation(null);
        setLocationStatus('Click the button to capture your location.');
        fetchIncidents();

    } catch (error) {
        console.error("Failed to submit help request:", error);
        setFormError(error.response?.data?.message || 'An error occurred.');
    }
  };

    // Placeholder handlers
    const handleAcceptRequest = async (incidentId) => {
    // We need the logged-in user's ID to assign them to the incident.
    if (!user || user.role !== 'VOLUNTEER') {
      alert('You must be logged in as a volunteer to accept requests.');
      return;
    }

    try {
      // Send a PUT request to the backend to assign the current user to the incident
      await axios.put(
        `http://localhost:5000/api/incidents/${incidentId}/assign`, 
        { volunteerId: user._id }
      );

      alert('Request accepted successfully! Thank you for your help.');

      // Refresh the incident list to reflect the change
      fetchIncidents();

    } catch (error) {
      console.error("Failed to accept request:", error);
      alert(error.response?.data?.message || 'An error occurred while accepting the request.');
    }
  };
    const handleSendAlert = () => { if (window.confirm("Send an emergency alert?")) { alert('Emergency alert has been sent.'); } };


    // --- RENDER LOGIC ---
    if (!user) {
        return <div className="p-6 text-center"><h1 className="text-xl">Loading your dashboard...</h1></div>;
    }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <OfflineIndicator />
      <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* --- Right Column (Actions & Feed) - Appears first on mobile --- */}
        <div className="space-y-6 lg:order-2">
          <Card className="text-center">
            <h3 className="font-bold text-lg mb-4">Actions</h3>
            <div className="flex flex-col space-y-4">
              <Button onClick={handleSendAlert} variant="danger">
                <div className="flex justify-center items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  {t('emergency')}
                </div>
              </Button>
              <Button onClick={() => setHelpModalOpen(true)}>Request Help</Button>
              <Button onClick={() => setIncidentModalOpen(true)} variant="secondary">Report an Incident</Button>
            </div>
          </Card>
          <NotificationFeed />
        </div>

        {/* --- Left Column (Map) - Appears second on mobile --- */}
        <div className="lg:col-span-2 lg:order-1 h-[400px] md:h-[600px]">
          <InteractiveMap />
        </div>
        
      </div>

       {user?.role === 'VOLUNTEER' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Open Incidents</h2>
          <div className="max-h-96 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loadingIncidents ? (
              <p>Loading incidents...</p>
            ) : incidents.length > 0 ? (
              incidents.map(incident => (
                <IncidentCard key={incident._id} incident={incident} onAccept={() => handleAcceptRequest(incident._id)} />
              ))
            ) : (
              <p>No open incidents at the moment.</p>
            )}
          </div>
        </div>
      )}

      {/* --- Modals --- */}
    <Modal isOpen={isHelpModalOpen} onClose={() => setHelpModalOpen(false)} title="Request Assistance">
        <form className="space-y-4" onSubmit={handleRequestHelp}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type of Help</label>
            <select required value={helpType} onChange={(e) => setHelpType(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900">
                <option>Medical</option>
                <option>Food / Water</option>
                <option>Rescue / Evacuation</option>
                <option>Shelter</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Urgency Level</label>
            <select required value={helpUrgency} onChange={(e) => setHelpUrgency(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea rows={3} required value={helpDescription} onChange={(e) => setHelpDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900" placeholder="Briefly describe your situation..."></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location (Required)</label>
            <div className="mt-1 flex items-center space-x-2">
                <Button type="button" variant="secondary" onClick={fetchLocation}>Capture Location</Button>
                <p className="text-sm text-gray-600 truncate">{locationStatus}</p>
            </div>
          </div>

          {formError && <p className="text-sm text-red-500 text-center">{formError}</p>}

          <Button type="submit" className="w-full">Submit Request</Button>
        </form>
      </Modal>

            <Modal isOpen={isIncidentModalOpen} onClose={() => setIncidentModalOpen(false)} title="Report an Incident">
                <form className="space-y-4" onSubmit={handleReportIncident}>
                    {/* YOUR ORIGINAL DETAILED FORM FIELDS */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Incident Type</label>
                        <select required value={reportType} onChange={(e) => setReportType(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900">
                            <option>Flood</option>
                            <option>Fallen Tree / Debris</option>
                            <option>Power Outage</option>
                            <option>Road Blocked</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea rows={3} required value={reportDescription} onChange={(e) => setReportDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900" placeholder="Provide details about the incident..."></textarea>
                    </div>
                    {/* SHARED LOCATION LOGIC */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location (Required)</label>
                        <div className="mt-1 flex items-center space-x-2">
                            <Button type="button" variant="secondary" onClick={fetchLocation}>Capture Location</Button>
                            <p className="text-sm text-gray-600 truncate">{locationStatus}</p>
                        </div>
                    </div>
                    <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Attach an Image</label>
    <FileUpload onFileSelect={setReportFile} />
</div>
                    {formError && <p className="text-sm text-red-500 text-center">{formError}</p>}
                    <Button type="submit" className="w-full">Submit Report</Button>
                </form>
            </Modal>
        </div>
    );
};