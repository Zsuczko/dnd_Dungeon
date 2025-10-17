import { useContext } from "react"
import { MainContext } from "../datas/MainContext"


const Card = () => {

  const ctx = useContext(MainContext)

  return (
    <div className='p-6 border-2 border-black flex justify-center flex-col items-center gap-1 w-fit rounded-2xl h-[23em]'>
    
      <p>
        <img className="size-[10em]" src={ctx?.onMonster?.enemyIcon} alt="" />
      </p>
      <p className='text-3xl font-bold'>{ctx?.onMonster?.enemyName}</p>
      <p className='text-5xl'>{ctx?.onMonster?.cr}</p>
    </div>
  )
}

export default Card