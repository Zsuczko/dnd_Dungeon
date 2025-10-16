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
  const boxRef = useRef<any>(null); // store DiceBox instance

  const [first, setFirst] = useState<boolean>(true)

  // Initialize DiceBox once
  useEffect(() => {
    if(first) {

        const box = new DiceBox("#dice-box", {
            assetPath: "/assets/dice-box/", 
            theme: "default",
            Offscreen: true,
            scale: 20,
        });
        boxRef.current = box;
        
        box.init().then(() => {
            console.log("DiceBox ready");
            
            
            // Optional: capture roll results
            box.onRollComplete = (results: DiceResult[]) => {
                console.log("Dice results:", results[0].value);
                // if (onResult) onResult(results);
            };
        });
        setFirst(false)
    }
  }, [onResult]);

  
  const rollDice = (notation: string | string[]) => {
    console.log("jo")
    if (!boxRef.current) return;
    const toRoll = Array.isArray(notation) ? notation : [notation];
    boxRef.current.roll(toRoll);
  };

  return (
    <div >
    <div
    className="border-2 border-black w-[25em] h-[15em]"
        id="dice-box"
        
        onClick={() => rollDice("1d20")}
    />
    </div>
    );
}



// import { useEffect, useRef } from "react";
// import DiceBox from "@3d-dice/dice-box";

// declare module "@3d-dice/dice-box";

// export default function DiceRoller() {

//   const boxRef = useRef<any>(null);

//   useEffect(() => {

//     const box = new DiceBox("#dice-box", {
//       assetPath: "/assets/dice-box/",
//       theme: "default",
//       offscreen: true,
//       scale: 20,
//     });
//     boxRef.current = box;

//     box.init().then(() => {
//       console.log("DiceBox ready");

//       box.onRollComplete = (results) => {
//         console.log("Dice results:", results);
//       };
//     });
//   }, []);

//   const rollDice = (notation: string | string[]) => {
//     if (!boxRef.current) return;
//     boxRef.current.roll(Array.isArray(notation) ? notation : [notation]);
//   };

//   return (
//     <div
//       className="border-2 border-black w-[15em] h-[15em] relative"
//       id="dice-box"
//       onClick={() => rollDice("1d20")}
//       style={{ overflow: "hidden" }}
//     >
//       {/* DiceBox will automatically insert the canvas here */}
//     </div>
//   );
// }
