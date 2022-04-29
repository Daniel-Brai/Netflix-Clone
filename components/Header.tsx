import { BellIcon, SearchIcon } from '@heroicons/react/solid'
import { useState, useEffect } from "react"
import Link from 'next/link'
import useAuth from '../hooks/useAuth'
import BasicMenu from './BasicMenu'

function Header() {

  const { logout} = useAuth()

  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => { 
      const scrollHandler = () => {
        window.onscroll = () => {
            setIsScrolled(window.scrollY === 0 ? false : true );
            return () => (window.onscroll === null)
        }
      }
      scrollHandler()
  }, [])

  return (
      <header className={`${isScrolled && 'bg-[#141414]'}`}>
          <div className="flex items-center space-x-2 md:space-x-10">
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/185px-Netflix_2015_logo.svg.png"
                width={100}
                height={100}
                alt="Netflix Logo"
                className="cursor-pointer object-contain"
            />

            <BasicMenu/>

            <ul className="hidden space-x-4 md:flex">
                <li className="headerLink">Home</li>
                <li className="headerLink">TV Shows</li>
                <li className="headerLink">Movies</li>
                <li className="headerLink">New & Popular</li>
                <li className="headerLink">My List</li>
            </ul>
          </div>

          <div className="flex items-center space-x-4 text-sm font-light">
              <SearchIcon className="hidden sm:inline h-6 w-6"/>
              <p className="hidden lg:inline">Kids</p>
              <BellIcon className="h-6 w-6"/>
              <Link href="/account">
                <img
                    src="https://rb.gy/g1pwyx"
                    alt="profile image"
                    className="cursor-pointer rounded"
                />
              </Link>
          </div>
      </header>
  )
}

export default Header