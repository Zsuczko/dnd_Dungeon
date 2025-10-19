// src/components/DiceRoller.tsx
import { useContext, useEffect, useRef, useState } from "react";
import DiceBox from "@3d-dice/dice-box";
import { MainContext } from "../datas/MainContext";

// Temporary type declaration so TS stops complaining
declare module "@3d-dice/dice-box";

type DiceResult = {
  notation: string;
  value: number;
};

interface DiceRollerProps {
  onResult?: (results: DiceResult[]) => void;
}

export default function DiceRoller({ onResult }: DiceRollerProps) {
  const boxRef = useRef<any>(null);

  const [first, setFirst] = useState<boolean>(true)

  const ctx = useContext(MainContext)

  useEffect(() => {
    if(first) {

        const box = new DiceBox("#dice-box", {
            assetPath: "/assets/dice-box/", 
            theme: "default",
            Offscreen: true,
            scale: 17,
        });
        boxRef.current = box;
        
        box.init().then(() => {
            console.log("DiceBox ready");
            
            box.onRollComplete = (results: DiceResult[]) => {
                // results.forEach(element => {
                    
                //     ctx?.setResult(element.value)
                // });

                
              console.log(ctx.usedItem.givesAdvantage)

              if(!ctx.usedItem.givesAdvantage){
                ctx?.setResult(results[0].value)
              }
              else{
                const dobasok: number[] = []
                results.forEach(element => {
                    
                    dobasok.push(element.value)
                });             
                ctx.setResult(dobasok.sort()[1])
              }

            };
        });
        setFirst(false)
    }
  }, [onResult]);

  
  const rollDice = (notation: string | string[]) => {
    if (!boxRef.current) return;
    const toRoll = Array.isArray(notation) ? notation : [notation];
    boxRef.current.roll(toRoll);
  };

  useEffect(()=>{
    if (ctx?.roll === true){

      if(!ctx.usedItem.givesAdvantage){

        rollDice(["1d20"])
        ctx.setRoll(false)
      }
      else{
        console.log("jó")
        rollDice(["1d20", "1d20"])
        ctx.setRoll(false)
      }
    }
  },[ctx?.roll])

  return (
    <div >
    <div
    className="border-2 border-black w-[30em] h-[15em]"
        id="dice-box"
        
        // onClick={() => rollDice(["1d20", "1d20"])}
    />
    </div>
    );
}
