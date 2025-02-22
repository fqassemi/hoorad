import React from 'react'
import Blog from '@/components/templates/blogs'

import fetchDataHandler from '@/lib/fetchDataHandler';

export const revalidate = 60;

export default async function page() {
    const blogsData = await fetchDataHandler('blogs', {}, true);
  return (
    <div className='mt-3'>
      <Blog blogsDetail={blogsData} />
    </div>
  )
}


