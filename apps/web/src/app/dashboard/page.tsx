import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DashboardContentWorkflow } from '@/components/dashboard/dashboard-content-workflow';

export default async function DashboardPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <DashboardLayout>
      <DashboardContentWorkflow />
    </DashboardLayout>
  );
}
