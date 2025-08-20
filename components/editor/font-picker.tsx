'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { ALL_FONTS } from '@/constants/fonts';
import { Input } from '@/components/ui/input';

interface FontFamilyPickerProps { 
  attribute: string;
  currentFont: string;
  handleAttributeChange: (attribute: string, value: string) => void;
}

const FontFamilyPicker: React.FC<FontFamilyPickerProps> = ({
  attribute,
  currentFont,
  handleAttributeChange,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter fonts based on search query
  const filteredFonts = searchQuery 
    ? ALL_FONTS.filter(font => font.toLowerCase().includes(searchQuery.toLowerCase()))
    : ALL_FONTS;

  // For mobile: inline content
  if (isMobile) {
    return (
      <div className="flex flex-col gap-2">
        <Label htmlFor={attribute}>Font Family</Label>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium" style={{ fontFamily: currentFont }}>
            {currentFont || "Select font family"}
          </span>
        </div>
        
        <Input
          placeholder="Search fonts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-2"
        />
        
        <div className="border border-border rounded-md h-48 overflow-y-auto">
          <div className="p-1">
            {filteredFonts.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground">No font family found.</div>
            ) : (
              filteredFonts.map((font) => (
                <div
                  key={font}
                  className={cn(
                    "px-2 py-1.5 text-sm rounded-sm cursor-pointer flex items-center justify-between",
                    font === currentFont ? "bg-primary/10" : "hover:bg-accent"
                  )}
                  style={{ fontFamily: font }}
                  onClick={() => handleAttributeChange(attribute, font)}
                >
                  {font}
                  {font === currentFont && (
                    <CheckIcon className="h-4 w-4" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // For desktop: popover menu
  return (
    <Popover>
      <div className='flex flex-col gap-2'>
        <Label htmlFor={attribute}>Font Family</Label>
        <PopoverTrigger asChild>
          <Button
            id={attribute}
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between",
              !currentFont && "text-muted-foreground"
            )}
          >
            {currentFont ? currentFont : "Select font family"}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search font family..."
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No font family found.</CommandEmpty>
            <CommandGroup heading={"All Fonts"}>
              {ALL_FONTS.map((font) => (
                <CommandItem
                  value={font}
                  key={font}
                  onSelect={() => handleAttributeChange(attribute, font)}
                  className="hover:cursor-pointer"
                  style={{ fontFamily: font }}
                >
                  {font}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      font === currentFont ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default FontFamilyPicker;