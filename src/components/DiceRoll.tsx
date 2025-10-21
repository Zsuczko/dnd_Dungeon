// src/components/DiceRoller.tsx
import { useContext, useEffect, useRef, useState } from "react";
import DiceBox from "@3d-dice/dice-box";
import { MainContext } from "../datas/MainContext";
import { CharacterContext } from "../datas/CharacterContext";

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

  const [results, setResults] = useState<number[]>([])
  const [vami, setVami] = useState<boolean>(false)

  const ctx = useContext(MainContext)
  const character = useContext(CharacterContext)

  useEffect(() => {
    if(first) {

        const box = new DiceBox("#dice-box", {
            assetPath: "/assets/dice-box/", 
            theme: "wooden",
            Offscreen: true,
            scale: 14,
        });
        boxRef.current = box;
        
        box.init().then(() => {
            console.log("DiceBox ready");
            
            box.onRollComplete = (results: DiceResult[]) => {
                // results.forEach(element => {
                    
                //     ctx?.setResult(element.value)
                // });
              setResults([])
              results.forEach(element=>{
                setResults(prev=>[...prev, element.value])
              })
              // console.log(character.advantage)
              // if(character.advantage){

              //   const dobasok: number[] = []
              //   results.forEach(element => {
                    
              //       dobasok.push(element.value)
              //   });             
              //   console.log(dobasok)
              //   ctx.setResult(dobasok.sort()[1])
              // }
              // else if(character.disadvantage){

              //   const dobasok: number[] = []
              //   results.forEach(element => {
                    
              //       dobasok.push(element.value)
              //   });             
              //   ctx.setResult(dobasok.sort()[0])
              // }
              // else{
              //   ctx?.setResult(results[0].value)                
              // }

            };
        });
        setFirst(false)
    }
  }, [onResult]);

  useEffect(()=>{

    if(vami){
      if(character.advantage){
        
        ctx.setResult(results.sort((a,b)=>a-b)[1])
      }
      else if(character.disadvantage){            
        ctx.setResult(results.sort((a,b)=>a-b)[0])
      }
      else{
        ctx?.setResult(results[0])                
      }
    }
  },[results])



  
  const rollDice = (notation: string | string[]) => {
    if (!boxRef.current) return;
    const toRoll = Array.isArray(notation) ? notation : [notation];
    boxRef.current.roll(toRoll);
  };

  useEffect(()=>{
    if (ctx?.roll === true){
      setVami(true)
      console.log(character.advantage)
      if(character.advantage || character.disadvantage){

        rollDice(["1d20", "1d20"])
        ctx.setRoll(false)
      }
      else{
        console.log("jó")


          rollDice(["1d20"])
        ctx.setRoll(false)
      }
    }
  },[ctx?.roll])

  return (
    <div >
    <div
    className="w-[28em] h-[20em] bg-[url(bgs/dicetray3.png)] bg-contain bg-no-repeat bg-center"
        id="dice-box"
        
        // onClick={() => rollDice(["1d20", "1d20"])}
    />
    </div>
    );
}
