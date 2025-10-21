import { useContext, useEffect, useState } from "react"
import Card from "./components/Card"
import DiceRoller from "./components/DiceRoll"
import { MainContext } from "./datas/MainContext"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader } from "./components/ui/dialog"
import { Button } from "./components/ui/button"
import { Slider } from "./components/ui/slider"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./components/ui/hover-card"
import { toast } from "sonner"
import { CharacterContext } from "./datas/CharacterContext"

const App = () => {

  const ctx = useContext(MainContext)
  const characterCtx  = useContext(CharacterContext)

  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [openDialogGameover, setOpenDialogGameover] = useState<boolean>(false)

  const [isWin, setIswin] = useState<boolean>(true)



  const [usedItemOnce, setUsedItemOnce] = useState<boolean>(false)

  const [rolled, setRolled] = useState<boolean>(false)

  const [dmg, setDmg] = useState<number>(0)



  useEffect(()=>{
    console.log(ctx?.items)
    ctx?.setPosition()
  },[ctx?.cards])


  useEffect(()=>{
    if(ctx?.result !== 0){

      if(ctx?.isFlee){
        if(ctx.result + characterCtx.flee >= ctx.onMonster?.flee){
          setIswin(true)
        }
        else{
          setIswin(false)
        }
      }
      else{
        if(ctx.result + characterCtx.attack >= ctx.onMonster.cr){
          ctx.addItem()
          setIswin(true)
        }
        else{
          setIswin(false)

        }
      }

      setOpenDialog(true)
      HandleDummyDamage()
    }

  },[ctx?.result])

  const HandleDummyDamage = ()=>{
    let newNum = 0

    if(characterCtx.fullResistance){
      setDmg(0)
      return
    }

     if(!ctx.isFlee){
        if(ctx.result === ctx.onMonster.cr -1){
          newNum = ctx.onMonster.minDamage
        }
        else if(ctx.result === 1){
          newNum = ctx.onMonster.maxDamage
        }
        else{
          newNum = ctx.onMonster.baseDamage
        }
      }
      else{
         if(ctx.result === 1){
          newNum = ctx.onMonster.maxDamage
        }
        else{
          newNum = ctx.onMonster.baseDamage
        }
    }
    if(characterCtx.plusDmg)
        newNum += 2

    if (characterCtx.resistance)
        newNum = Math.floor(newNum/ 2)
    setDmg(newNum)     
  }


  const HandleDamage = () =>{
    console.log(isWin)
    if(!isWin){
      if(!ctx.isFlee){
        if(ctx.result === ctx.onMonster.cr -1){
          ctx.setHp(- ctx.onMonster.minDamage)
        }
        else if(ctx.result === 1){
          ctx.setHp(- ctx.onMonster.maxDamage)
        }
        else{
          ctx.setHp(- ctx.onMonster.baseDamage)
        }
      }
      else{
         if(ctx.result === 1){
          ctx.setHp(- ctx.onMonster.maxDamage)
        }
        else{
          ctx.setHp(- ctx.onMonster.baseDamage)
        }
      }
    }
  }


  const useItem = (name: string) =>{
    // if(!usedItemOnce){
    //   ctx.removeItem(name)
    //   setUsedItemOnce(true)
    // }
    // else{
    //   toast.error("You have already used an item this round")
    // }
    ctx.removeItem(name)
    setUsedItemOnce(true)
  }

  useEffect(()=>{
    if(ctx.hp < 1){
      setOpenDialogGameover(true)
    }
    if(ctx.position >  ctx.cards.length){
      setOpenDialogGameover(true)
    }

  }, [ctx.hp, ctx.position])

  function groupBy<T, K extends keyof any>(array: T[], getKey: (item: T) => K): Record<K, T[]> {
    return array.reduce((acc, item) => {
      const key = getKey(item);
      (acc[key] ||= []).push(item);
      return acc;
    }, {} as Record<K, T[]>);
  }

  const groupedItem = groupBy(ctx.items, item=>item.itemName)


  const HandelDialogClose = () =>{

    setOpenDialog(false)
    setRolled(false) 
    if (isWin || !ctx.isFlee){
      if(ctx.hp> 0){
        ctx.setPosition() 
      }
    }
    setUsedItemOnce(false)
    characterCtx.setToDefault()
  }
  

  return (
    <div className="relative w-screen h-screen overflow-hidden">
    <Dialog open={openDialogGameover} onOpenChange={()=>{window.location.reload()}}>
      <DialogContent>
        <DialogHeader>

        {ctx.hp < 1 ? 
          <h1 className="text-4xl font bold"> Game over!</h1>: <></>
        }

        {ctx.position > ctx.cards.length? 
        <h1 className="text-4xl font bold">You have won!!!</h1>: <></>
        }
        </DialogHeader>
      </DialogContent>
    </Dialog>


      <Dialog open={openDialog} onOpenChange={()=>{HandelDialogClose(), HandleDamage()}}>


        <DialogContent className="w-fit bg-white">
          <DialogHeader>
            <h1 className="text-4xl font-bold w-full">
              {ctx.isFlee ?  
              (isWin ? "You have escaped from the monster": 
                `You couldn't escape. The monster has damaged you ${dmg} hp`) : 
              (isWin ? "You have defeated the monster": 
              `The monster has damaged you ${dmg} hp`
              )}
              {/* ctx.result === ctx.onMonster?.cr - 1? ctx.onMonster.minDamage: (ctx.result === 1? ctx.onMonster.maxDamage: ctx.onMonster.baseDamage */}
              </h1>
          </DialogHeader>
            <p className="text-5xl">
              {ctx.result}
              {characterCtx.attack !== 0 && !ctx.isFlee? <span>{characterCtx.attack > 0? `+${characterCtx.attack}`: `${characterCtx.attack}`}</span>: <></>}  
              {characterCtx.flee !== 0 && ctx.isFlee? <span>{characterCtx.flee > 0? `+${characterCtx.flee}`: `${characterCtx.flee}`}</span>: <></>}  
              {/* {ctx.usedItem.flee_measure !== 0 && ctx.isFlee? <span>+{ctx.usedItem.flee_measure}</span>: <></>}   */}
            </p>
            <DialogFooter className="w-full flex justify-between gap-10">
              {ctx.inspiration && !isWin ? 
              <div className="flex items-center gap-2">
                <HoverCard>
                  <HoverCardTrigger>
                    <Button className="p-0 h-20 w-20" variant={"ghost"} onClick={()=>{setOpenDialog(false), ctx.setInspirtaion(false), setUsedItemOnce(false), setRolled(false), characterCtx.setToDefault()}}>
                      <img src="/inspiration.png" alt="" className="size-20" />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <p>
                    Reroll from inspiration
                    </p>
                  </HoverCardContent>
                </HoverCard>

              </div>:<></>
              }
              <DialogClose>
                <Button variant="secondary" className="text-3xl p-6">Ok</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
      </Dialog>
      
          {ctx?.onMonster?.isBoss? 
          <h1 className="text-2xl font-bold absolute top-[3%] left-[50%] -translate-x-1/2 -translate-y-1/2">Boss fight!</h1>: <></>}
      <div className="absolute top-[52%] left-[50%] -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col gap-10 items-center cardWrapper">
          <Card></Card>
          <button  className="text-5xl border-2 w-fit p-3 rounded-2xl" onClick={()=>{ctx?.setRoll(true), ctx.setIsFlee(false), setRolled(true)}}>Fight</button>
          <button className="text-5xl border-2 w-fit p-3 rounded-2xl" onClick={()=>{ctx?.setRoll(true), ctx.setIsFlee(true), setRolled(true)}}>Flee: {ctx?.onMonster?.flee}</button>
        </div>
      </div>

      <div className="border-0 absolute top-[10%] left-[15%] -translate-x-1/2 -translate-y-1/2 w-[25em] h-[5em] rounded-2xl flex justify-center items-center gap-4">
          <p className="text-2xl">{ctx.maxHp}/{ctx.hp}</p>
          <Slider
          disabled
          value={[ctx.hp]}
          max={ctx.maxHp}
          min={0}
          step={1}
          className="w-[20em] pointer-events-none [&_[role=slider]]:hidden"
          >
          </Slider>
      </div>

      
      <div className="border-0 absolute top-[10%] left-[32%] -translate-x-1/2 -translate-y-1/2 w-[5em] h-[5em] flex justify-center items-center">
        {ctx.inspiration? 
               <HoverCard>
                  <HoverCardTrigger>
                    <img src="/inspiration.png" alt="" /> 
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <p>Allows you to reroll once on a fail</p>
                  </HoverCardContent>
                </HoverCard>: <></>
        }
      </div>
        <div  className="relative border-2 border-black top-[30%] left-[15%] -translate-x-1/2 -translate-y-1/2 w-[25em] h-[5em] rounded-2xl p-1 flex items-center gap-2">
            <span className="absolute -top-3 left-4 bg-white px-2 text-sm font-semibold">
            Used Items
          </span>
          
          {ctx.usedItem.map(item=>{
            const szin = `${item.rarity==="common"? "#aaaaaa": (item.rarity=== "rare"? "#5de15d": (item.rarity === "epic"? "#AD03DE": "#FFD700"))}`
              const hatterSzin = `${item.rarity==="common"? "#aaaaaaab": (item.rarity=== "rare"? "#5de15dab": (item.rarity === "epic"? "#af03deab": "#ffd900ab"))}`
            return <img src={item.itemIcon} alt="" className={`size-16 border-2 rounded-[50%] p-1 z-10`}
             style={{
                  borderColor: szin,
                  backgroundColor: hatterSzin
            }}
            />
          })}
        </div>
      <div className="border-2 border-black relative top-[50%] left-[15%] -translate-x-1/2 -translate-y-1/2 w-[25em] h-[15em] rounded-2xl p-5">
          <span className="absolute -top-3 left-4 bg-white px-2 text-sm font-semibold">
            Inventory  
          </span>
        <div className="grid grid-cols-4">
           {Object.entries(groupedItem).map(([name, group]) => {

              const szin = `${group[0].rarity==="common"? "#aaaaaa": (group[0].rarity=== "rare"? "#5de15d": (group[0].rarity === "epic"? "#AD03DE": "#FFD700"))}`
              const hatterSzin = `${group[0].rarity==="common"? "#aaaaaaab": (group[0].rarity=== "rare"? "#5de15dab": (group[0].rarity === "epic"? "#af03deab": "#ffd900ab"))}`

            return    <HoverCard>
                  <HoverCardTrigger>
                    {/* <p onClick={()=>{useItem(idx)}}>{item.itemName}</p>  */}
                    <div className="relative inline-block" onClick={()=>{useItem(name)}}>
                      <p className=" px-3 py-1 w-24 h-24 z-10">
                        <img src={group[0].itemIcon} alt="" 
                        style={{
                              borderColor: szin,
                              backgroundColor: hatterSzin
                        }}
                        className={`size-16 border-2 rounded-[50%] p-1 z-10`}/>
                      </p>
                      <span className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 text-xs rounded-full px-1">
                        {group.length}
                      </span>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="cursor-pointer">
                    <p className="text-xl font-bold">{name}</p>
                    <p>{group[0].description}</p>
                  </HoverCardContent>
                </HoverCard>;
          })}
        </div>
      </div>

      <div className=" absolute top-[20%] left-[80%] -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">
        <DiceRoller></DiceRoller>
      </div>

      <div className="border-2 border-black absolute top-[70%] left-[85%] -translate-x-1/2 -translate-y-1/2 w-[15em] h-[23em] rounded-2xl flex justify-center items-center">
        {ctx.position} / {ctx.cards.length}
      </div>
    </div>
  )
}

export default App