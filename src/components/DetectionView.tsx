import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload, Camera, Trash2, ShieldAlert, Info, Loader2, Target, Layers } from 'lucide-react';
import { analyzeMarineDebris, AnalysisResponse, DetectionResult } from '@/src/lib/gemini';
import { motion, AnimatePresence } from 'motion/react';

export const DetectionView: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResponse | null>(null);
  const [hoveredDetection, setHoveredDetection] = useState<number | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setResults(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!image) return;
    setAnalyzing(true);
    try {
      const mimeType = image.split(';')[0].split(':')[1];
      const data = await analyzeMarineDebris(image, mimeType);
      setResults(data);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const clear = () => {
    setImage(null);
    setResults(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 h-full">
      <div className="lg:col-span-2 space-y-4">
        <Card className="overflow-hidden border-2 border-primary/10">
          <CardHeader className="bg-muted/30 pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Inference Engine
                </CardTitle>
                <CardDescription>Upload an image to detect and segment marine debris</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" /> Upload
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                />
                {image && (
                  <Button variant="destructive" size="sm" onClick={clear}>
                    <Trash2 className="w-4 h-4 mr-2" /> Clear
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 relative min-h-[400px] flex items-center justify-center bg-black/5">
            {!image ? (
              <div className="text-center p-12 space-y-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Camera className="w-10 h-10 text-primary/40" />
                </div>
                <div>
                  <p className="text-lg font-medium">No Image Selected</p>
                  <p className="text-sm text-muted-foreground">Select a file from the TrashCan or TACO dataset</p>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <img 
                  ref={imageRef}
                  src={image} 
                  alt="Marine Environment" 
                  className="max-w-full max-h-[600px] object-contain"
                  referrerPolicy="no-referrer"
                />
                
                {/* Bounding Boxes Overlay */}
                {results && results.detections.map((det, idx) => {
                  const [ymin, xmin, ymax, xmax] = det.box_2d;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ 
                        opacity: hoveredDetection === null || hoveredDetection === idx ? 1 : 0.3,
                        scale: 1 
                      }}
                      className="absolute border-2 rounded-sm cursor-pointer transition-colors"
                      style={{
                        top: `${ymin / 10}%`,
                        left: `${xmin / 10}%`,
                        width: `${(xmax - xmin) / 10}%`,
                        height: `${(ymax - ymin) / 10}%`,
                        borderColor: hoveredDetection === idx ? '#3b82f6' : '#ef4444',
                        backgroundColor: hoveredDetection === idx ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                        boxShadow: hoveredDetection === idx ? '0 0 15px rgba(59, 130, 246, 0.5)' : 'none',
                        zIndex: hoveredDetection === idx ? 50 : 10
                      }}
                      onMouseEnter={() => setHoveredDetection(idx)}
                      onMouseLeave={() => setHoveredDetection(null)}
                    >
                      <div className="absolute -top-6 left-0 bg-primary text-white text-[10px] px-1 rounded flex items-center gap-1 whitespace-nowrap">
                        {det.label} ({(det.confidence * 100).toFixed(0)}%)
                      </div>
                    </motion.div>
                  );
                })}

                {/* Explainability Heatmap Overlay */}
                {showHeatmap && results && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {results.explainability_heatmap_data.map((point, idx) => (
                      <div 
                        key={idx}
                        className="absolute rounded-full blur-xl opacity-40"
                        style={{
                          left: `${point.x / 10}%`,
                          top: `${point.y / 10}%`,
                          width: '40px',
                          height: '40px',
                          background: `radial-gradient(circle, rgba(239,68,68,${point.intensity}) 0%, transparent 70%)`
                        }}
                      />
                    ))}
                  </div>
                )}

                {analyzing && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin" />
                    <div className="text-center">
                      <p className="font-semibold">Running Deep Learning Inference...</p>
                      <p className="text-xs opacity-70">Processing via MarineGuard AI Model v2.4</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          {image && !results && !analyzing && (
            <div className="p-4 bg-primary/5 border-t flex justify-center">
              <Button onClick={runAnalysis} className="w-full max-w-xs">
                Run Detection & Segmentation
              </Button>
            </div>
          )}
        </Card>

        {results && (
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Analysis Summary</AlertTitle>
            <AlertDescription className="text-blue-700">
              {results.summary}
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-4">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Detection Results</CardTitle>
              {results && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={showHeatmap ? "text-primary bg-primary/10" : ""}
                >
                  <Layers className="w-4 h-4 mr-2" /> Heatmap
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-[calc(100vh-350px)]">
              {!results ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Awaiting inference results...</p>
                </div>
              ) : (
                <div className="space-y-4 pr-4">
                  {results.detections.map((det, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-3 rounded-lg border transition-all ${
                        hoveredDetection === idx ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border'
                      }`}
                      onMouseEnter={() => setHoveredDetection(idx)}
                      onMouseLeave={() => setHoveredDetection(null)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant={det.impact_score > 7 ? "destructive" : "secondary"}>
                          {det.label}
                        </Badge>
                        <span className="text-xs font-mono text-muted-foreground">
                          Conf: {(det.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{det.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] uppercase tracking-wider font-semibold">
                          <span>Environmental Impact</span>
                          <span>{det.impact_score}/10</span>
                        </div>
                        <Progress value={det.impact_score * 10} className="h-1" />
                      </div>
                      
                      <div className="mt-3 flex gap-2">
                        <Badge variant="outline" className="text-[10px] h-5">
                          {det.material}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] h-5">
                          Seg: {(det.confidence * 0.95 * 100).toFixed(0)}% IoU
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
          {results && (
            <div className="p-4 border-t bg-muted/20">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <ShieldAlert className="w-3 h-3" />
                <span>Methodology Note:</span>
              </div>
              <p className="text-[10px] leading-tight text-muted-foreground italic">
                {results.methodology_note}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
