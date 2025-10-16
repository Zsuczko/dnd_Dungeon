// src/components/DiceRoller.tsx
import { useEffect, useRef, useState } from "react";
import DiceBox from "@3d-dice/dice-box";

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
                results.forEach(element => {
                    
                    console.log("Dice results:", element.value);
                });
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

  return (
    <div >
    <div
    className="border-2 border-black w-[25em] h-[15em]"
        id="dice-box"
        
        onClick={() => rollDice(["1d20", "1d4"])}
    />
    </div>
    );
}
