import { Site, Vehicle, BlacklistVehicle, CameraDevice, IoTDevice, Role, UserAccount, PricingConfig } from '../types';

// --- SEED DATA ---

const SEED_SITES: Site[] = [
  { 
    id: 'SITE-01', name: 'Weihu Main Plaza A', address: '123 Tech Avenue, District 1', 
    capacityCar: 500, capacityMoto: 1200, occupiedCar: 412, occupiedMoto: 850, 
    status: 'Online', cameras: 12, barriers: 4, 
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'SITE-02', name: 'Weihu Tower B (Hầm)', address: '456 Innovation Rd, District 3', 
    capacityCar: 200, capacityMoto: 500, occupiedCar: 45, occupiedMoto: 120, 
    status: 'Online', cameras: 6, barriers: 2, 
    image: 'https://images.unsplash.com/photo-1590674899505-245784c9cc57?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 'SITE-03', name: 'West Lake Campus (Ngoài trời)', address: '789 Lake View, Tay Ho', 
    capacityCar: 800, capacityMoto: 2000, occupiedCar: 0, occupiedMoto: 0, 
    status: 'Offline', cameras: 24, barriers: 8, 
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=800' 
  },
];

const SEED_VEHICLES: Vehicle[] = [
  { id: 'V-001', plate: '59T1-123.45', owner: 'Nguyễn Văn A', phone: '0909123456', type: 'Car', plan: 'VIP', expiryDate: '2024-12-31', status: 'Active' },
  { id: 'V-002', plate: '29A-999.88', owner: 'Trần Thị B', phone: '0912333444', type: 'Car', plan: 'Monthly', expiryDate: '2023-11-05', status: 'Expiring Soon' },
  { id: 'V-003', plate: '51H-456.78', owner: 'Lê Văn C', phone: '0988777666', type: 'Motorbike', plan: 'Resident', expiryDate: '2023-10-01', status: 'Expired' },
];

const SEED_BLACKLIST: BlacklistVehicle[] = [
  { id: 'BL-01', plate: '30X-111.11', reason: 'Nợ phí kéo dài', addedBy: 'Admin', date: '2023-10-01' },
  { id: 'BL-02', plate: '60Z-999.99', reason: 'Gây rối trật tự', addedBy: 'Security', date: '2023-09-15' },
];

const SEED_CAMERAS: CameraDevice[] = [
  { id: 'CAM-01', name: 'Cổng Chính (LPR In)', ip: '192.168.1.101', port: '554', rtspUrl: 'rtsp://192.168.1.101/stream1', status: 'Online', model: 'Hikvision ANPR', type: 'LPR', image: 'https://images.unsplash.com/photo-1621929747188-0b4dc28498d2?auto=format&fit=crop&q=80&w=800' },
  { id: 'CAM-02', name: 'Cổng Ra (LPR Out)', ip: '192.168.1.102', port: '554', rtspUrl: 'rtsp://192.168.1.102/stream1', status: 'Online', model: 'Dahua AI', type: 'LPR', image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=800' },
  { id: 'CAM-03', name: 'Toàn cảnh Hầm B1', ip: '192.168.1.103', port: '554', rtspUrl: 'rtsp://192.168.1.103/stream1', status: 'Online', model: 'KBVision PTZ', type: 'Overview', image: 'https://images.unsplash.com/photo-1470224114660-3f6686c562eb?auto=format&fit=crop&q=80&w=800' },
  { id: 'CAM-04', name: 'Sảnh Chờ Thang Máy', ip: '192.168.1.104', port: '8000', rtspUrl: 'rtsp://192.168.1.104/live', status: 'Offline', model: 'Ezviz', type: 'Overview', image: 'https://images.unsplash.com/photo-1565514020125-9a888566b577?auto=format&fit=crop&q=80&w=800' },
];

const SEED_IOT: IoTDevice[] = [
  { id: 'BAR-01', name: 'Barrier Controller In', type: 'PLC', status: 'Online' },
  { id: 'LED-01', name: 'Matrix Display', type: 'LED', status: 'Online' },
];

const SEED_ROLES: Role[] = [
  { id: 'admin', name: 'Super Admin', description: 'Quyền truy cập toàn bộ hệ thống', permissions: ['ALL'], userCount: 2, isSystem: true },
  { id: 'operator', name: 'Vận hành viên', description: 'Giám sát làn xe và xử lý sự cố cơ bản', permissions: ['live.view', 'live.control', 'live.incident', 'vehicles.view'], userCount: 8 },
  { id: 'accountant', name: 'Kế toán', description: 'Xem báo cáo và quản lý doanh thu', permissions: ['dashboard.view', 'dashboard.export', 'vehicles.view', 'pricing.view'], userCount: 1 },
];

const SEED_USERS: UserAccount[] = [
  { id: 'U-01', name: 'Nguyễn Quản Trị', email: 'admin@weihu.com', role: 'admin', status: 'Online', lastLogin: 'Vừa xong' },
  { id: 'U-02', name: 'Trần Vận Hành', email: 'operator1@weihu.com', role: 'operator', status: 'Offline', lastLogin: '2 giờ trước' },
];

const SEED_PRICING: PricingConfig = {
  guestCarFirst2h: 25000,
  guestCarNext1h: 10000,
  guestCarOvernight: 100000,
  guestMotoFirst2h: 5000,
  guestMotoNext1h: 2000,
  guestMotoOvernight: 30000,
  monthlyCar: 1500000,
  monthlyMoto: 120000,
};

// --- KEYS ---
const K = {
  SITES: 'weihu_sites_v1',
  VEHICLES: 'weihu_vehicles_v1',
  BLACKLIST: 'weihu_blacklist_v1',
  CAMERAS: 'weihu_cameras_v1',
  IOT: 'weihu_iot_v1',
  ROLES: 'weihu_roles_v1',
  USERS: 'weihu_users_v1',
  PRICING: 'weihu_pricing_v1',
};

// --- HELPER FUNCTIONS ---

function get<T>(key: string, seed: T): T {
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return seed;
  }
}

