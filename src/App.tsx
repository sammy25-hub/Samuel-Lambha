import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { DetectionView } from './components/DetectionView';
import { MetricsDashboard } from './components/MetricsDashboard';
import { ResearchPaper } from './components/ResearchPaper';
import { Waves, BarChart3, FileText, Settings, Github, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function App() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Waves className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">MarineGuard AI</h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Debris Detection System</span>
              <Badge variant="secondary" className="text-[8px] h-4 px-1 uppercase">v2.4-Research</Badge>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <div className="flex items-center gap-2 hover:text-primary cursor-pointer transition-colors">
            <Database className="w-4 h-4" />
            <span>TrashCan v1.0</span>
          </div>
          <div className="flex items-center gap-2 hover:text-primary cursor-pointer transition-colors">
            <Github className="w-4 h-4" />
            <span>Source Code</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto">
        <Tabs defaultValue="detection" className="w-full">
          <div className="bg-white border-b px-6">
            <TabsList className="h-14 bg-transparent gap-8">
              <TabsTrigger 
                value="detection" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-2 gap-2"
              >
                <Waves className="w-4 h-4" />
                Detection Engine
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-2 gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Research Metrics
              </TabsTrigger>
              <TabsTrigger 
                value="paper" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-2 gap-2"
              >
                <FileText className="w-4 h-4" />
                Academic Paper
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-2 gap-2"
              >
                <Settings className="w-4 h-4" />
                Model Config
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="detection" className="mt-0 focus-visible:ring-0">
              <DetectionView />
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-0 focus-visible:ring-0">
              <MetricsDashboard />
            </TabsContent>
            
            <TabsContent value="paper" className="mt-0 focus-visible:ring-0">
              <ResearchPaper />
            </TabsContent>

            <TabsContent value="settings" className="mt-0 focus-visible:ring-0">
              <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
                <Settings className="w-12 h-12 mx-auto text-muted-foreground opacity-20" />
                <h3 className="text-lg font-semibold">Model Configuration</h3>
                <p className="text-muted-foreground">
                  Configure hyperparameters for YOLOv8 and U-Net architectures. 
                  Adjust confidence thresholds and NMS (Non-Maximum Suppression) values for specific marine environments.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-8">
                  <div className="p-4 border rounded-lg bg-white">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Confidence Threshold</label>
                    <div className="mt-2 flex items-center gap-4">
                      <input type="range" className="flex-1" defaultValue={50} />
                      <span className="text-sm font-mono">0.50</span>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg bg-white">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">IoU Threshold</label>
                    <div className="mt-2 flex items-center gap-4">
                      <input type="range" className="flex-1" defaultValue={45} />
                      <span className="text-sm font-mono">0.45</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </main>

      {/* Footer / Status Bar */}
      <footer className="h-8 border-t bg-white fixed bottom-0 w-full flex items-center justify-between px-4 text-[10px] font-medium text-muted-foreground uppercase tracking-widest z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>System Ready</span>
          </div>
          <Separator orientation="vertical" className="h-3" />
          <span>GPU: NVIDIA A100 (Simulated)</span>
          <Separator orientation="vertical" className="h-3" />
          <span>Inference: 42ms</span>
        </div>
        <div className="flex items-center gap-4">
          <span>MarineGuard AI Research Platform v2.4.0</span>
        </div>
      </footer>
    </div>
  );
}

