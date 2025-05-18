'use client'

import React from 'react'
import { ReportCard } from '@/components/reports/ReportCard'

interface PendingRequestsPageProps {
	params: {
		role: string
	}
}

export default function PendingRequestsPage({ params }: PendingRequestsPageProps) {
	const role = params.role

	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-bold">Solicitudes Pendientes</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<ReportCard
					title="Nuevas Solicitudes"
					description="Ver solicitudes recién creadas"
					href={`/${role}/reports/pending-requests/new`}
				/>
				<ReportCard
					title="En Revisión"
					description="Ver solicitudes en proceso de revisión"
					href={`/${role}/reports/pending-requests/in-review`}
				/>
				<ReportCard
					title="Por Aprobar"
					description="Ver solicitudes listas para aprobar"
					href={`/${role}/reports/pending-requests/approval`}
				/>
			</div>
		</div>
	)
}
