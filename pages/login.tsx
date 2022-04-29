import Head from "next/head"
import Image from "next/image"
import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import useAuth from '../hooks/useAuth'


interface Inputs { 
    email: string,
    password: string,
}

function login() {

  const [ login, setLogin ] = useState(false);

  const { signIn, signUp } = useAuth()

  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async({email, password}) => { 
    if (login) { 
        await signIn(email, password)
    }
    else {
        await signUp(email, password)
    }
  }
  
  return (
    <div className="relative h-screen w-screen flex flex-col bg-black md:items-center md:justify-center md:bg-transparent">
        <Head>
            <title>Login- Netflix </title>
            <link rel="icon" href="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Netflix_2015_N_logo.svg/185px-Netflix_2015_N_logo.svg.png" />
        </Head>

        <Image
            src="https://assets.nflxext.com/ffe/siteui/vlv3/d0982892-13ac-4702-b9fa-87a410c1f2da/519e3d3a-1c8c-4fdb-8f8a-7eabdbe87056/AE-en-20220321-popsignuptwoweeks-perspective_alpha_website_large.jpg"
            alt="Netflix login Home Banner"
            layout="fill"
            className="-z-10 !hidden opacity-60 sm:!inline"
            objectFit="cover"
        />
        <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/185px-Netflix_2015_logo.svg.png"
            width={150}
            height={150}
            alt="Netflix Text Logo"
            className=" absolute left-4 top-4 md:left-10 md:top-6 cursor-pointer object-contain"
        />

        <form onSubmit={handleSubmit(onSubmit)} className="relative mt-24 space-y-8 rounded bg-black/75 py-10 px-6 md:mt-0 md:max-w-md md:px-14">
            <h1 className="text-4xl font-semibold">Sign In</h1>

            <div className="space-y-4">
                <label className="inline-block w-full">
                    <input className="input" type="email" placeholder="Email" {...register('email', { required: true})}/>
                    {/* errors will return when field validation fails  */}
                    {errors.email && <p className="p-1 text-[13px] font-light text-orange-500">Please enter a valid email.</p>}
                </label>

                <label className="inline-block w-full">
                    <input className="input" type="password" placeholder="Password" {...register('password', { required: true, pattern: /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{4,60}$/})}/>
                    {errors.password && <p className="p-1 text-[13px] font-light text-orange-500">Your password must contain a capital letter, a special character and a number(s) and at least 4 characters</p>}

                </label>
            </div>

            <button type="submit" className="w-full rounde bg-[#E50914] py-3 font-semibold" onClick={() => setLogin(true)}>Sign In</button>

            <div className="text-[gray]">
                New to Netflix?{' '}
                <button type="submit" className="text-white hover:underline" onClick={() => setLogin(false)}>Sign Up</button>
            </div>
        </form>
        
    </div>
  )
}

export default login