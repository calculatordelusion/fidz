'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Save, Settings, Plus } from 'lucide-react';

interface MobileNavProps {
  isVisible: boolean;
  canSave: boolean;
  onUpload: () => void;
  onSave: () => void;
  onAddText: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({
  isVisible,
  canSave,
  onUpload,
  onSave,
  onAddText
}) => {
  if (!isVisible) return null;
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border z-50">
      <div className="flex items-center justify-around p-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onUpload}
          className="flex flex-col items-center gap-1"
        >
          <Upload size={18} />
          <span className="text-xs">Upload</span>
        </Button>
        
        {canSave && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onSave}
            className="flex flex-col items-center gap-1"
          >
            <Save size={18} />
            <span className="text-xs">Save</span>
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onAddText}
          className="flex flex-col items-center gap-1"
        >
          <Plus size={18} />
          <span className="text-xs">Add Text</span>
        </Button>
      </div>
    </div>
  );
};

export default MobileNav; 