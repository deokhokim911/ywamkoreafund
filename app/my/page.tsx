import { DonorDashboardPage } from '@/components/donor/DonorDashboardPage'

export const metadata = {
  title: '내 후원 현황 | YWAMFund',
  description: '후원한 캠페인, 후원 금액, 기부 영수증을 확인하세요.',
}

export default function MyPage() {
  return <DonorDashboardPage />
}
