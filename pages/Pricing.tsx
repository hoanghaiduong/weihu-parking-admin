import React, { useState, useEffect } from 'react';
import { GlassCard, Button, Input } from '../components/ui';
import { Ticket, RotateCcw, Save } from 'lucide-react';
import { DataStore } from '../utils/dataStore';
import { PricingConfig } from '../types';

export const Pricing: React.FC = () => {
  const [config, setConfig] = useState<PricingConfig>(DataStore.pricing.get());

  const handleSave = () => {
    DataStore.pricing.save(config);
    alert("Cấu hình giá đã được lưu!");
  };

  const handleReset = () => {
    if(confirm("Bạn có chắc muốn khôi phục về mặc định?")) {
        DataStore.pricing.reset();
        setConfig(DataStore.pricing.get());
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cấu hình Giá vé</h2>
           <p className="text-gray-500 dark:text-gray-400 text-sm">Thiết lập bảng giá cho các loại xe và khung giờ.</p>
        </div>
      </div>

      <GlassCard className="p-6 max-w-3xl mx-auto">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Ticket size={20} className="text-primary-500"/> Bảng giá hiện tại
        </h3>
        
        <div className="space-y-8">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase border-b border-gray-200 dark:border-white/10 pb-2">Khách vãng lai</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-4">
                  <Input label="2 Giờ đầu (Ô tô)" type="number" value={config.guestCarFirst2h} onChange={e => setConfig({...config, guestCarFirst2h: Number(e.target.value)})} />
                  <Input label="Giờ tiếp theo (Ô tô)" type="number" value={config.guestCarNext1h} onChange={e => setConfig({...config, guestCarNext1h: Number(e.target.value)})} />
                  <Input label="Phụ thu qua đêm (Ô tô)" type="number" value={config.guestCarOvernight} onChange={e => setConfig({...config, guestCarOvernight: Number(e.target.value)})} />
               </div>
               <div className="space-y-4">
                  <Input label="2 Giờ đầu (Xe máy)" type="number" value={config.guestMotoFirst2h} onChange={e => setConfig({...config, guestMotoFirst2h: Number(e.target.value)})} />
                  <Input label="Giờ tiếp theo (Xe máy)" type="number" value={config.guestMotoNext1h} onChange={e => setConfig({...config, guestMotoNext1h: Number(e.target.value)})} />
                  <Input label="Phụ thu qua đêm (Xe máy)" type="number" value={config.guestMotoOvernight} onChange={e => setConfig({...config, guestMotoOvernight: Number(e.target.value)})} />
               </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase border-b border-gray-200 dark:border-white/10 pb-2">Vé tháng</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Vé tháng (Ô tô)" type="number" value={config.monthlyCar} onChange={e => setConfig({...config, monthlyCar: Number(e.target.value)})} />
              <Input label="Vé tháng (Xe máy)" type="number" value={config.monthlyMoto} onChange={e => setConfig({...config, monthlyMoto: Number(e.target.value)})} />
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-gray-200 dark:border-white/10">
            <Button variant="secondary" onClick={handleReset}><RotateCcw size={16}/> Khôi phục mặc định</Button>
            <Button onClick={handleSave}><Save size={16}/> Lưu cấu hình</Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};