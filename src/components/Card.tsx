import { useContext, useState } from "react"
import { MainContext } from "../datas/MainContext"


const Card = () => {

  const ctx = useContext(MainContext)

  const [flipped, setFlipped] = useState<boolean>(true)

  const flipCard = () => {
    setFlipped(prev => !prev)
    console.log(flipped)
  }

  return (

    <div className="card-wrapper" onClick={flipCard}>

    <div className={flipped ? "card" : "card faceDown"}>


      <div className='front p-6 border-2 border-black flex justify-center flex-col items-center gap-1 w-fit rounded-2xl h-[23em]'>
      
        <p>
          <img className="size-[10em]" src={ctx?.onMonster?.enemyIcon} alt="" />
        </p>
        <p className='text-3xl font-bold'>{ctx?.onMonster?.enemyName}</p>
        <p className='text-5xl'>{ctx?.onMonster?.cr}</p>
        <p><img src={ctx.onItem?.itemIcon} className="size-15 border-2 rounded-[50%] border-[#FFD700] bg-[#fcfba585] p-1" /></p>
      </div>
      <div className="back p-6 text-white border-2 border-black flex justify-center flex-col items-center gap-1 w-fit rounded-2xl h-[23em]">
        <p>Damage: {ctx?.onMonster?.minDamage} - {ctx?.onMonster?.maxDamage}</p>
        <p>Description: {ctx?.onMonster?.description}</p>
      </div>
    </div>
    </div>
  )
}

export default Card