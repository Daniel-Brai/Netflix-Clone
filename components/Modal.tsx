import { CheckIcon, PlusIcon, VolumeOffIcon, VolumeUpIcon , XIcon } from '@heroicons/react/solid'
import MuiModal from '@mui/material/Modal'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { modalState, movieState } from '../atoms/modalAtom'
import { Element, Genre, Movie } from '../typings'
import ReactPlayer from 'react-player/lazy'
import { FaPlay } from 'react-icons/fa'
import { ThumbUpIcon } from '@heroicons/react/outline'
import { collection, deleteDoc, doc, DocumentData, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import toast, { Toaster } from 'react-hot-toast'
import useAuth from '../hooks/useAuth'


function Modal() {
  const [ showModal, setShowModal ] = useRecoilState(modalState)
  const [ movie, setMovie ] = useRecoilState(movieState)
  const [ trailer, setTrailer ] = useState('')
  const [ genres , setGenres ] = useState<Genre[]>([])
  const [muted, setMuted ] = useState(false)
  const [ addedToList, setAddedToList ] = useState(false)
  const { user } = useAuth()
  const [ movies, setMovies ] = useState<DocumentData[] | Movie[]>([])
  
  const toastStyle = { 
    background: 'white',
    color: 'black', 
    fontWeight: 'bold', 
    fontSize: '16px',
    padding: '15px',
    borderRadius: '9999px',
    maxWidth: '1000px',
  }

  const handleClose = () => { 
    setShowModal(false)
    setMovie(null)
    toast.dismiss()
  }

  // Find all the movies in the user's list
  useEffect(() => {
    if (user) {
      return onSnapshot(
        collection(db, 'customers', user.uid, 'myList'),
        (snapshot) => setMovies(snapshot.docs)
      )
    }
  }, [db, movie?.id])

  // Check if the movie is already in the user's list
  useEffect(
    () =>
      setAddedToList(
        movies.findIndex((result) => result.data().id === movie?.id) !== -1
      ),
    [movies]
  )

  useEffect(() => {
    
    async function fetchMovie() {
        const data = await fetch(
            `https://api.themoviedb.org/3/${
            movie?.media_type === 'tv' ? 'tv' : 'movie'
            }/${movie?.id}?api_key=${
            process.env.NEXT_PUBLIC_API_KEY
            }&language=en-US&append_to_response=videos`
        )
            .then((response) => response.json())
            .catch((err) => console.log(err.message))
        
        if (data?.videos) {

            const index = data.videos.results.findIndex(
            (element: Element) => element.type === 'Trailer'
            )
            setTrailer(data.videos?.results[index]?.key)
        }
        if (data?.genres) {
            setGenres(data.genres)
        }
    }

    fetchMovie()
  },[movie])

    const handleList = async () => {
        if (addedToList) { 
            await deleteDoc(doc(db, "customers", user!.uid, "myList", movie?.id.toString()!))
            
            toast(`${movie?.title || movie?.original_name} has been removed from your List`, {
                duration: 5000,
                style: toastStyle
            })
        }
        else { 
            await setDoc(doc(db, "customers", user!.uid, 'myList', movie?.id.toString()!), {...movie})
        
            toast(`${movie?.title || movie?.original_name} has been added to your List`, {
                duration: 5000,
                style: toastStyle
            })
        }
    }

  return (
    <MuiModal className="fixed !top-7 left-0 right-0 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide" open={showModal} onClose={handleClose}>
        <>
        <Toaster position="bottom-center"/>

           <button onClick={handleClose} className="modalBtn w-9 h-9 absolute right-5 top-5 !z-40 border-none bg-[#181818] hover:bg-[#181818]">
               <XIcon className="h-6 w-6"/>
           </button>

           <div className="relative pt-[56.25%]">
                <ReactPlayer
                    url={`https://www.youtube.com/watch?v=${trailer}`}
                    width="100%"
                    height="100%"
                    style={{ position: 'absolute', top: '0', left: '0' }}
                    playing
                    muted={muted}
                />

                <div className="absolute -bottom-14 flex w-full items-center justify-between px-10">
                    <div className="flex space-x-2">
                        <button className="flex items-center gap-x-2 rounded bg-white px-8 text-xl font-bold text-black transition hover:bg-[#E6E6E6]">
                            <FaPlay className="h-7 w-7 text-black"/>
                            Play
                        </button>

                        <button className="modalBtn" onClick={handleList}>
                            { addedToList ? (
                                <CheckIcon className="w-7 h-7"/>
                            ) : (
                                <PlusIcon className="w-7 h-7"/>
                            )}
                            
                        </button>

                        <button className="modalBtn">
                            <ThumbUpIcon className="w-7 h-7"/>
                        </button>
                    </div>

                    <button className="modalBtn" onClick={() => setMuted(!muted)}>
                        {muted ? (
                            <VolumeOffIcon className="w-7 h-7"/>
                        ): (
                            <VolumeUpIcon className="w-7 h-7"/>
                        )}
                    </button>
                </div>
           </div>

           <div className="flex space-x-16 rounded-b-md bg-[#181818] px-10 py-8">
               <div className="space-y-6 mt-10 text-lg">
                   <div className="flex items-center space-x-2 text-sm">
                       <p className="font-semibold text-green-400">{movie!.vote_average * 10}% Match</p>
                       <p className="font-light">{movie?.release_date || movie?.first_air_date}</p>
                       <div className="flex h-4 items-center justify-center rounded border border-white/40 px-1.5 text-xs">HD</div>
                   </div>

                   <div className="flex flex-col gap-x-10 gap-y-4 font-light md:flex-row">
                       <p className="w-5/6">{movie?.overview}</p>
                       <div className="flex flex-col space-y-3 text-sm">
                           <div>
                               <span className="text-[gray]">Genres: {genres.map((genre) => genre.name).join(', ')}</span>
                            </div>

                            <div>
                                <span className="text-[gray]">Original language: {movie?.original_language}</span>
                            </div>

                            <div className="flex flex-col gap-y-3">
                                <span className="text-[gray]">Total votes: {movie?.vote_count}</span>
                                <span className="text-[gray]">Popularity: {movie?.popularity}</span>
                            </div>
                       </div>
                   </div>
               </div>
           </div>
        </>
    </MuiModal>
  )
}

export default Modal