import AdminCollegeUpdate from '@/pagess/AdminPages/AdminCollegeUpdate/AdminCollegeUpdate';
import React, { Suspense } from 'react'

export default function CollegeUpdatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminCollegeUpdate />
    </Suspense>
  );
}
