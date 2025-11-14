'use client'
import React, { useEffect, useRef, useState, useTransition } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { MetaData } from '@/app/types/document'



 const SearchBar = () => {

   
    const [isSearching, setIsSearching ] = useState(false)
  return (
    <div className='relative w-full h-14 flex flex-col bg-white'>
<div className='relative h-14 z-10 rounded-md'>
    <Input
   />
    <Button disabled={isSearching} size="sm"  className='absolute right-0 inset-y-0 h-full rounded-l-none'>
       { isSearching ? <Loader2 className='h-6 w-6 animate-spin' /> : <Search className='h-6 w-6'/>}
    </Button>
</div>
    </div>
  )
}
export default SearchBar
