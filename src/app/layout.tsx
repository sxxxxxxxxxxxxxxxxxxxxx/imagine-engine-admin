import type { Metadata } from 'next';
import './globals.css';
import Clarity from '@/components/Clarity';
import AnalyticsTracker from '@/components/AnalyticsTracker';

export const metadata: Metadata = {
  title: 'Imagine Engine 管理后台',
  description: '专业的AI图像生成平台管理系统',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <Clarity />
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}