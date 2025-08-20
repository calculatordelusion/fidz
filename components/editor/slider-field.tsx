'use client'

import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { LockIcon } from 'lucide-react';

interface SliderFieldProps {
  attribute: string;
  label: string;
  min: number;
  max: number;
  step: number;
  currentValue: number;
  disabled?: boolean;
  premiumFeature?: boolean;
  handleAttributeChange: (attribute: string, value: number) => void;
}

const SliderField: React.FC<SliderFieldProps> = ({
    attribute,
    label,
    min,
    max,
    step,
    currentValue,
    disabled = false,
    premiumFeature = false,
    handleAttributeChange
  }) => { 
    const handleSliderInputFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const value = parseFloat(event.target.value);
      handleAttributeChange(attribute, value);
    };
  
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor={attribute}>{label}</Label>
            {premiumFeature && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <LockIcon size={12} />
                <span>Pro</span>
              </div>
            )}
          </div>
          <Input
            type="number"
            value={currentValue}
            onChange={handleSliderInputFieldChange}
            className={`w-[4.5rem] h-8 rounded-md border border-input px-2 py-0.5 text-center text-sm ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
          />
        </div>
        <div className="px-1">
          <Slider
            id={attribute}
            min={min}
            max={max}
            value={[currentValue]}
            step={step}
            onValueChange={(value) => !disabled && handleAttributeChange(attribute, value[0])}
            className={`[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={label}
            disabled={disabled}
          />
        </div>
    </div>
    );
};

export default SliderField