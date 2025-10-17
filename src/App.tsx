import { useContext, useEffect, useState } from "react"
import Card from "./components/Card"
import DiceRoller from "./components/DiceRoll"
import { MainContext } from "./datas/MainContext"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader } from "./components/ui/dialog"
import { Button } from "./components/ui/button"
import { Slider } from "./components/ui/slider"

const App = () => {


  const ctx = useContext(MainContext)

  const [openDialog, setOpenDialog] = useState<boolean>(false)

  const [isWin, setIswin] = useState<boolean>(false)

  const [inspiration, setInspiration] = useState<boolean>(true)


  useEffect(()=>{
    console.log(ctx?.cards)
    ctx?.setPosition()
  },[ctx?.cards])


  useEffect(()=>{

    if(ctx?.result !== 0){


      if(ctx?.isFlee){
        if(ctx.result >= ctx.onMonster?.flee){
          setIswin(true)
        }
        else{
          setIswin(false)
        }
      }
      else{
        if(ctx.result>= ctx.onMonster.cr){
          setIswin(true)
        }
        else{
          setIswin(false)

        }
      }
      setOpenDialog(true)
    }

  },[ctx?.result])


  const HandleDamage = () =>{
    if(!isWin){
      if(ctx.result === ctx.onMonster.cr -1){
        ctx.setHp(ctx.hp - ctx.onMonster.minDamage)
      }
      else if(ctx.result === 1){
        ctx.setHp(ctx.hp - ctx.onMonster.maxDamage)
      }
      else{
        ctx.setHp(ctx.hp - ctx.onMonster.baseDamage)
      }
    }
  }
  

  return (

    <div className="relative w-screen h-screen overflow-hidden">

      <Dialog open={openDialog} onOpenChange={()=>{setOpenDialog(false), ctx.setPosition(), HandleDamage()}}>


        <DialogContent className="w-fit bg-white">
          <DialogHeader>
            <h1 className="text-4xl font-bold w-full">
              {ctx.isFlee ?  
              (isWin ? "You have escaped from the monster": "The monster has damaged you") : 
              (isWin ? "You have defeated the monster": "The monster has damaged you")}
              </h1>
          </DialogHeader>
            <p className="text-5xl">{ctx.result}</p>
            <DialogFooter>
              {inspiration && !isWin ? 
              <div>
                <p>Wanna reroll from inspiration?</p>
                <Button onClick={()=>{setOpenDialog(false), setInspiration(false)}}>Reroll</Button>
              </div>:<></>
              }
              <DialogClose>
                <Button variant="secondary" className="text-3xl p-6">Ok</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
      </Dialog>
      
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col gap-10 items-center">
          {/* {ctx.onMonster.isBoss? 
          <h1 className="text-2xl font-bold">Boss</h1>: <></>} */}
          <Card></Card>
          <button className="text-5xl border-2 w-fit p-3 rounded-2xl" onClick={()=>{ctx?.setRoll(true), ctx.setIsFlee(false)}}>Fight</button>
          <button className="text-5xl border-2 w-fit p-3 rounded-2xl" onClick={()=>{ctx?.setRoll(true), ctx.setIsFlee(true)}}>Flee: {ctx?.onMonster?.flee}</button>
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
        {inspiration? 
        <img src="/inspiration.png" alt="" /> : <></>
        }
      </div>

      <div className="border-2 border-black absolute top-[50%] left-[15%] -translate-x-1/2 -translate-y-1/2 w-[25em] h-[25em] rounded-2xl flex justify-center items-center">
        BackBack
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