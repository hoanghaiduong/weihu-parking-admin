export enum VehicleType {
  CAR = 'Car',
  MOTORBIKE = 'Motorbike',
  TRUCK = 'Truck'
}

export enum SessionStatus {
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
  ISSUE = 'Issue',
  VIOLATION = 'Violation'
}

export interface ParkingSession {
  id: string;
  plate: string;
  entryTime: string;
  exitTime?: string;
  lane: string;
  status: SessionStatus;
  fee?: number;
  imageUrl: string;
  vehicleType: VehicleType;
  engineDisplacement?: string;
  violationReason?: string;
}

export interface Stats {
  totalSpaces: number;
  occupied: number;
  revenueToday: number;
  alerts: number;
}

export interface Alert {
  id: string;
  type: 'Security' | 'System' | 'Revenue';
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

export interface LprResult {
  plate: string;
  confidence: number;
  vehicleType: VehicleType;
  capturedAt: string;
  isWhitelist: boolean;
  imageUrl?: string;
  engineDisplacement?: string;
  isViolation?: boolean;
  violationReason?: string;
}

export interface ActivityLog {
  id: string;
  time: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

// --- NEW ENTITIES FOR CRUD ---

export interface Site {
  id: string;
  name: string;
  address: string;
  capacityCar: number;
  capacityMoto: number;
  occupiedCar: number;
  occupiedMoto: number;
  status: 'Online' | 'Offline' | 'Maintenance';
  cameras: number;
  barriers: number;
  image: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  owner: string;
  phone: string;
  type: 'Car' | 'Motorbike' | 'Truck';
  plan: 'Monthly' | 'VIP' | 'Resident' | 'Guest';
  expiryDate: string;
  status: 'Active' | 'Expiring Soon' | 'Expired';
}

export interface BlacklistVehicle {
  id: string;
  plate: string;
  reason: string;
  addedBy: string;
  date: string;
}

export interface CameraDevice {
  id: string;
  name: string;
  ip: string;
  port: string;
  username?: string;
  password?: string;
  rtspUrl: string;
  status: 'Online' | 'Offline' | 'Connecting';
  model: string;
  type: 'LPR' | 'Overview' | 'PTZ';
  image: string;
}

export interface IoTDevice {
  id: string;
  name: string;
  type: string;
  status: 'Online' | 'Offline';
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem?: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: string; // references Role.id
  status: 'Online' | 'Offline';
  lastLogin: string;
}

export interface PricingConfig {
  guestCarFirst2h: number;
  guestCarNext1h: number;
  guestCarOvernight: number;
  guestMotoFirst2h: number;
  guestMotoNext1h: number;
  guestMotoOvernight: number;
  monthlyCar: number;
  monthlyMoto: number;
}