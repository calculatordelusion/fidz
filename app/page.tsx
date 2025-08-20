'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Accordion } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ModeToggle } from '@/components/mode-toggle';
import TextCustomizer from '@/components/editor/text-customizer';
import MobileNav from '@/components/ui/mobile-nav';

import { PlusIcon, ReloadIcon } from '@radix-ui/react-icons';
import { Menu } from 'lucide-react';

// Dynamically import background removal at runtime to avoid build-time issues

import '@/app/fonts.css';

const Page = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isImageSetupDone, setIsImageSetupDone] = useState<boolean>(false);
    const [removedBgImageUrl, setRemovedBgImageUrl] = useState<string | null>(null);
    const [textSets, setTextSets] = useState<Array<any>>([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const prevSelectedImageUrlRef = useRef<string | null>(null);
    const prevRemovedBgImageUrlRef = useRef<string | null>(null);
    const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
    // remove playful image adjustments per request
    const [isProcessing, setIsProcessing] = useState(false);
    const progressStages = [
        'AI is processing your image…',
        'Initializing magic…',
        'Analyzing your image…',
        'Applying enhancements…',
        'Fine-tuning the details…',
        'Rendering final touches…',
        'Almost there…'
    ];
    const [progressStageIndex, setProgressStageIndex] = useState(0);

    useEffect(() => {
        if (!isProcessing) return;
        setProgressStageIndex(0);
        const id = setInterval(() => {
            setProgressStageIndex((prev) => Math.min(prev + 1, progressStages.length - 1));
        }, 4000);
        return () => clearInterval(id);
    }, [isProcessing]);

    const handleUploadImage = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Revoke any previous blob URLs to avoid memory leaks
            if (prevSelectedImageUrlRef.current) {
                try { URL.revokeObjectURL(prevSelectedImageUrlRef.current); } catch {}
            }
            if (prevRemovedBgImageUrlRef.current) {
                try { URL.revokeObjectURL(prevRemovedBgImageUrlRef.current); } catch {}
            }

            // Reset state so the previous foreground does not overlay the new image
            setIsImageSetupDone(false);
            setRemovedBgImageUrl(null);

            const imageUrl = URL.createObjectURL(file);
            prevSelectedImageUrlRef.current = imageUrl;
            setSelectedImage(imageUrl);
            await setupImage(imageUrl);
        }
    };

    const setupImage = async (imageUrl: string) => {
        try {
            setIsProcessing(true);
            const metaImg = new (window as any).Image();
            metaImg.onload = () => {
                const width = (metaImg as any).naturalWidth || metaImg.width;
                const height = (metaImg as any).naturalHeight || metaImg.height;
                setImageDimensions({ width, height });
            };
            metaImg.src = imageUrl;
            const { removeBackground } = await import("@imgly/background-removal");
            const imageBlob = await removeBackground(imageUrl);
            const url = URL.createObjectURL(imageBlob);
            prevRemovedBgImageUrlRef.current = url;
            setRemovedBgImageUrl(url);
            setIsImageSetupDone(true);
            setIsProcessing(false);
        } catch (error) {
            console.error(error);
            setIsProcessing(false);
        }
    };

    const addNewTextSet = () => {
        const newId = Math.max(...textSets.map(set => set.id), 0) + 1;
        setTextSets(prev => [...prev, {
            id: newId,
            text: 'edit',
            fontFamily: 'Inter',
            top: 0,
            left: 0,
            color: 'white',
            fontSize: 200,
            fontWeight: 800,
            opacity: 1,
            shadowColor: 'rgba(0, 0, 0, 0.8)',
            shadowSize: 4,
            rotation: 0,
            tiltX: 0,
            tiltY: 0,
            letterSpacing: 0
        }]);
    };

    const handleAttributeChange = (id: number, attribute: string, value: any) => {
        setTextSets(prev => prev.map(set => 
            set.id === id ? { ...set, [attribute]: value } : set
        ));
    };

    const duplicateTextSet = (textSet: any) => {
        const newId = Math.max(...textSets.map(set => set.id), 0) + 1;
        setTextSets(prev => [...prev, { ...textSet, id: newId }]);
    };

    const removeTextSet = (id: number) => {
        setTextSets(prev => prev.filter(set => set.id !== id));
    };

    // Simple AI-like helpers
    const handleSuggestText = (id: number) => {
        const prompts = [
            'Dream. Create. Inspire.',
            'Design the future.',
            'Bold moves.',
            'Elevate your brand.',
            'Make it unforgettable.'
        ];
        const suggestion = prompts[Math.floor(Math.random() * prompts.length)];
        handleAttributeChange(id, 'text', suggestion);
    };

    const handleAutoColor = (id: number) => {
        // Pick high-contrast color based on a quick sample from the background image
        if (!selectedImage) return;
        const img = new (window as any).Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const tmp = document.createElement('canvas');
            const tctx = tmp.getContext('2d');
            if (!tctx) return;
            tmp.width = 16; tmp.height = 16;
            tctx.drawImage(img, 0, 0, 16, 16);
            const { data } = tctx.getImageData(0, 0, 16, 16);
            let r = 0, g = 0, b = 0, count = 0;
            for (let i = 0; i < data.length; i += 4) {
                r += data[i]; g += data[i + 1]; b += data[i + 2]; count += 1;
            }
            r = Math.round(r / count); g = Math.round(g / count); b = Math.round(b / count);
            // YIQ perceived brightness
            const yiq = (r * 299 + g * 587 + b * 114) / 1000;
            const color = yiq >= 128 ? '#111111' : '#FFFFFF';
            handleAttributeChange(id, 'color', color);
        };
        img.src = selectedImage;
    };

    const saveCompositeImage = () => {
        if (!canvasRef.current || !isImageSetupDone) return;
    
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
    
        const bgImg = new (window as any).Image();
        bgImg.crossOrigin = "anonymous";
        bgImg.onload = () => {
            // Render EXACTLY what the user sees in the preview container (no crop)
            const container = document.querySelector('[data-display-container]') as HTMLDivElement | null;
            const rect = container?.getBoundingClientRect();
            const outWidth = Math.max(1, Math.round(rect?.width || bgImg.width));
            const outHeight = Math.max(1, Math.round(rect?.height || bgImg.height));
            canvas.width = outWidth;
            canvas.height = outHeight;
            ctx.imageSmoothingEnabled = true;
            (ctx as any).imageSmoothingQuality = 'high';
    
            // Draw background using object-fit: contain and centered (exactly like preview)
            const imgRatio = bgImg.width / bgImg.height;
            const boxRatio = outWidth / outHeight;
            let drawW: number, drawH: number, drawX: number, drawY: number;
            if (imgRatio > boxRatio) {
                drawW = outWidth;
                drawH = Math.round(outWidth / imgRatio);
                drawX = 0;
                drawY = Math.round((outHeight - drawH) / 2);
            } else {
                drawH = outHeight;
                drawW = Math.round(outHeight * imgRatio);
                drawX = Math.round((outWidth - drawW) / 2);
                drawY = 0;
            }
            ctx.clearRect(0, 0, outWidth, outHeight);
            ctx.drawImage(bgImg, drawX, drawY, drawW, drawH);
    
            textSets.forEach(textSet => {
                ctx.save();
                
                // Use the on-screen pixel sizes directly so output == preview
                ctx.font = `${textSet.fontWeight} ${Math.round(textSet.fontSize)}px ${textSet.fontFamily}`;
                ctx.fillStyle = textSet.color;
                ctx.globalAlpha = textSet.opacity;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.letterSpacing = `${textSet.letterSpacing}px`;
    
                const x = outWidth * (textSet.left + 50) / 100;
                const y = outHeight * (50 - textSet.top) / 100;
    
                ctx.translate(x, y);
                
                const tiltXRad = (-textSet.tiltX * Math.PI) / 180;
                const tiltYRad = (-textSet.tiltY * Math.PI) / 180;
    
                ctx.transform(
                    Math.cos(tiltYRad),
                    Math.sin(0),
                    -Math.sin(0),
                    Math.cos(tiltXRad),
                    0,
                    0
                );
    
                ctx.rotate((textSet.rotation * Math.PI) / 180);
    
                if (textSet.letterSpacing === 0) {
                    ctx.fillText(textSet.text, 0, 0);
                } else {
                    const chars = textSet.text.split('');
                    let currentX = 0;
                    const totalWidth = chars.reduce((width, char, i) => {
                        const charWidth = ctx.measureText(char).width;
                        return width + charWidth + (i < chars.length - 1 ? textSet.letterSpacing : 0);
                    }, 0);
                    
                    currentX = -totalWidth / 2;
                    
                    chars.forEach((char, i) => {
                        const charWidth = ctx.measureText(char).width;
                        ctx.fillText(char, currentX + charWidth / 2, 0);
                        currentX += charWidth + textSet.letterSpacing;
                    });
                }
                ctx.restore();
            });
    
            if (removedBgImageUrl) {
                const removedBgImg = new (window as any).Image();
                removedBgImg.crossOrigin = "anonymous";
                removedBgImg.onload = () => {
                    // Draw the foreground using the exact same contain box as the background
                    // so there is no cropping or stretching mismatch vs preview
                    ctx.drawImage(removedBgImg, drawX, drawY, drawW, drawH);
                    triggerDownload();
                };
                removedBgImg.src = removedBgImageUrl;
            } else {
                triggerDownload();
            }
        };
        bgImg.src = selectedImage || '';
    
        function triggerDownload() {
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'text-behind-image.png';
            link.href = dataUrl;
            link.click();
        }
    };
    
    return ( 
        <>
            <div className='flex flex-col min-h-screen'>
                <header className='sticky top-0 z-10 bg-gradient-to-r from-background via-background/90 to-background/60 backdrop-blur-xl flex flex-row items-center justify-between p-3 md:p-5 px-4 md:px-10 border-b border-border'>
                    <h2 className="text-xl md:text-2xl font-semibold tracking-tight">Text Behind Image</h2>
                    
                    <div className='flex gap-2 md:gap-4 items-center'>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            accept=".jpg, .jpeg, .png"
                        />
                        
                        <Button onClick={handleUploadImage} variant="gradient" size="sm" className="hidden md:flex md:size-default transition-transform hover:-translate-y-0.5">
                            Upload
                        </Button>
                        
                        {selectedImage && (
                            <Button onClick={saveCompositeImage} variant="gradient" size="sm" className="hidden md:flex md:size-default transition-transform hover:-translate-y-0.5">
                                Save
                            </Button>
                        )}
                        
                        <ModeToggle />
            </div>
                </header>
                
                <Separator /> 
                
                {selectedImage ? (
                    <div className='flex flex-col lg:flex-row items-start justify-center gap-8 xl:gap-12 w-full px-4 md:px-10 mt-14 md:mt-20 mb-12'>
                        <div className="flex flex-col items-center md:items-start justify-start w-full lg:flex-1 gap-4">
                            <canvas ref={canvasRef} style={{ display: 'none' }} />
                            <div
                                className="w-full max-w-[900px] aspect-[4/3] max-h-[80vh] p-3 md:p-5 border border-border rounded-3xl relative overflow-hidden bg-gradient-to-b from-muted/40 to-background shadow-2xl"
                                data-display-container
                                style={{ aspectRatio: isImageSetupDone && imageDimensions ? `${imageDimensions.width}/${imageDimensions.height}` : undefined }}
                            >
                                {isImageSetupDone ? (
                                    <Image
                                        src={selectedImage}
                                        alt="Uploaded"
                                        fill
                                        style={{ objectFit: 'contain', objectPosition: 'center' }}
                                        className="absolute inset-0 z-0"
                                    />
                                ) : (
                                    <div className='absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md gap-5 p-6 text-center'>
                                        <div className="relative w-11/12 max-w-md h-3 rounded-full bg-muted overflow-hidden shadow-[0_0_12px_rgba(99,102,241,0.25)]">
                                            <div className="absolute inset-0">
                                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 animate-[pulseGlow_1.8s_ease-in-out_infinite]"></div>
                                            </div>
                                            <div className="h-full w-1/3 bg-gradient-to-r from-primary via-fuchsia-500 to-pink-500 animate-[progressSlide_1.2s_ease-in-out_infinite]"></div>
                                            {/* floating spark accents */}
                                            <div className="pointer-events-none absolute -top-2 left-6 h-2 w-2 rounded-full bg-white/70 blur-[1px] animate-[floatSpark_2.4s_ease-in-out_infinite]"></div>
                                            <div className="pointer-events-none absolute -top-1 left-1/2 h-1.5 w-1.5 rounded-full bg-fuchsia-300/80 blur-[0.5px] animate-[floatSpark_2.8s_ease-in-out_infinite]"></div>
                                        </div>
                                        <div className="space-y-1 min-h-[44px]">
                                            <AnimatePresence mode="wait">
                                                <motion.p
                                                    key={progressStageIndex}
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -8 }}
                                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                                    className="text-sm md:text-base text-muted-foreground [text-shadow:0_0_0_rgba(255,255,255,.0)] animate-[softGlow_2.4s_ease-in-out_infinite]"
                                                >
                                                    {progressStages[progressStageIndex]}
                                                </motion.p>
                                            </AnimatePresence>
                                            {/* hidden: step counter */}
                                        </div>
                                    </div>
                                )}
                                {isImageSetupDone && textSets.map(textSet => (
                                    <div
                                        key={textSet.id}
                                        style={{
                                            position: 'absolute',
                                            top: `${50 - textSet.top}%`,
                                            left: `${textSet.left + 50}%`,
                                            transform: `
                                                translate(-50%, -50%) 
                                                rotate(${textSet.rotation}deg)
                                                perspective(1000px)
                                                rotateX(${textSet.tiltX}deg)
                                                rotateY(${textSet.tiltY}deg)
                                            `,
                                            color: textSet.color,
                                            textAlign: 'center',
                                            fontSize: `${textSet.fontSize}px`,
                                            fontWeight: textSet.fontWeight,
                                            fontFamily: textSet.fontFamily,
                                            opacity: textSet.opacity,
                                            letterSpacing: `${textSet.letterSpacing}px`,
                                            transformStyle: 'preserve-3d',
                                            zIndex: 5
                                        }}
                                    >
                                        {textSet.text}
                                    </div>
                                ))}
                                {removedBgImageUrl && (
                                    <Image
                                        src={removedBgImageUrl}
                                        alt="Removed bg"
                                        fill
                                        style={{ objectFit: 'contain', objectPosition: 'center' }}
                                        className="absolute top-0 left-0 w-full h-full z-10"
                                    />
                                )}
                            </div>
            </div>

                        <div className='flex flex-col w-full xl:w-[640px] gap-4'>
                            <div className='rounded-2xl border border-border/60 bg-background/60 backdrop-blur p-4 shadow-2xl'>
                            <Button variant={'gradient'} onClick={addNewTextSet} className="mb-4 hidden md:inline-flex"><PlusIcon className='mr-2'/> Add New Text</Button>
                            <ScrollArea className="h-[calc(100vh-240px)] md:h-[calc(100vh-200px)] rounded-xl border p-3">
                                <Accordion type="single" collapsible className="w-full">
                                    {textSets.map(textSet => (
                                        <TextCustomizer 
                                            key={textSet.id}
                                            textSet={textSet}
                                            handleAttributeChange={handleAttributeChange}
                                            removeTextSet={removeTextSet}
                                            duplicateTextSet={duplicateTextSet}
                                        />
                                    ))}
                                </Accordion>
                            </ScrollArea>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='flex items-center justify-center flex-1 w-full p-6 md:p-12 text-center'>
                        <div className="max-w-3xl w-full rounded-3xl border border-border/60 bg-background/60 backdrop-blur-xl p-8 md:p-12 shadow-2xl">
                            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Design text behind your images beautifully</h2>
                            <p className="mt-3 text-muted-foreground md:text-lg">Upload a photo and craft stunning type that sits perfectly behind your subject. Smart background removal and tasteful controls make it effortless.</p>
                            <Button onClick={handleUploadImage} size="lg" className="mt-6">Upload an Image</Button>
                        </div>
                    </div> 
                )} 
            </div>
            
            <MobileNav 
                isVisible={!!selectedImage}
                canSave={!!selectedImage && isImageSetupDone}
                onUpload={handleUploadImage}
                onSave={saveCompositeImage}
                onAddText={addNewTextSet}
            />
        </>
    );
}

export default Page;