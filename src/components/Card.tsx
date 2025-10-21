import { useContext, useState } from "react"
import { MainContext } from "../datas/MainContext"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card"


const Card = () => {

  const ctx = useContext(MainContext)

  const [flipped, setFlipped] = useState<boolean>(true)

  const flipCard = () => {
    setFlipped(prev => !prev)
    console.log(flipped)
  }

  const szin = `${ctx.onItem?.rarity==="common"? "#aaaaaa": (ctx.onItem?.rarity=== "rare"? "#5de15d": (ctx.onItem?.rarity === "epic"? "#AD03DE": "#FFD700"))}`
  const hatterSzin = `${ctx.onItem?.rarity==="common"? "#aaaaaaab": (ctx.onItem?.rarity=== "rare"? "#5de15dab": (ctx.onItem?.rarity === "epic"? "#af03deab": "#ffd900ab"))}`

  return (

    <div className="card-wrapper" onClick={flipCard}>

    <div className={flipped ? "card" : "card faceDown"}>


      <div className='front p-6 border-2 border-black flex justify-center flex-col items-center gap-1 w-fit rounded-2xl h-[23em]'>
      
        <p>
          <img className="size-[10em]" src={ctx?.onMonster?.enemyIcon} alt="" />
        </p>
        <p className='text-3xl font-bold'>{ctx?.onMonster?.enemyName}</p>
        <p className='text-5xl'>{ctx?.onMonster?.cr}</p>
        <p>
            <HoverCard>
                  <HoverCardTrigger>
                  <img src={ctx.onItem?.itemIcon} className={`size-15 border-2 rounded-[50%] p-1`}  
                  style={{
                        borderColor: szin,
                        backgroundColor: hatterSzin
                  }} />
                  {/* <img src={ctx.onItem?.itemIcon} className={`size-15 border-2 rounded-[50%] border-[${ctx.onItem?.rarity==="common"? "#aaaaaa": (ctx.onItem?.rarity=== "rare"? "#5de15d": (ctx.onItem?.rarity === "epic"? "#AD03DE": "#FFD700"))}] bg-[${ctx.onItem?.rarity==="common"? "#aaaaaaab": (ctx.onItem?.rarity=== "rare"? "#5de15dab": (ctx.onItem?.rarity === "epic"? "#af03deab": "#ffd900ab"))}] p-1`} /> */}

                  </HoverCardTrigger>
                  <HoverCardContent className="cursor-pointer">
                    <p className="text-sm">{ctx.onItem?.itemName}</p>
                  </HoverCardContent>
                </HoverCard>
          </p>
      </div>
      <div className="back p-6 text-white border-2 border-black flex flex-col gap-1 w-fit rounded-2xl h-[23em]">
        <p><span className="text-lg font-bold">Damage:</span> {ctx?.onMonster?.minDamage} - {ctx?.onMonster?.maxDamage}</p>
        <p><span className="text-lg font-bold">Description:</span> <br />{ctx?.onMonster?.description}</p>
      </div>
    </div>
    </div>
  )
}

export default Card