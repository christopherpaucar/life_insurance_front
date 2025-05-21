import React from 'react';
import Link from 'next/link';

interface ReportCardProps {
  title: string;
  description: string;
  href: string;
}

export const ReportCard: React.FC<ReportCardProps> = ({ title, description, href }) => {
  return (
    <Link href={href}>
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
};
