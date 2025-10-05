import { MapPinType, UrgencyLevel, SafetyStatus,Role } from './types';
export const MAP_PINS = [
  {
    id: 1,
    type: MapPinType.SAFE_LOCATION,
    position: [20.2961, 85.8245], // Lat, Lon for a location in Bhubaneswar
    title: 'Community Shelter - KIIT',
    details: 'Open to all residents. Food and water available.',
    extra: 'Capacity: 75%',
  },
  {
    id: 2,
    type: MapPinType.INCIDENT,
    position: [20.2709, 85.8412], // Near Patia
    title: 'Road Blocked',
    details: 'Fallen tree blocking the main road near Infocity Square.',
    extra: 'Reported 15m ago',
  },
  {
    id: 3,
    type: MapPinType.VOLUNTEER,
    position: [20.3121, 85.8335], // Near Nandankanan Road
    title: 'Volunteer: Anjali Sharma',
    details: 'Available for medical assistance and supply transport.',
  }
];

export const HELP_REQUESTS = [
  { id: 'req1', type: 'Medical', location: '123 Oak Ave', urgency: 'HIGH', description: 'Elderly person needs urgent medical attention.', user: { name: 'Alice' }, assignmentStatus: 'unassigned', assignedTo: null },
  { id: 'req2', type: 'Food', location: 'Sector 5', urgency: 'MEDIUM', description: 'Family of four without food supplies.', user: { name: 'Bob' }, assignmentStatus: 'unassigned', assignedTo: null },
  { id: 'req3', type: 'Rescue', location: 'Riverbank area', urgency: 'HIGH', description: 'Stranded due to rising water levels.', user: { name: 'Charlie' }, assignmentStatus: 'unassigned', assignedTo: null },
  { id: 'req4', type: 'Medical', location: 'Downtown Apt 3B', urgency: 'HIGH', description: 'Child has high fever and difficulty breathing.', user: { name: 'Diana' }, assignmentStatus: 'unassigned', assignedTo: null },
];

export const USER_ACTIVITY_LOGS = [
  { id: 'act1', date: '2024-07-30', description: 'Reported: Power outage at Downtown.', type: 'incident_report' },
  { id: 'act2', date: '2024-07-29', description: 'Reported: Minor flooding on 4th St.', type: 'incident_report' },
];

export const VOLUNTEER_ACTIVITY_LOGS = [
  { id: 'act3', date: '2024-07-30', description: 'Completed: Delivered supplies to Sector 5.', type: 'assignment_completed' },
  { id: 'act4', date: '2024-07-29', description: 'Completed: Assisted in evacuation at Riverbank.', type: 'assignment_completed' },
  { id: 'act5', date: '2024-07-28', description: 'Completed: First aid assistance at City General Hospital.', type: 'assignment_completed' },
  { id: 'act6', date: '2024-07-27', description: 'Completed: Transported family to Community Shelter.', type: 'assignment_completed' },
];

export const NOTIFICATIONS = [
  { id: 1, message: "New incident reported in Sector 5.", timestamp: "2m ago" },
  { id: 2, message: "Volunteer Jane accepted a request.", timestamp: "5m ago" },
  { id: 3, message: "Community Shelter now at 80% capacity.", timestamp: "10m ago" },
  { id: 4, message: "Heavy rainfall expected in the next hour.", timestamp: "12m ago" },
];

export const SAFETY_CONTACTS = [
  { id: 'sc1', name: 'Mom', avatarUrl: 'https://i.pravatar.cc/150?u=mom', status: 'SAFE', lastUpdate: '25m ago' },
  { id: 'sc2', name: 'John (Spouse)', avatarUrl: 'https://i.pravatar.cc/150?u=john', status: 'SAFE', lastUpdate: '1h ago' },
  { id: 'sc3', name: 'Dr. Emily', avatarUrl: 'https://i.pravatar.cc/150?u=emily', status: 'NEEDS_HELP', lastUpdate: '3h ago' },
  { id: 'sc4', name: 'Neighbor Dave', avatarUrl: 'https://i.pravatar.cc/150?u=dave', status: 'UNKNOWN', lastUpdate: '1d ago' },
];

