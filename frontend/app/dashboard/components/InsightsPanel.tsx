'use client';

import { motion } from 'framer-motion';

interface Insight {
  id: string;
  message: string;
  type: 'positive' | 'negative' | 'neutral';
  metric: string;
  change: number;
}

interface InsightsPanelProps {
  insights?: Insight[];
}

const mockInsights: Insight[] = [
  {
    id: '1',
    message: 'Engagement rate increased',
    type: 'positive',
    metric: 'engagement',
    change: 12,
  },
  {
    id: '2',
    message: 'Outperforming luxury average',
    type: 'positive',
    metric: 'benchmark',
    change: 8,
  },
  {
    id: '3',
    message: 'Follower growth steady',
    type: 'neutral',
    metric: 'followers',
    change: 3,
  },
];

export default function InsightsPanel({ insights = mockInsights }: InsightsPanelProps) {
  const getColorClass = (type: string) => {
    switch (type) {
      case 'positive':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'negative':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getChangeSymbol = (change: number, type: string) => {
    if (type === 'positive') return '+';
    if (type === 'negative') return '-';
    return '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl bg-white p-6 shadow-sm"
    >
      <h3 className="mb-6 text-lg font-medium text-gray-900">Performance Insights</h3>
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className={`rounded-lg border p-4 ${getColorClass(insight.type)}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{insight.message}</p>
              <span className="text-sm font-semibold">
                {getChangeSymbol(insight.change, insight.type)}
                {insight.change}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}




