import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GlassCard, Button, Badge } from '../components/ui';
import { ArrowLeft, LayoutGrid, Maximize2, Settings, Signal, SignalLow, Video, VideoOff, Activity, RefreshCw } from 'lucide-react';

// --- Types ---
interface Zone {
  id: string;
  name: string;
  cameraCount: number;
}

interface CameraFeed {
  id: string;
  name: string;
  status: 'Online' | 'Offline' | 'Motion';
  image: string;
  fps: number;
}

// --- Mock Data ---
const ZONES: Zone[] = [
  { id: 'all', name: 'Tất cả Camera', cameraCount: 24 },
  { id: 'zone-a', name: 'Khu A (Tầng 1)', cameraCount: 8 },
  { id: 'zone-b', name: 'Khu B (Hầm B1)', cameraCount: 8 },
  { id: 'gates', name: 'Cổng Ra/Vào', cameraCount: 4 },
  { id: 'perimeters', name: 'Hàng rào & Ngoài trời', cameraCount: 4 },
];

const CAM_IMAGES = [
  'https://images.unsplash.com/photo-1590674899505-245784c9cc57?auto=format&fit=crop&q=80&w=600', // Parking
  'https://images.unsplash.com/photo-1470224114660-3f6686c562eb?auto=format&fit=crop&q=80&w=600', // Garage
  'https://images.unsplash.com/photo-1621929747188-0b4dc28498d2?auto=format&fit=crop&q=80&w=600', // Entry
  'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80&w=600', // Wide
  'https://images.unsplash.com/photo-1565514020125-9a888566b577?auto=format&fit=crop&q=80&w=600', // Hallway
  'https://images.unsplash.com/photo-1587304723147-320d77d70428?auto=format&fit=crop&q=80&w=600', // Dark Garage
];

