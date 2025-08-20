'use client'

import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChromePicker } from 'react-color';
import { colors } from '@/constants/colors';

interface ColorPickerProps {
  attribute: string;
  label: string;
  currentColor: string;
  handleAttributeChange: (attribute: string, value: any) => void;
} 

const ColorPicker: React.FC<ColorPickerProps> = ({
  attribute,
  label,
  currentColor,
  handleAttributeChange,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<'colorPicker' | 'suggestions'>('colorPicker');

  useEffect(() => {
    // Check if we're on client-side
    if (typeof window !== 'undefined') {
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      
      // Initial check
      checkIfMobile();
      
      // Add event listener for resize
      window.addEventListener('resize', checkIfMobile);
      
      // Clean up
      return () => window.removeEventListener('resize', checkIfMobile);
    }
  }, []);

  // For mobile: inline content
  if (isMobile) {
    return (
      <div className="flex flex-col gap-2">
        <Label htmlFor={attribute}>{label}</Label>
        
        <div className="flex items-center gap-2 mb-2">
          <div
            style={{ background: currentColor }}
            className="rounded-md h-5 w-5 border border-border"
          />
          <span className="text-sm">{currentColor}</span>
        </div>
        
        <Tabs defaultValue="colorPicker" className="w-full" onValueChange={(value) => setActiveTab(value as 'colorPicker' | 'suggestions')}>
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="colorPicker">🎨 Color Picker</TabsTrigger>
            <TabsTrigger value="suggestions">⚡️ Presets</TabsTrigger>
          </TabsList>
          
          {activeTab === 'colorPicker' && (
            <div className="flex justify-center mb-2">
              <ChromePicker
                color={currentColor}
                onChange={(color) => handleAttributeChange(attribute, color.hex)}
                disableAlpha={true}
                styles={{
                  default: {
                    picker: {
                      width: '100%',
                      boxShadow: 'none',
                      border: '1px solid var(--border)',
                      borderRadius: '0.5rem'
                    }
                  }
                }}
              />
            </div>
          )}
          
          {activeTab === 'suggestions' && (
            <div className="flex flex-wrap gap-2 p-2 border border-border rounded-md">
              {colors.map((color) => (
                <div
                  key={color}
                  style={{ background: color }}
                  className="rounded-md h-8 w-8 cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => handleAttributeChange(attribute, color)}
                />
              ))}
            </div>
          )}
        </Tabs>
      </div>
    );
  }

  // For desktop: dropdown menu
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={attribute}>{label}</Label>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button id={attribute} variant='outline' className='w-full flex justify-between'>
            <div className="flex items-center gap-2">
              <div
                style={{ background: currentColor }}
                className="rounded-md h-4 w-4"
              />
              <span>{currentColor}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='flex flex-col items-center justify-center w-[240px]'
          side='right'
          sideOffset={10}
        >
          <Tabs defaultValue='colorPicker' className="w-full">
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='colorPicker'>🎨 Color Picker</TabsTrigger>
              <TabsTrigger value='suggestions'>⚡️ Presets</TabsTrigger>
            </TabsList>
            <TabsContent value='colorPicker' className="flex justify-center">
              <ChromePicker
                color={currentColor}
                onChange={(color) => handleAttributeChange(attribute, color.hex)}
                disableAlpha={true}
              />
            </TabsContent>
            <TabsContent value='suggestions'>
              <div className='flex flex-wrap gap-1 p-2'>
                {colors.map((color) => (
                  <div
                    key={color}
                    style={{ background: color }}
                    className="rounded-md h-6 w-6 cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => handleAttributeChange(attribute, color)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs> 
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ColorPicker;