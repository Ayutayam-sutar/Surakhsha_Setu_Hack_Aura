import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { InteractiveMap } from '../components/Map';
import { useLanguage } from '../hooks/useLanguage';
import { Button } from '../components/Button';
import axios from 'axios';

// NOTE: All your beautiful helper components are preserved below.
// For better organization in the future, you could move each one to its own file.
const AnimatedStatCard = ({ title, value, icon, trend, delay = 0 }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    useEffect(() => {
        let start = 0;
        const end = parseInt(value) || 0;
        if (isNaN(end)) return;
        const duration = 1000;
        const increment = end / (duration / 16) || 1;
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setDisplayValue(end);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [value]);
    const isUp = trend > 0;
    const isDown = trend < 0;
    const trendColor = isUp ? 'text-green-500' : isDown ? 'text-red-500' : 'text-gray-500';
    const trendIcon = isUp ? '▲' : isDown ? '▼' : '▬';
    return (
        <div
            className={`bg-white rounded-lg shadow-md p-6 transition-all duration-300 cursor-pointer ${isHovered ? 'shadow-xl scale-105' : ''}`}
            style={{ animation: `slideInUp 0.6s ease-out ${delay}s both`, transform: isHovered ? 'rotateX(5deg) rotateY(5deg)' : 'rotateX(0deg) rotateY(0deg)', transformStyle: 'preserve-3d' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>
                    <div className="flex items-baseline">
                        <p className="text-3xl font-bold text-gray-900">{displayValue}</p>
                        {trend !== undefined && <p className={`ml-3 text-sm font-semibold ${trendColor} flex items-center`}>{trendIcon} {Math.abs(trend)}%</p>}
                    </div>
                </div>
                <div className={`text-4xl transition-transform duration-300 ${isHovered ? 'scale-110 rotate-12' : ''}`}>{icon}</div>
            </div>
            <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-blue rounded-full transition-all duration-1000" style={{ width: `${(value > 0 ? displayValue / value : 0) * 100}%` }} />
            </div>
        </div>
    );
};


// Enhanced 3D Pie Chart
const Enhanced3DPieChart = ({ data, colors }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);
  
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;
  
  return (
    <div className="relative flex items-center justify-center">
      <svg 
        viewBox="0 0 140 140" 
        className="w-48 h-48 md:w-64 md:h-64"
        style={{ 
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 0.05s linear',
        }}
      >
        <defs>
          {colors.map((color, i) => (
            <filter key={i} id={`shadow-${i}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
              <feOffset dx="2" dy="2" result="offsetblur"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          ))}
        </defs>
        {data.map((segment, index) => {
          const dashArray = `${(segment.percentage / 100) * circumference} ${circumference}`;
          const strokeDashoffset = accumulatedOffset;
          accumulatedOffset -= (segment.percentage / 100) * circumference;
          const scale = hoveredIndex === index ? 1.1 : 1;
          
          return (
            <g key={index}>
              <circle
                cx="70" cy="70" r={radius}
                fill="transparent"
                stroke={colors[index % colors.length]}
                strokeWidth="24"
                strokeDasharray={dashArray}
                strokeDashoffset={strokeDashoffset}
                filter={`url(#shadow-${index})`}
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: '70px 70px',
                  transition: 'transform 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            </g>
          );
        })}
        <circle cx="70" cy="70" r="35" fill="white" opacity="0.9"/>
        <text x="70" y="75" textAnchor="middle" className="text-sm font-bold fill-gray-700">
          {data.length} Types
        </text>
      </svg>
    </div>
  );
};

// Enhanced Resource Table with Advanced Features
const EnhancedResourceTable = ({ resources, onQuantityChange }) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  const statusColors = {
    'In Stock': 'bg-green-100 text-green-800',
    'Low': 'bg-yellow-100 text-yellow-800',
    'Out of Stock': 'bg-red-100 text-red-800'
  };
  const filteredResources = useMemo(() => {
        return resources.filter(res => {
            const matchesSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase()) || res.location.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterStatus === 'All' || res.status === filterStatus;
            return matchesSearch && matchesFilter;
        });
    }, [resources, searchTerm, filterStatus]);
  const sortedResources = useMemo(() => {
    if (!sortConfig.key) return filteredResources;
    
    return [...filteredResources].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredResources, sortConfig]);
  
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };
  
  const toggleRowSelection = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder={t('searchResourcesPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="All">{t('allStatuses')}</option>
            <option value="In Stock">{t('inStock')}</option>
            <option value="Low">{t('lowStock')}</option>
            <option value="Out of Stock">{t('outOfStock')}</option>
          </select>
          {selectedRows.length > 0 && (
            <button className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-dark transition-colors">
              {t('bulkUpdate')} ({selectedRows.length})
            </button>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRows(sortedResources.map(r => r._id));
                    } else {
                      setSelectedRows([]);
                    }
                  }}
                  checked={selectedRows.length === sortedResources.length && sortedResources.length > 0}
                />
              </th>
              <th 
                className="px-6 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('location')}
              >
                {t('shelterLocation')} {sortConfig.key === 'shelterLocation' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-6 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
               onClick={() => handleSort('name')}
              >
                {t('resourceItem')} {sortConfig.key === 'item' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-center font-semibold text-gray-700">{t('quantity')}</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">{t('status')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedResources.map((res, index) => (
              <tr 
                key={res._id} 
                className="bg-white hover:bg-gray-50 transition-colors"
                style={{
                  animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
                }}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(res._id)}
                    onChange={() => toggleRowSelection(res._id)}
                  />
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">{res.location}</td>
        <td className="px-6 py-4 text-gray-700">{res.name}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center space-x-2">
                    <button 
                      onClick={() => onQuantityChange(res._id, -10)} 
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-16 text-center font-semibold">{res.quantity}</span>
                    <button 
                      onClick={() => onQuantityChange(res._id, 10)} 
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 font-semibold rounded-full text-xs ${statusColors[res.status]}`}>
                    {res.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Enhanced Volunteer Management with Performance Metrics
const EnhancedVolunteerTable = ({ volunteers, onMessage, onSuspend, onViewProfile }) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('All');
  
  const filteredVolunteers = useMemo(() => {
    return volunteers.filter(vol => {
      const matchesSearch = vol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vol.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filterAvailability === 'All' || 
                           (filterAvailability === 'Available' && vol.isAvailable) ||
                           (filterAvailability === 'Unavailable' && !vol.isAvailable);
      return matchesSearch && matchesFilter;
    });
  }, [volunteers, searchTerm, filterAvailability]);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('volunteerManagement')}</h2>
        <button className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-dark transition-colors">
          + {t('addVolunteer')}
        </button>
      </div>
      
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder={t('searchVolunteersPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue"
        />
        <select
          value={filterAvailability}
          onChange={(e) => setFilterAvailability(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
        >
          <option value="All">{t('all')}</option>
          <option value="Available">{t('available')}</option>
          <option value="Unavailable">{t('unavailable')}</option>
        </select>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">{t('name')}</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">{t('status')}</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">{t('skills')}</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">{t('contact')}</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredVolunteers.map((vol, index) => (
              <tr 
                key={vol._id} 
                className={`bg-white hover:bg-gray-50 transition-colors ${vol.isSuspended ? 'opacity-50' : ''}`}
                style={{
                  animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
                }}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold mr-3">
                      {vol.name.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-900">{vol.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {vol.isSuspended ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {t('suspended')}
                    </span>
                  ) : (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      vol.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      <svg className={`-ml-0.5 mr-1.5 h-2 w-2 ${vol.isAvailable ? 'text-green-400' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                      {vol.isAvailable ? t('available') : t('busy')}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {vol.skills.slice(0, 2).map(skill => (
                      <span key={skill} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                        {skill}
                      </span>
                    ))}
                     {vol.skills.length > 2 && <span className="text-xs font-semibold text-gray-500">+{vol.skills.length - 2}</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <a href={`mailto:${vol.email}`} className="text-brand-blue hover:underline block text-xs">{vol.email}</a>
                  <a href={`tel:${vol.contact}`} className="text-brand-blue hover:underline block text-xs">{vol.contact}</a>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                     <button 
                      onClick={() => onViewProfile(vol)}
                      className="px-3 py-1 bg-gray-200 text-gray-800 text-xs rounded hover:bg-gray-300 transition-colors"
                    >
                      {t('viewProfile')}
                    </button>
                    <button 
                      onClick={() => onMessage(vol)} 
                      disabled={vol.isSuspended}
                      className="px-3 py-1 bg-brand-blue text-white text-xs rounded hover:bg-brand-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('message')}
                    </button>
                    <button 
                      onClick={() => onSuspend(vol)}
                      className="px-3 py-1 bg-brand-red text-white text-xs rounded hover:bg-red-700 transition-colors"
                    >
                      {vol.isSuspended ? t('unsuspend') : t('suspend')}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const VolunteerProfileModal = ({ isOpen, onClose, volunteer }) => {
  const { t } = useLanguage();
  if (!volunteer) return null;
const activity = volunteer.activityLogs?.slice(0, 3) || [
  { id: 1, description: 'No recent activity', date: new Date().toLocaleDateString() }
];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('volunteerProfile')}>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 text-3xl rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
              {volunteer.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-2xl font-bold">{volunteer.name}</h3>
            <p className="text-gray-500">{volunteer.email}</p>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">{t('bio')}</h4>
          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{volunteer.bio}</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">{t('skills')}</h4>
          <div className="flex flex-wrap gap-2">
            {volunteer.skills.map(skill => (
              <span key={skill} className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">{skill}</span>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">{t('recentActivity')}</h4>
          <ul className="space-y-2">
            {activity.map(log => (
              <li key={log.id} className="text-sm text-gray-700 p-2 bg-gray-50 rounded-md">
                <span className="font-medium">{log.description}</span> - <span className="text-gray-500">{log.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
}


export const AdminDashboardPage = () => {
    const { t } = useLanguage();
    const [tab, setTab] = useState('analytics');
    const [broadcastMessage, setBroadcastMessage] = useState('');
    const [broadcastAudience, setBroadcastAudience] = useState('ALL_USERS');
    const [broadcasts, setBroadcasts] = useState([]);
    const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
    const [newResource, setNewResource] = useState({ name: '', category: 'Food', quantity: 0, location: '' });
    const [incidents, setIncidents] = useState([]);
    const [resources, setResources] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState('');
    const [isVolunteerProfileModalOpen, setVolunteerProfileModalOpen] = useState(false);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [isAssignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState(null);

    useEffect(() => {
        const fetchAllAdminData = async () => {
            try {
                setLoading(true);
                const [incidentsRes, resourcesRes, usersRes, broadcastsRes] = await Promise.all([
                    axios.get('/api/incidents'),
                    axios.get('/api/resources'),
                    axios.get('/api/users'),
                    axios.get('/api/broadcasts')
                ]);
                setIncidents(incidentsRes.data);
                setResources(resourcesRes.data);
                setBroadcasts(broadcastsRes.data);
                if (Array.isArray(usersRes.data)) {
                    setVolunteers(usersRes.data.filter(user => user.role === 'VOLUNTEER'));
                } else {
                    setVolunteers([]);
                }
            } catch (error) {
                console.error("Failed to fetch admin data:", error);
                setToastMessage('Error: Could not load dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchAllAdminData();
    }, []);

    useEffect(() => {
        if(toastMessage){
            const timer = setTimeout(() => setToastMessage(''), 4000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage])
useEffect(() => {
    if (tab === 'liveMap') {
        console.log("Live Map tab is active. Forcing map to resize.");
        // Increased timeout to ensure tab transition animation is complete
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 350); // Increased delay from 100ms
    }
}, [tab]);

 const handleQuantityChange = async (resourceId, change) => {
    // Find the current resource to calculate the new quantity
    const resource = resources.find(r => r._id === resourceId);
    if (!resource) return;

    const newQuantity = Math.max(0, resource.quantity + change);

    try {
      // Send the update request to the backend
      const { data: updatedResource } = await axios.put(
        `/api/resources/${resourceId}`, 
        { quantity: newQuantity }
      );

      // Update the state locally for an instant UI update
      setResources(prevResources => 
        prevResources.map(res => 
          res._id === resourceId ? updatedResource : res
        )
      );
      setToastMessage(`Updated ${updatedResource.name} quantity.`);

    } catch (error) {
      console.error("Failed to update resource quantity:", error);
      setToastMessage('Error: Could not update resource.');
    }
  };

  const handleAddNewResource = async (e) => {
    e.preventDefault();
    try {
      const { data: createdResource } = await axios.post('/api/resources', newResource);
      
      // Add the new resource to our state and reset the form
      setResources([createdResource, ...resources]);
      setIsResourceModalOpen(false);
      setNewResource({ name: '', category: 'Food', quantity: 0, location: '' });
      setToastMessage('New resource added successfully!');

    } catch (error) {
      console.error("Failed to add resource:", error);
      setToastMessage(error.response?.data?.message || 'Failed to add resource.');
    }
  };

  const handleSendBroadcast = async (e) => {
        e.preventDefault();
        if (!broadcastMessage.trim()) {
            setToastMessage('Error: Broadcast message cannot be empty.');
            return;
        }
        try {
            const { data: newBroadcast } = await axios.post('/api/broadcasts', {
                message: broadcastMessage,
                targetAudience: broadcastAudience,
            });
            setBroadcasts([newBroadcast, ...broadcasts]);
            setBroadcastMessage('');
            setToastMessage('Broadcast sent successfully!');
        } catch (error) {
            console.error("Failed to send broadcast:", error);
            setToastMessage(error.response?.data?.message || 'Failed to send broadcast.');
        }
    };

    const handleSuspend = async (volunteer) => {
        const suspendStatus = !volunteer.isSuspended;
        if (window.confirm(`Are you sure you want to ${suspendStatus ? 'suspend' : 'unsuspend'} ${volunteer.name}?`)) {
            try {
                await axios.put(`/api/users/${volunteer._id}/status`, { isSuspended: suspendStatus });
                setVolunteers(prev => prev.map(v => 
                  v._id === volunteer._id ? { ...v, isSuspended: suspendStatus } : v
                ));
                setToastMessage(`${volunteer.name} has been ${suspendStatus ? 'suspended' : 'unsuspended'}.`);
            } catch (error) {
                console.error('Failed to update volunteer status:', error);
                setToastMessage('Error: Could not update volunteer status.');
            }
        }
    };
const handleMessage = (volunteer) => {
    // This will open the user's default email app
    window.location.href = `mailto:${volunteer.email}`;
};
  
  const handleViewProfile = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setVolunteerProfileModalOpen(true);
  }

 
  const handleBroadcastRequest = (alert) => {
    setSelectedAlert(alert);
    setAssignModalOpen(true);
  };
  
  
  const confirmBroadcastAssignment = () => {
    setAssignModalOpen(false);
    setToastMessage(t('taskBroadcasted'));

    // Update alert status to 'pending'
    setAlerts(prev => prev.map(a => a.id === selectedAlert.id ? { ...a, assignmentStatus: 'pending' } : a));

    // Simulate a volunteer accepting the task after a delay
    setTimeout(() => {
        const availableVolunteers = volunteers.filter(v => v.isAvailable && !v.isSuspended);
        
        if (availableVolunteers.length > 0) {
            const assignedVolunteer = availableVolunteers[Math.floor(Math.random() * availableVolunteers.length)];
            
            // Update volunteer's status
            setVolunteers(prev => prev.map(v => v.id === assignedVolunteer.id ? { ...v, isAvailable: false } : v));
            
            // Update alert's status
            setAlerts(prev => prev.map(a => a.id === selectedAlert.id ? { ...a, assignmentStatus: 'assigned', assignedTo: assignedVolunteer.name } : a));

            setToastMessage(t('volunteerAcceptedTask', { name: assignedVolunteer.name, type: selectedAlert.type }));
        } else {
            setToastMessage(t('noVolunteersAvailableToAccept'));
            setAlerts(prev => prev.map(a => a.id === selectedAlert.id ? { ...a, assignmentStatus: 'unassigned' } : a));
        }
        setSelectedAlert(null);
    }, 5000); // 5-second delay
  }
  
  const availableVolunteers = volunteers.filter(v => v.isAvailable && !v.isSuspended);
  const lowStockResources = useMemo(() => resources.filter(r => r.status === 'Low'), [resources]);
  const highPriorityAlerts = useMemo(() => incidents.filter(i => i.urgency === 'HIGH' && !i.assignedTo), [incidents]);
  
 const IncidentBreakdown = ({ incidents }) => { // Now accepts incidents as a prop
    const incidentData = useMemo(() => {
      const counts = incidents.reduce((acc, req) => {
        acc[req.type] = (acc[req.type] || 0) + 1;
        return acc;
      }, {});
      const total = incidents.length;
      return Object.entries(counts).map(([type, count]) => ({
        type,
        count,
        percentage: total > 0 ? ((count / total) * 100).toFixed(1) : 0,
      }));
    }, [incidents]);
    
    const colors = ['#d93025', '#f9ab00', '#1a73e8', '#1e8e3e'];
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">{t('incidentBreakdown')}</h3>
        <div className="flex flex-col md:flex-row items-center justify-around gap-6">
          <Enhanced3DPieChart data={incidentData} colors={colors} />
          <div className="mt-4 md:mt-0">
            <ul className="space-y-2">
              {incidentData.map((item, index) => (
                <li key={item.type} className="flex items-center">
                  <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: colors[index % colors.length] }}></span>
                  <span>{item.type}: <strong>{item.percentage}%</strong> ({item.count})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };
  
  const HistoricalChart = ({ title, data, color }) => {
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const width = 300;
    const height = 150;
    const padding = 30;
    const maxValue = Math.max(...data.map(d => d.value));
    const xScale = (width - 2 * padding) / (data.length > 1 ? data.length - 1 : 1);
    const yScale = maxValue > 0 ? (height - 2 * padding) / maxValue : 0;
    
    const points = data.map((d, i) => ({
      x: padding + i * xScale,
      y: height - padding - d.value * yScale,
      ...d,
    }));
    
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="font-bold mb-4">{title}</h4>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          <defs>
            <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
              <stop offset="100%" stopColor={color} stopOpacity="0"/>
            </linearGradient>
          </defs>
          
          {[0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1={padding}
              y1={height - padding - maxValue * yScale * ratio}
              x2={width - padding}
              y2={height - padding - maxValue * yScale * ratio}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          <path
            d={`${pathD} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`}
            fill={`url(#gradient-${title})`}
          />
          
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {points.map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x}
                cy={point.y}
                r={hoveredPoint === i ? 6 : 4}
                fill="white"
                stroke={color}
                strokeWidth="3"
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              {hoveredPoint === i && (
                <>
                  <rect x={point.x - 25} y={point.y - 35} width="50" height="25" fill="white" stroke={color} strokeWidth="2" rx="4" />
                  <text x={point.x} y={point.y - 20} textAnchor="middle" className="text-xs font-bold" fill={color}>{point.value}</text>
                </>
              )}
            </g>
          ))}
        </svg>
      </div>
    );
  };
  
  const HighPriorityAlerts = ({ alerts, onBroadcast }) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">{t('highPriorityAlerts')}</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {alerts.length > 0 ? alerts.map((alert, index) => (
            <div 
              key={alert._id} 
              className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg hover:shadow-md transition-shadow"
              style={{ animation: `slideInRight 0.4s ease-out ${index * 0.1}s both` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-red-800">{alert.type} Request</p>
                  <p className="text-sm text-red-700 mt-1">{alert.description}</p>
                </div>
                {alert.assignmentStatus === 'assigned' ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-600 text-white ml-4">
                    {t('assigned')}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-600 text-white ml-4">
                    {t('urgent')}
                  </span>
                )}
              </div>

               {alert.assignmentStatus === 'assigned' ? (
                 <div className="mt-3 text-sm font-semibold text-gray-700 bg-green-100 p-2 rounded-md">
                   {t('assignedTo')}: {alert.assignedTo}
                 </div>
               ) : (
                <button 
                  onClick={() => onBroadcast(alert)}
                  disabled={alert.assignmentStatus === 'pending'}
                  className="w-full mt-3 py-2 px-4 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-wait"
                >
                  {alert.assignmentStatus === 'pending' ? t('pendingAcceptance') : t('broadcastTask')}
                </button>
               )}
            </div>
          )) : (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">✓</div>
              <p className="text-gray-500">{t('noHighPriorityAlerts')}</p>
            </div>
          )}
        </div>
      </div>
    );
  };


   if (loading) {
        return <div className="p-6 text-center text-xl">Loading Admin Dashboard...</div>;
    }
  
      return (
        <div className="min-h-screen bg-gray-50 p-6">
            <style>{`
                @keyframes slideInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideInRight { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
            `}</style>
            
            {toastMessage && (
                <div className="fixed top-6 right-6 bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg z-50" style={{ animation: 'slideInRight 0.3s ease-out' }}>
                    <div className="flex items-center"><span className="text-xl mr-2">✓</span>{toastMessage}</div>
                </div>
            )}


      <VolunteerProfileModal isOpen={isVolunteerProfileModalOpen} onClose={() => setVolunteerProfileModalOpen(false)} volunteer={selectedVolunteer} />

      <Modal isOpen={isAssignModalOpen} onClose={() => setAssignModalOpen(false)} title={t('confirmBroadcast')}>
        <div>
          <p className="text-gray-600 mb-6">{t('confirmBroadcastTaskMessage', {type: selectedAlert?.type})}</p>
          <div className="flex justify-end gap-4">
            <button onClick={() => setAssignModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-lg">{t('cancel')}</button>
            <button onClick={confirmBroadcastAssignment} className="px-4 py-2 bg-brand-blue text-white rounded-lg">{t('confirmSend')}</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isResourceModalOpen} onClose={() => setIsResourceModalOpen(false)} title="Add New Resource">
        <form onSubmit={handleAddNewResource} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Resource Name</label>
            <input 
              type="text" 
              required
              value={newResource.name}
              onChange={(e) => setNewResource({...newResource, name: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select 
              value={newResource.category}
              onChange={(e) => setNewResource({...newResource, category: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option>Food</option>
              <option>Medical</option>
              <option>Shelter</option>
              <option>Clothing</option>
              <option>Tools</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input 
              type="number" 
              required
              value={newResource.quantity}
              onChange={(e) => setNewResource({...newResource, quantity: parseInt(e.target.value)})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input 
              type="text" 
              required
              value={newResource.location}
              onChange={(e) => setNewResource({...newResource, location: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Central Warehouse"
            />
          </div>
          <Button type="submit" className="w-full">Add Resource</Button>
        </form>
      </Modal>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('adminDashboard')}</h1>
        <p className="text-gray-600">{t('adminDashboardSubtitle')}</p>
      </div>
      
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8" aria-label="Tabs">
          {[
            { id: 'analytics', label: t('analyticsInsights'), icon: '📊' },
            { id: 'liveMap', label: t('liveMap'), icon: '🗺️' },
            { id: 'volunteers', label: t('volunteerManagement'), icon: '👥' },
            { id: 'resources', label: t('resourceManagement'), icon: '📦' },
            { id: 'broadcast', label: t('broadcastAlert'), icon: '📢' },
          ].map((tabItem) => (
            <button
              key={tabItem.id}
              onClick={() => setTab(tabItem.id)}
              className={`flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                tab === tabItem.id
                  ? 'border-brand-blue text-brand-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tabItem.icon}</span>
              {tabItem.label}
            </button>
          ))}
        </nav>
      </div>
      
      <div>
                {tab === 'analytics' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <AnimatedStatCard title={t('activeIncidents')} value={incidents.length} icon="⚠️" />
                      <AnimatedStatCard title={t('availableVolunteers')} value={availableVolunteers.length} icon="❤️" />
                      <AnimatedStatCard title={t('resourcesLow')} value={lowStockResources.length} icon="📦" />
                      <AnimatedStatCard title={t('totalUsers')} value={volunteers.length} icon="👥" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                           <IncidentBreakdown incidents={incidents} />
                           {/* ... Your Historical charts using mock data ... */}
                        </div>
                      <HighPriorityAlerts alerts={highPriorityAlerts} onBroadcast={handleBroadcastRequest} />
                    </div>
                  </div>
                )}
{tab === 'liveMap' && (
  <div className="bg-white rounded-lg shadow-md p-6" style={{ minHeight: '600px' }}>
    <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('liveIncidentMap')}</h2>
    <div style={{ height: '500px' }}>
      <InteractiveMap incidents={incidents} />
    </div>
  </div>
)}    
  {tab === 'volunteers' && (
  <EnhancedVolunteerTable 
    volunteers={volunteers} 
    onMessage={handleMessage}
    onSuspend={handleSuspend}
    onViewProfile={handleViewProfile}
  />
)}    
                {tab === 'resources' && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">{t('resourceInventory')}</h2>
                      <button onClick={() => setIsResourceModalOpen(true)} className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-dark">
                        + {t('addNewResource')}
                      </button>
                    </div>
                   <EnhancedResourceTable resources={resources} onQuantityChange={handleQuantityChange}/>
                  </div>
                )}
                
                {tab === 'broadcast' && (
                  <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('broadcastAlertSystem')}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <form className="space-y-4" onSubmit={handleSendBroadcast}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('targetAudience')}</label>
                  <select 
                    value={broadcastAudience} 
                    onChange={(e) => setBroadcastAudience(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue bg-white"
                  >
                    <option value="ALL_USERS">All Users</option>
                    <option value="ALL_VOLUNTEERS">All Volunteers</option>
                    <option value="ADMINS_ONLY">Administrators Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('message')}</label>
                  <textarea 
                    rows={6} 
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue" 
                    placeholder={t('typeYourMessage')}
                  ></textarea>
                </div>
                <button type="submit" className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors">
                  {t('sendBroadcast')}
                </button>
              </form>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">{t('broadcastHistory')}</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {broadcasts.length > 0 ? broadcasts.map(b => (
                  <div key={b._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="font-medium text-gray-900">{b.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Sent to: {b.targetAudience} on {new Date(b.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )) : (
                  <p className="text-gray-500">No broadcasts sent yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
        
      </div>
    </div>
    );
};
