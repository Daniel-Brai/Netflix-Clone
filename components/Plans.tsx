import Head from 'next/head'
import Link from 'next/link'
import useAuth  from '../hooks/useAuth'
import { CheckIcon } from '@heroicons/react/outline'
import Table from './Table'
import { Product } from '@stripe/firestore-stripe-payments'
import { useState } from 'react'
import Loader from './Loader'
import { loadCheckout }  from '../lib/stripe'

interface Props { 
    products: Product[]
}

function Plans({ products }: Props) {

  const { logout, user } = useAuth()
  const [ selectedPlan, setSelectedPlan ] = useState<Product | null>(products[2])
  const [ isBillingLoading, setBillingLoading ] = useState(false)
 
  const subscribeToPlan = () => { 
    if (!user) return

    loadCheckout(selectedPlan?.prices[0].id!)
    setBillingLoading(true)
  }
  return (
    <div>
        <Head>
            <title>Subscription Plans - Netflix </title>
            <link rel="icon" href="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Netflix_2015_N_logo.svg/185px-Netflix_2015_N_logo.svg.png" />
        </Head>

        <header className="border-b border-white/10 bg-[#141414] ">
            <Link href="/">
                <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/185px-Netflix_2015_logo.svg.png" 
                    alt="Netflix" 
                    width={120}
                    height={90}
                    className="cursor-pointer object-contain"
                />
            </Link>
        
            <button className="text-lg font-medium hover:underline" onClick={logout}>Sign Out</button>
        </header>

        <main className="mx-auto max-w-5xl px-5 pt-28 pb-12 transition-all md:px-10">
            <h1 className="mb-3 text-3xl font-medium">Choose the plan that's right for you</h1>

            <ul>
                <li className="flex items-center gap-x-2 text-lg">
                    <CheckIcon className="h-7 w-7 text-[#E50914]" /> Watch all you want.
                    Ad-free.
                </li>

                <li className="flex items-center gap-x-2 text-lg">
                    <CheckIcon className="h-7 w-7 text-[#E50914]" /> Recommendations
                    just for you.
                </li>

                <li className="flex items-center gap-x-2 text-lg">
                    <CheckIcon className="h-7 w-7 text-[#E50914]" /> Change or cancel
                    your plan anytime.
                </li>
            </ul>

            {/* Plans */}
            <div className="mt-4 flex flex-col space-y-4">
                <div className="flex w-full items-center justify-center self-end md:w-3/5">
                    {products.map((product) => (
                        <div className={`planBox ${selectedPlan?.id === product.id ? "opacity-100": "opacity-60"}`} onClick={() => setSelectedPlan(product)} key={product.id}>{product.name}</div>
                    ))}
                </div>
                
                {/* Table */}
                <Table products={products} selectedPlan={selectedPlan}/>

                {/* Subscribe button */}
                <button disabled={!selectedPlan || isBillingLoading} className={`mx-auto w-11/12 rounded bg-[#E50914] py-4 text-xl shadow hover:bg-[#f6121d] md:w-[420px] ${isBillingLoading && 'opacity-60'}`} onClick={subscribeToPlan} >
                    {isBillingLoading ? (<Loader color="dark:fill-gray-300" />) : 
                    (
                        'Subscribe'
                    )}
                </button> 
            </div>
        </main>
    
    </div>
  )
}

export default Plans