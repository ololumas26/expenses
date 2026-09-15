import { Suspense } from 'react'
import SuccessContent from '@/components/success/SuccessContent'

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>A carregar...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
