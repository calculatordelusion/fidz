import React, { useState, useEffect } from 'react';
import InputField from './input-field';
import SliderField from './slider-field';
import ColorPicker from './color-picker';
import FontFamilyPicker from './font-picker'; 
import { Button } from '../ui/button';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Move, Text, Bold, RotateCw, Palette, LightbulbIcon, CaseSensitive, TypeOutline, ArrowLeftRight, ArrowUpDown, AlignHorizontalSpaceAround, LockIcon } from 'lucide-react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface TextCustomizerProps {
    textSet: {
        id: number;
        text: string;
        fontFamily: string;
        top: number;
        left: number;
        color: string;
        fontSize: number;
        fontWeight: number;
        opacity: number;
        rotation: number;
        shadowColor: string;
        shadowSize: number;
        tiltX: number;
        tiltY: number;
        letterSpacing: number;
    };
    handleAttributeChange: (id: number, attribute: string, value: any) => void;
    removeTextSet: (id: number) => void;
    duplicateTextSet: (textSet: any) => void;
    onSuggestText?: (id: number) => void;
    onAutoColor?: (id: number) => void;
}

const TextCustomizer: React.FC<TextCustomizerProps> = ({ textSet, handleAttributeChange, removeTextSet, duplicateTextSet }) => {
    const [activeControl, setActiveControl] = useState<string | null>(null);

    const controls = [
        { id: 'text', icon: <CaseSensitive size={20} />, label: 'Text' },
        { id: 'fontFamily', icon: <TypeOutline size={20} />, label: 'Font' },
        { id: 'color', icon: <Palette size={20} />, label: 'Color' },
        { id: 'position', icon: <Move size={20} />, label: 'Position' },
        { id: 'fontSize', icon: <Text size={20} />, label: 'Size' },
        { id: 'fontWeight', icon: <Bold size={20} />, label: 'Weight' },
        { id: 'letterSpacing', icon: <AlignHorizontalSpaceAround size={20} />, label: 'Letter spacing' },
        { id: 'opacity', icon: <LightbulbIcon size={20} />, label: 'Opacity' },
        { id: 'rotation', icon: <RotateCw size={20} />, label: 'Rotate' },
        { id: 'tiltX', icon: <ArrowLeftRight size={20} />, label: 'Tilt X (3D effect)' },
        { id: 'tiltY', icon: <ArrowUpDown size={20} />, label: 'Tilt Y (3D effect)' },
    ];  

    return (
        <AccordionItem value={`item-${textSet.id}`}>
            <AccordionTrigger>{textSet.text}</AccordionTrigger>
            <AccordionContent>
                {/* Removed AI Suggest/Auto Color buttons per request */}
                {/* Mobile Controls - Revised to show all controls in a vertical layout */}
                <div className="md:hidden">
                    <div className="space-y-5">
                        <InputField
                            attribute="text"
                            label="Text"
                            currentValue={textSet.text}
                            handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                        />
                        
                        <FontFamilyPicker
                            attribute="fontFamily"
                            currentFont={textSet.fontFamily}
                            handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                        />
                        
                        <ColorPicker
                            attribute="color"
                            label="Text Color"
                            currentColor={textSet.color}
                            handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                        />
                        
                        <SliderField
                            attribute="fontSize"
                            label="Text Size"
                            min={10}
                            max={800}
                            step={1}
                            currentValue={textSet.fontSize}
                            handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                        />
                        
                        <SliderField
                            attribute="fontWeight"
                            label="Font Weight"
                            min={100}
                            max={900}
                            step={100}
                            currentValue={textSet.fontWeight}
                            handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                        />
                        
                        <SliderField
                            attribute="letterSpacing"
                            label="Letter Spacing"
                            min={-20}
                            max={100}
                            step={1}
                            currentValue={textSet.letterSpacing}
                            handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                        />
                        
                        <SliderField
                            attribute="opacity"
                            label="Text Opacity"
                            min={0}
                            max={1}
                            step={0.01}
                            currentValue={textSet.opacity}
                            handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                        />
                        
                        <SliderField
                            attribute="rotation"
                            label="Rotation"
                            min={-360}
                            max={360}
                            step={1}
                            currentValue={textSet.rotation}
                            handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                        />
                        
                        <SliderField
                            attribute="left"
                            label="X Position"
                            min={-200}
                            max={200}
                            step={1}
                            currentValue={textSet.left}
                            handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                        />
                        
                        <SliderField
                            attribute="top"
                            label="Y Position"
                            min={-100}
                            max={100}
                            step={1}
                            currentValue={textSet.top}
                            handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                        />
                        
                        <SliderField
                            attribute="tiltX"
                            label="Horizontal Tilt (3D)"
                            min={-45}
                            max={45}
                            step={1}
                            currentValue={textSet.tiltX}
                            handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                        />
                        
                        <SliderField
                            attribute="tiltY"
                            label="Vertical Tilt (3D)"
                            min={-45}
                            max={45}
                            step={1}
                            currentValue={textSet.tiltY}
                            handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                        />
                        
                        <div className="flex gap-2 justify-end mt-6">
                            <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => removeTextSet(textSet.id)}
                            >
                                Remove
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => duplicateTextSet(textSet)}
                            >
                                Duplicate
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:grid md:grid-cols-2 gap-4">
                    <InputField
                        attribute="text"
                        label="Text"
                        currentValue={textSet.text}
                        handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                    />
                    <FontFamilyPicker
                        attribute="fontFamily"
                        currentFont={textSet.fontFamily}
                        handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                    />
                    <ColorPicker
                        attribute="color"
                        label="Text Color"
                        currentColor={textSet.color}
                        handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                    />
                    <SliderField
                        attribute="fontSize"
                        label="Text Size"
                        min={10}
                        max={800}
                        step={1}
                        currentValue={textSet.fontSize}
                        handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                    />
                    <SliderField
                        attribute="fontWeight"
                        label="Font Weight"
                        min={100}
                        max={900}
                        step={100}
                        currentValue={textSet.fontWeight}
                        handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                    />
                    <SliderField
                        attribute="letterSpacing"
                        label="Letter Spacing"
                        min={-20}
                        max={100}
                        step={1}
                        currentValue={textSet.letterSpacing}
                        handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                    />
                    <SliderField
                        attribute="opacity"
                        label="Text Opacity"
                        min={0}
                        max={1}
                        step={0.01}
                        currentValue={textSet.opacity}
                        handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                    />
                    <SliderField
                        attribute="rotation"
                        label="Rotation"
                        min={-360}
                        max={360}
                        step={1}
                        currentValue={textSet.rotation}
                        handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                    />
                    <SliderField
                        attribute="top"
                        label="Y Position"
                        min={-100}
                        max={100}
                        step={1}
                        currentValue={textSet.top}
                        handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                    />
                    <SliderField
                        attribute="left"
                        label="X Position"
                        min={-200}
                        max={200}
                        step={1}
                        currentValue={textSet.left}
                        handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                    />
                    <SliderField
                        attribute="tiltX"
                        label="Horizontal Tilt (3D)"
                        min={-45}
                        max={45}
                        step={1}
                        currentValue={textSet.tiltX}
                        handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                    />
                    <SliderField
                        attribute="tiltY"
                        label="Vertical Tilt (3D)"
                        min={-45}
                        max={45}
                        step={1}
                        currentValue={textSet.tiltY}
                        handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                    />
                    <div className="col-span-2 flex gap-2 justify-end mt-4">
                        <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => removeTextSet(textSet.id)}
                        >
                            Remove
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => duplicateTextSet(textSet)}
                        >
                            Duplicate
                        </Button>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};

export default TextCustomizer;