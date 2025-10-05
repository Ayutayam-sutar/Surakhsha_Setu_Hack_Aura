
export enum Role {
  USER = 'USER',
  VOLUNTEER = 'VOLUNTEER',
  ADMIN = 'ADMIN'
}
export enum SafetyStatus {
    SAFE = 'Safe',
    NEEDS_HELP = 'Needs Help',
    UNKNOWN = 'Unknown'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  contact?: string;
  emergencyContact?: string;
  bio?: string; // For volunteers to describe their skills/experience
  isAvailable?: boolean; // For volunteers
  safetyStatus?: { status: SafetyStatus, timestamp: string };
}

export enum MapPinType {
  SAFE_LOCATION = 'safe_location',
  INCIDENT = 'incident',
  VOLUNTEER = 'volunteer'
}

export interface MapPin {
  id: number;
  type: MapPinType;
  position: { top: string; left: string };
  title: string;
  details: string;
  extra?: string; // e.g., beds available, volunteer skills
}

export enum UrgencyLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface HelpRequest {
  id: string;
  type: string;
  location: string;
  urgency: UrgencyLevel;
  description: string;
  user: Pick<User, 'name'>;
}

export interface ActivityLog {
  id: string;
  date: string;
  description: string;
  type: 'incident_report' | 'assignment_completed';
}

export interface NotificationItem {
  id: number;
  message: string;
  timestamp: string;
}

export interface SafetyCheckContact {
    id: string;
    name: string;
    avatarUrl: string;
    status: SafetyStatus;
    lastUpdate: string;
}

export interface TrainingModule {
    id: string;
    title: string;
    description: string;
    progress: number; // 0-100
    badgeIcon: string;
}

export interface ResourceItem {
    id: string;
    shelterLocation: string;
    item: string;
    quantity: number;
    status: 'In Stock' | 'Low' | 'Out of Stock';
}