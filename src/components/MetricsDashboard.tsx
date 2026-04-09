import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const trainingData = [
  { epoch: 1, loss: 0.85, map: 0.25, accuracy: 0.45 },
  { epoch: 10, loss: 0.62, map: 0.42, accuracy: 0.58 },
  { epoch: 20, loss: 0.45, map: 0.58, accuracy: 0.69 },
  { epoch: 30, loss: 0.32, map: 0.71, accuracy: 0.78 },
  { epoch: 40, loss: 0.24, map: 0.79, accuracy: 0.84 },
  { epoch: 50, loss: 0.18, map: 0.84, accuracy: 0.88 },
];

const classPerformance = [
  { name: 'Plastic', precision: 0.89, recall: 0.85, f1: 0.87 },
  { name: 'Metal', precision: 0.82, recall: 0.78, f1: 0.80 },
  { name: 'Fishing Net', precision: 0.75, recall: 0.72, f1: 0.73 },
  { name: 'Glass', precision: 0.88, recall: 0.81, f1: 0.84 },
  { name: 'Rubber', precision: 0.79, recall: 0.74, f1: 0.76 },
];

export const MetricsDashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Training Progress (50 Epochs)</CardTitle>
          <CardDescription>Loss reduction and mAP improvement over training cycles</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trainingData}>
              <defs>
                <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMap" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="epoch" label={{ value: 'Epoch', position: 'insideBottom', offset: -5 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="loss" stroke="#ef4444" fillOpacity={1} fill="url(#colorLoss)" name="Training Loss" />
              <Area type="monotone" dataKey="map" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMap)" name="mAP@50" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Class-wise Performance</CardTitle>
          <CardDescription>Precision, Recall, and F1-Score per debris category</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={classPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 1]} />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="precision" fill="#10b981" name="Precision" />
              <Bar dataKey="recall" fill="#f59e0b" name="Recall" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Model Comparison</CardTitle>
          <CardDescription>Inference Latency vs. Accuracy</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[
              { model: 'YOLOv8n', latency: 12, accuracy: 0.78 },
              { model: 'YOLOv8s', latency: 25, accuracy: 0.84 },
              { model: 'YOLOv8m', latency: 45, accuracy: 0.89 },
              { model: 'U-Net', latency: 85, accuracy: 0.92 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="model" />
              <YAxis yAxisId="left" label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Accuracy', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="latency" stroke="#8884d8" name="Latency (ms)" />
              <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="#82ca9d" name="Accuracy" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
