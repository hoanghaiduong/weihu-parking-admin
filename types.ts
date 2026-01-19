export enum VehicleType {
  CAR = 'Car',
  MOTORBIKE = 'Motorbike',
  TRUCK = 'Truck'
}

export enum SessionStatus {
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
  ISSUE = 'Issue'
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
}

export interface ActivityLog {
  id: string;
  time: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}