export const TRAINING_MODULES = [
  { id: 'tm1', title: 'Basic First Aid', description: 'Learn essential first aid techniques for common injuries.', progress: 100, badgeIcon: '🩹' },
  { id: 'tm2', title: 'Flood Response Protocols', description: 'Understand how to act safely and effectively during a flood.', progress: 75, badgeIcon: '🌊' },
  { id: 'tm3', title: 'Shelter Management', description: 'Basics of organizing and managing an emergency shelter.', progress: 20, badgeIcon: '⛺' },
  { id: 'tm4', title: 'Psychological First Aid', description: 'Provide mental and emotional support to those in distress.', progress: 0, badgeIcon: '🧠' },
];

export const ADMIN_RESOURCES = [
  { id: 'res1', shelterLocation: 'Community Shelter', item: 'Water Bottles', quantity: 500, status: 'In Stock' },
  { id: 'res2', shelterLocation: 'City General Hospital', item: 'First Aid Kits', quantity: 45, status: 'Low' },
  { id: 'res3', shelterLocation: 'Community Shelter', item: 'Blankets', quantity: 250, status: 'In Stock' },
  { id: 'res4', shelterLocation: 'Northside School Gym', item: 'Cots', quantity: 0, status: 'Out of Stock' },
  { id: 'res5', shelterLocation: 'City General Hospital', item: 'Bandages', quantity: 1500, status: 'In Stock' },
];

export const ADMIN_EMAILS = [
  'admin@safehaven.com',
  'admin2@safehaven.com',
  'admin3@safehaven.com'
];

export const VOLUNTEER_LIST = [
  {
    id: 'vol456',
    name: 'Valerie Volunteer',
    email: 'valerie@safehaven.com',
    role: Role.VOLUNTEER,
    contact: '555-987-6543',
    bio: 'Experienced first-responder with 5+ years in emergency services. Certified in advanced first aid and CPR.',
    isAvailable: true,
    skills: ['First Aid', 'CPR', 'Driving'],
    isSuspended: false,
  },
  {
    id: 'vol789',
    name: 'Mike Smith',
    email: 'mike@safehaven.com',
    role: Role.VOLUNTEER,
    contact: '555-111-2222',
    bio: 'General assistance, speaks Spanish fluently, has a pickup truck for transport.',
    isAvailable: false,
    skills: ['Logistics', 'Spanish', 'Transport'],
    isSuspended: false,
  },
  {
    id: 'vol101',
    name: 'Jane Doe',
    email: 'jane@safehaven.com',
    role: Role.VOLUNTEER,
    contact: '555-333-4444',
    bio: 'Medical professional, certified nurse with pediatric experience.',
    isAvailable: true,
    skills: ['Medical', 'Pediatrics'],
    isSuspended: false,
  },
  {
    id: 'vol112',
    name: 'David Chen',
    email: 'david@safehaven.com',
    role: Role.VOLUNTEER,
    contact: '555-444-5555',
    bio: 'Software engineer, can help with technical support and logistics coordination.',
    isAvailable: true,
    skills: ['Technical Support', 'Coordination'],
    isSuspended: true,
  },
  {
    id: 'vol113',
    name: 'Maria Garcia',
    email: 'maria@safehaven.com',
    role: Role.VOLUNTEER,
    contact: '555-666-7777',
    bio: 'Chef, experienced in managing large kitchens and preparing meals for crowds.',
    isAvailable: false,
    skills: ['Cooking', 'Kitchen Management'],
    isSuspended: false,
  }
];

export const HISTORICAL_DATA = {
  incidents: [
    { label: '7 Days Ago', value: 5 },
    { label: '6 Days Ago', value: 7 },
    { label: '5 Days Ago', value: 6 },
    { label: '4 Days Ago', value: 9 },
    { label: '3 Days Ago', value: 12 },
    { label: '2 Days Ago', value: 15 },
    { label: 'Yesterday', value: 11 },
    { label: 'Today', value: 4 },
  ],
  volunteers: [
    { label: '7 Days Ago', value: 2 },
    { label: '6 Days Ago', value: 3 },
    { label: '5 Days Ago', value: 1 },
    { label: '4 Days Ago', value: 5 },
    { label: '3 Days Ago', value: 4 },
    { label: '2 Days Ago', value: 7 },
    { label: 'Yesterday', value: 6 },
    { label: 'Today', value: 2 },
  ]
};
