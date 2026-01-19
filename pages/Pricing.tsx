import React from 'react';
import { GlassCard, Button, Input } from '../components/ui';
import { Ticket, RotateCcw, Save } from 'lucide-react';

export const Pricing: React.FC = () => {
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
                  <Input label="2 Giờ đầu (Ô tô)" defaultValue="25,000" />
                  <Input label="Giờ tiếp theo (Ô tô)" defaultValue="10,000" />
                  <Input label="Phụ thu qua đêm (Ô tô)" defaultValue="100,000" />
               </div>
               <div className="space-y-4">
                  <Input label="2 Giờ đầu (Xe máy)" defaultValue="5,000" />
                  <Input label="Giờ tiếp theo (Xe máy)" defaultValue="2,000" />
                  <Input label="Phụ thu qua đêm (Xe máy)" defaultValue="30,000" />
               </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase border-b border-gray-200 dark:border-white/10 pb-2">Vé tháng</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Vé tháng (Ô tô)" defaultValue="1,500,000" />
              <Input label="Vé tháng (Xe máy)" defaultValue="120,000" />
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-gray-200 dark:border-white/10">
            <Button variant="secondary"><RotateCcw size={16}/> Khôi phục mặc định</Button>
            <Button><Save size={16}/> Lưu cấu hình</Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};