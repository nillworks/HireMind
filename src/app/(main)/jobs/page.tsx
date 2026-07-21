import { Suspense } from 'react'
import AllJobsPage from '@/components/AllJobs/AllJobsPage'

const page = () => {
  return (
    <Suspense>
      <AllJobsPage />
    </Suspense>
  )
}

export default page