export const SiteDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeZone, setActiveZone] = useState('all');
  const [cameras, setCameras] = useState<CameraFeed[]>([]);
  const [gridSize, setGridSize] = useState<3 | 4 | 5>(4); // Columns

  // Simulate loading cameras based on zone
  useEffect(() => {
    const generateCameras = () => {
      const count = activeZone === 'all' ? 24 : activeZone === 'gates' ? 4 : 8;
      const newCams: CameraFeed[] = Array.from({ length: count }).map((_, i) => ({
        id: `CAM-${activeZone}-${i + 1}`,
        name: activeZone === 'gates' ? `Gate Cam ${i+1}` : `Zone Cam ${i+1}`,
        status: Math.random() > 0.9 ? 'Offline' : Math.random() > 0.7 ? 'Motion' : 'Online',
        image: CAM_IMAGES[i % CAM_IMAGES.length],
        fps: Math.floor(Math.random() * (30 - 15) + 15)
      }));
      setCameras(newCams);
    };

    generateCameras();
  }, [activeZone]);

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] animate-fade-in gap-4">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={() => navigate('/sites')} className="aspect-square p-0 w-10 h-10 rounded-full flex items-center justify-center">
             <ArrowLeft size={20} />
          </Button>
          <div>
             <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
               THU Main Plaza A <span className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-600 border border-green-500/20">ONLINE</span>
             </h2>
             <p className="text-gray-500 dark:text-gray-400 text-sm">Giám sát trực tiếp • 123 Tech Avenue</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <div className="bg-gray-100 dark:bg-white/5 p-1 rounded-lg border border-gray-200 dark:border-white/10 flex">
              <button onClick={() => setGridSize(3)} className={`p-1.5 rounded transition-all ${gridSize === 3 ? 'bg-white dark:bg-gray-700 shadow text-primary-500' : 'text-gray-400'}`}><LayoutGrid size={16}/></button>
              <button onClick={() => setGridSize(4)} className={`p-1.5 rounded transition-all ${gridSize === 4 ? 'bg-white dark:bg-gray-700 shadow text-primary-500' : 'text-gray-400'}`}><LayoutGrid size={20}/></button>
              <button onClick={() => setGridSize(5)} className={`p-1.5 rounded transition-all ${gridSize === 5 ? 'bg-white dark:bg-gray-700 shadow text-primary-500' : 'text-gray-400'}`}><LayoutGrid size={24}/></button>
           </div>
           <Button variant="primary" className="shadow-lg shadow-primary-500/20"><Settings size={16}/> Cấu hình Site</Button>
        </div>
      </div>

      {/* Main Content: Tabs + Grid */}
      <GlassCard className="flex-1 flex flex-col min-h-0 p-0 overflow-hidden">
         
         {/* Zone Tabs (Horizontal Scroll) */}
         <div className="flex items-center gap-2 p-2 border-b border-gray-200 dark:border-white/10 overflow-x-auto bg-gray-50/50 dark:bg-black/20 shrink-0 custom-scrollbar">
            {ZONES.map(zone => (
               <button
                 key={zone.id}
                 onClick={() => setActiveZone(zone.id)}
                 className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap
                    ${activeZone === zone.id 
                       ? 'bg-white dark:bg-gray-800 text-primary-500 shadow-md border border-gray-100 dark:border-white/5' 
                       : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                    }
                 `}
               >
                  <Video size={16} className={activeZone === zone.id ? 'fill-current' : ''} />
                  {zone.name}
                  <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${activeZone === zone.id ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-600'}`}>
                     {zone.cameraCount}
                  </span>
               </button>
            ))}
         </div>

         {/* Camera Grid (Scrollable Area) */}
         <div className="flex-1 overflow-y-auto p-4 bg-gray-100 dark:bg-black/40 custom-scrollbar">
            <div className={`grid gap-4 ${
               gridSize === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 
               gridSize === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
               'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
            }`}>
               {cameras.map((cam) => (
                  <div key={cam.id} className="relative aspect-video bg-black rounded-xl overflow-hidden group shadow-lg border border-gray-300 dark:border-gray-800 hover:border-primary-500 transition-all">
                     
                     {/* Video Feed (Image Mock) */}
                     {cam.status !== 'Offline' ? (
                        <>
                           <img src={cam.image} alt={cam.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                           {/* Scanline Effect */}
                           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" style={{backgroundSize: '100% 3px'}}></div>
                        </>
                     ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                           <VideoOff size={32} className="mb-2 opacity-50"/>
                           <span className="text-xs font-mono">NO SIGNAL</span>
                        </div>
                     )}

                     {/* Top Overlay: Info */}
                     <div className="absolute top-0 left-0 w-full p-2 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-bold text-white font-mono">{cam.name}</span>
                        <div className="flex gap-1">
                           <span className="text-[10px] bg-black/50 text-white px-1 rounded border border-white/10">{cam.fps} FPS</span>
                        </div>
                     </div>

                     {/* Status Indicator (Always Visible) */}
                     <div className="absolute top-2 right-2">
                        {cam.status === 'Motion' && (
                           <div className="flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse shadow-sm">
                              <Activity size={10} /> MOTION
                           </div>
                        )}
                        {cam.status === 'Offline' && (
                           <div className="bg-gray-800 text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded border border-white/10">
                              OFFLINE
                           </div>
                        )}
                     </div>

                     {/* Hover Controls */}
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[1px]">
                        <button className="p-3 bg-white/10 hover:bg-primary-500 backdrop-blur rounded-full text-white transition-all transform hover:scale-110 shadow-xl border border-white/20">
                           <Maximize2 size={20} />
                        </button>
                     </div>

                     {/* Bottom Overlay: Tech Info */}
                     <div className="absolute bottom-2 left-2 text-[9px] font-mono text-gray-400 opacity-60 group-hover:opacity-100 transition-opacity">
                        {cam.id} • 1080P • H.265
                     </div>
                  </div>
               ))}
               
               {/* Add Camera Placeholder */}
               <button className="aspect-video bg-gray-200 dark:bg-white/5 rounded-xl border-2 border-dashed border-gray-300 dark:border-white/10 flex flex-col items-center justify-center text-gray-400 hover:text-primary-500 hover:border-primary-500 hover:bg-primary-500/5 transition-all">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center mb-2 shadow-sm">
                     <RefreshCw size={20} />
                  </div>
                  <span className="text-xs font-bold">Thêm Camera</span>
               </button>
            </div>
         </div>
      </GlassCard>
    </div>
  );
};
