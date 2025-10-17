import { useContext, useEffect } from "react"
import Card from "./components/Card"
import DiceRoller from "./components/DiceRoll"
import { MainContext } from "./datas/MainContext"

const App = () => {


  const ctx = useContext(MainContext)


  useEffect(()=>{
    console.log(ctx?.cards)
    ctx?.setPosition()
  },[ctx?.cards])

  return (

    <div>
      
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col gap-10 items-center">
          <Card></Card>
          <button className="text-5xl border-2 w-fit p-3 rounded-2xl" onClick={()=>{ctx?.setRoll(true)}}>Fight</button>
          <button className="text-5xl border-2 w-fit p-3 rounded-2xl" onClick={()=>{ctx?.setRoll(true)}}>Flee: {ctx?.onMonster?.flee}</button>
        </div>
      </div>

      <div className="border-2 border-black absolute top-[10%] left-[15%] -translate-x-1/2 -translate-y-1/2 w-[25em] h-[5em] rounded-2xl flex justify-center items-center">
        ❤❤❤❤❤
      </div>

      
      <div className="border-2 border-black absolute top-[10%] left-[32%] -translate-x-1/2 -translate-y-1/2 w-[5em] h-[5em] rounded-[50%] flex justify-center items-center">
        In
      </div>

      <div className="border-2 border-black absolute top-[50%] left-[15%] -translate-x-1/2 -translate-y-1/2 w-[25em] h-[25em] rounded-2xl flex justify-center items-center">
        BackBack
      </div>

      <div className=" absolute top-[20%] left-[80%] -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">
        <DiceRoller></DiceRoller>
      </div>

      <div className="border-2 border-black absolute top-[70%] left-[85%] -translate-x-1/2 -translate-y-1/2 w-[15em] h-[23em] rounded-2xl flex justify-center items-center">
        Cards
      </div>
    </div>
  )
}

export default App