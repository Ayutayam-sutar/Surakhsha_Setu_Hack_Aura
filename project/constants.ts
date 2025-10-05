import { MapPin, MapPinType, HelpRequest, UrgencyLevel, ActivityLog, NotificationItem, SafetyCheckContact, SafetyStatus, TrainingModule, ResourceItem } from './types';

export const MAP_PINS: MapPin[] = [
  { id: 1, type: MapPinType.SAFE_LOCATION, position: { top: '25%', left: '30%' }, title: 'City General Hospital', details: 'Emergency services available.', extra: '50 beds available' },
  { id: 2, type: MapPinType.SAFE_LOCATION, position: { top: '60%', left: '70%' }, title: 'Community Shelter', details: 'Open for public.', extra: 'Food & water available' },
  { id: 3, type: MapPinType.INCIDENT, position: { top: '45%', left: '50%' }, title: 'Flood on Main St', details: 'Road blocked, avoid area.', extra: 'Reported 1 hr ago' },
  { id: 4, type: MapPinType.INCIDENT, position: { top: '70%', left: '20%' }, title: 'Fallen Tree', details: 'Power lines down.', extra: 'Reported 30 mins ago' },
  { id: 5, type: MapPinType.VOLUNTEER, position: { top: '35%', left: '65%' }, title: 'Volunteer: Jane Doe', details: 'Medical professional.', extra: 'On standby' },
  { id: 6, type: MapPinType.VOLUNTEER, position: { top: '55%', left: '15%' }, title: 'Volunteer: Mike Smith', details: 'General assistance.', extra: 'Active' },
];

export const HELP_REQUESTS: HelpRequest[] = [
  { id: 'req1', type: 'Medical', location: '123 Oak Ave', urgency: UrgencyLevel.HIGH, description: 'Elderly person needs urgent medical attention.', user: { name: 'Alice' } },
  { id: 'req2', type: 'Food', location: 'Sector 5', urgency: UrgencyLevel.MEDIUM, description: 'Family of four without food supplies.', user: { name: 'Bob' } },
  { id: 'req3', type: 'Rescue', location: 'Riverbank area', urgency: UrgencyLevel.HIGH, description: 'Stranded due to rising water levels.', user: { name: 'Charlie' } },
];

export const USER_ACTIVITY_LOGS: ActivityLog[] = [
    { id: 'act1', date: '2024-07-30', description: 'Reported: Power outage at Downtown.', type: 'incident_report' },
    { id: 'act2', date: '2024-07-29', description: 'Reported: Minor flooding on 4th St.', type: 'incident_report' },
];

export const VOLUNTEER_ACTIVITY_LOGS: ActivityLog[] = [
    { id: 'act3', date: '2024-07-30', description: 'Completed: Delivered supplies to Sector 5.', type: 'assignment_completed' },
    { id: 'act4', date: '2024-07-29', description: 'Completed: Assisted in evacuation at Riverbank.', type: 'assignment_completed' },
];

export const NOTIFICATIONS: NotificationItem[] = [
    { id: 1, message: "New incident reported in Sector 5.", timestamp: "2m ago" },
    { id: 2, message: "Volunteer Jane accepted a request.", timestamp: "5m ago" },
    { id: 3, message: "Community Shelter now at 80% capacity.", timestamp: "10m ago" },
    { id: 4, message: "Heavy rainfall expected in the next hour.", timestamp: "12m ago" },
];

export const SAFETY_CONTACTS: SafetyCheckContact[] = [
    { id: 'sc1', name: 'Mom', avatarUrl: 'https://i.pravatar.cc/150?u=mom', status: SafetyStatus.SAFE, lastUpdate: '25m ago' },
    { id: 'sc2', name: 'John (Spouse)', avatarUrl: 'https://i.pravatar.cc/150?u=john', status: SafetyStatus.SAFE, lastUpdate: '1h ago' },
    { id: 'sc3', name: 'Dr. Emily', avatarUrl: 'https://i.pravatar.cc/150?u=emily', status: SafetyStatus.NEEDS_HELP, lastUpdate: '3h ago' },
    { id: 'sc4', name: 'Neighbor Dave', avatarUrl: 'https://i.pravatar.cc/150?u=dave', status: SafetyStatus.UNKNOWN, lastUpdate: '1d ago' },
];

export const TRAINING_MODULES: TrainingModule[] = [
    { id: 'tm1', title: 'Basic First Aid', description: 'Learn essential first aid techniques for common injuries.', progress: 100, badgeIcon: '🩹' },
    { id: 'tm2', title: 'Flood Response Protocols', description: 'Understand how to act safely and effectively during a flood.', progress: 75, badgeIcon: '🌊' },
    { id: 'tm3', title: 'Shelter Management', description: 'Basics of organizing and managing an emergency shelter.', progress: 20, badgeIcon: '⛺' },
    { id: 'tm4', title: 'Psychological First Aid', description: 'Provide mental and emotional support to those in distress.', progress: 0, badgeIcon: '🧠' },
];

export const ADMIN_RESOURCES: ResourceItem[] = [
    { id: 'res1', shelterLocation: 'Community Shelter', item: 'Water Bottles', quantity: 500, status: 'In Stock' },
    { id: 'res2', shelterLocation: 'City General Hospital', item: 'First Aid Kits', quantity: 45, status: 'Low' },
    { id: 'res3', shelterLocation: 'Community Shelter', item: 'Blankets', quantity: 250, status: 'In Stock' },
    { id: 'res4', shelterLocation: 'Northside School Gym', item: 'Cots', quantity: 0, status: 'Out of Stock' },
    { id: 'res5', shelterLocation: 'City General Hospital', item: 'Bandages', quantity: 1500, status: 'In Stock' },
];

export const ADMIN_EMAILS: string[] = [
    'admin@safehaven.com',
    'admin2@safehaven.com',
    'admin3@safehaven.com'
];