function set<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

// --- DATA STORE API ---

export const DataStore = {
  sites: {
    getAll: () => get<Site[]>(K.SITES, SEED_SITES),
    save: (item: Site) => {
      const items = get<Site[]>(K.SITES, SEED_SITES);
      const index = items.findIndex(i => i.id === item.id);
      if (index >= 0) items[index] = item;
      else items.push(item);
      set(K.SITES, items);
    },
    delete: (id: string) => {
      const items = get<Site[]>(K.SITES, SEED_SITES);
      set(K.SITES, items.filter(i => i.id !== id));
    }
  },
  vehicles: {
    getAll: () => get<Vehicle[]>(K.VEHICLES, SEED_VEHICLES),
    save: (item: Vehicle) => {
      const items = get<Vehicle[]>(K.VEHICLES, SEED_VEHICLES);
      const index = items.findIndex(i => i.id === item.id);
      if (index >= 0) items[index] = item;
      else items.push(item);
      set(K.VEHICLES, items);
    },
    delete: (id: string) => {
      const items = get<Vehicle[]>(K.VEHICLES, SEED_VEHICLES);
      set(K.VEHICLES, items.filter(i => i.id !== id));
    }
  },
  blacklist: {
    getAll: () => get<BlacklistVehicle[]>(K.BLACKLIST, SEED_BLACKLIST),
    save: (item: BlacklistVehicle) => {
      const items = get<BlacklistVehicle[]>(K.BLACKLIST, SEED_BLACKLIST);
      const index = items.findIndex(i => i.id === item.id);
      if (index >= 0) items[index] = item;
      else items.push(item);
      set(K.BLACKLIST, items);
    },
    delete: (id: string) => {
      const items = get<BlacklistVehicle[]>(K.BLACKLIST, SEED_BLACKLIST);
      set(K.BLACKLIST, items.filter(i => i.id !== id));
    }
  },
  cameras: {
    getAll: () => get<CameraDevice[]>(K.CAMERAS, SEED_CAMERAS),
    save: (item: CameraDevice) => {
      const items = get<CameraDevice[]>(K.CAMERAS, SEED_CAMERAS);
      const index = items.findIndex(i => i.id === item.id);
      if (index >= 0) items[index] = item;
      else items.push(item);
      set(K.CAMERAS, items);
    },
    delete: (id: string) => {
      const items = get<CameraDevice[]>(K.CAMERAS, SEED_CAMERAS);
      set(K.CAMERAS, items.filter(i => i.id !== id));
    }
  },
  iot: {
    getAll: () => get<IoTDevice[]>(K.IOT, SEED_IOT),
    // ... basic CRUD if needed
  },
  roles: {
    getAll: () => get<Role[]>(K.ROLES, SEED_ROLES),
    save: (item: Role) => {
      const items = get<Role[]>(K.ROLES, SEED_ROLES);
      const index = items.findIndex(i => i.id === item.id);
      if (index >= 0) items[index] = item;
      else items.push(item);
      set(K.ROLES, items);
    },
    delete: (id: string) => {
      const items = get<Role[]>(K.ROLES, SEED_ROLES);
      set(K.ROLES, items.filter(i => i.id !== id));
    }
  },
  users: {
    getAll: () => get<UserAccount[]>(K.USERS, SEED_USERS),
    save: (item: UserAccount) => {
      const items = get<UserAccount[]>(K.USERS, SEED_USERS);
      const index = items.findIndex(i => i.id === item.id);
      if (index >= 0) items[index] = item;
      else items.push(item);
      set(K.USERS, items);
    },
    delete: (id: string) => {
      const items = get<UserAccount[]>(K.USERS, SEED_USERS);
      set(K.USERS, items.filter(i => i.id !== id));
    }
  },
  pricing: {
    get: () => get<PricingConfig>(K.PRICING, SEED_PRICING),
    save: (config: PricingConfig) => set(K.PRICING, config),
    reset: () => set(K.PRICING, SEED_PRICING)
  }
};
