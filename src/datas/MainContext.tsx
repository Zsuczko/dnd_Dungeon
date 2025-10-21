import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { CharacterContext } from "./CharacterContext";

export type MonsterType = {
    enemyName: string;
    enemyIcon: string;
    tier: 'low' | 'medium' | 'high'; 
    cr: number; 
    type: string;
    isBoss: boolean;
    baseDamage: number;
    minDamage: number;
    maxDamage: number;
    flee: number;
    description: string;
}

export type PotiType ={
  itemName: string;
  itemIcon: string;
  tier: string;
  rarity: string;
  type: string;
  effect: string;
  drawback: string;
  description: string;
  measure: number;

}

type MainContextType ={
    cards: MonsterType[],
    items: PotiType[],
    onItem: PotiType,
    usedItem: PotiType[],
    onMonster: MonsterType,
    position: number,
    roll: boolean,
    result: number,
    isFlee: boolean,
    maxHp: number,
    hp: number,
    setHp: (h: number)=>void,
    setIsFlee: (f: boolean)=> void,
    setResult: (n: number)=> void,
    setRoll: (r: boolean)=> void,
    setPosition: () => void,
    addItem: () =>void,
    removeItem: (i: string) => void
}


export const MainContext = createContext<MainContextType>({
    cards: [], 
    items: [],
    onItem: {
        itemName: "",
        itemIcon: "",
        tier: "",
        rarity: "",
        type: "",
        effect: "",
        drawback: "",
        description: "",
        measure: 0,
    },
    usedItem: [],
    onMonster: {
        enemyName: "",
        enemyIcon: "",
        tier: "low", 
        cr: 0,
        type: "",
        isBoss: false,
        baseDamage: 0,
        minDamage: 0,
        maxDamage: 0,
        flee: 0,
        description: "",
    },
    position: 1,
    roll: false,
    result: 0,
    isFlee: false,
    maxHp: 10,
    hp: 10,
    setHp: ()=> {},
    setIsFlee: () => {}, // noop function
    setResult: () => {},
    setRoll: () => {},
    setPosition: () => {},
    addItem: ()=>{},
    removeItem: () => {},
    }) 

function getRndInteger(min:number, max:number) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

const MainContextProvider = (props: {children: ReactNode}) => {

    const character = useContext(CharacterContext)


    const [cards, setCards] = useState<MonsterType[]>([])
    const [allMonster, setAllMonster] = useState<MonsterType[]>([])

    const [onMonster, setOnMonster] = useState<MonsterType>({
        enemyName: "Mummy",
        enemyIcon: "icons/mummy.png",
        tier: "low",
        cr: 6,
        type: "undead",
        isBoss: false,
        baseDamage: 4,
        minDamage: 2,
        maxDamage: 5,
        flee: 3,
        description:
            "Wrapped in rotting bandages and cursed with eternal unrest, mummies are guardians of long-forgotten tombs. Their curse is said to linger in the air for centuries after they fall.",
        })

    const [items, setItems] = useState<PotiType[]>([])
    const [userItems, setUserItems] = useState<PotiType[]>([])
    const [allItems, setAllItems] = useState<PotiType[]>([])
    const [onItem, setOnItem] = useState<PotiType>({
        itemName: "",
        itemIcon: "",
        tier: "",
        rarity: "",
        type: "",
        effect: "",
        drawback: "",
        description: "",
        measure: 0,
        })
    const [usedItem, setUsedItem] = useState<PotiType[]>([])
   
    const [position, setPosition] = useState<number>(-1)

    const [roll, setRoll] = useState<boolean>(false)

    const [result, setResult] = useState<number>(0)
    const [isFlee, setIsFlee] = useState<boolean>(false)

    const [maxHp, setMaxHp] = useState<number>(10)
    const [Hp, setHp] = useState<number>(10)


    useEffect(()=>{


        fetch("/monsters.json").then(res=> res.json()).then(item=>
           setAllMonster(item)
        )

        fetch("/poti.json").then(res => res.json()).then(data =>{
            setAllItems(data)
        })
        
    },[])

    const HandleSetResult = (n: number)=>{
        if(character.double){
            setResult(n*2)
        }
        else{
            setResult(n)
        }
    }

    const HandleSetHp = (n: number)=>{
        
        if(character.fullResistance)
            return

        let newNum = n
        if(character.plusDmg)
            newNum += 2

        if (character.resistance)
            newNum = Math.floor(newNum/ 2)
        
        if(Hp + newNum > maxHp){
            setHp(maxHp)
        }
        else if(Hp + newNum < 0){
            setHp(0)
        }
        else{
            setHp(Hp+ newNum)
        }
    }


    const AddSuffle = (rarity: string, isboss: boolean = false, howmany: number = 5) =>{

        const Monster = allMonster.filter(x=>x.tier === rarity && x.isBoss === isboss)
        const suffledMonsters = Array.from(Monster).sort(() => 0.5 - Math.random()).slice(0, howmany)
        setCards(prev => [...prev, ...suffledMonsters])

        for (let i = 0; i < howmany; i++) {

            let rary = "common"
            if(rarity === "low"){
                const randi = getRndInteger(1, 101)
                if(randi < 75){
                    rary = "common"
                }
                else if(randi< 95){
                    rary = "rare"
                }
                else if(randi < 99){
                    rary = "epic"
                }
                else{
                    rary = "legendary"
                }
            }
            if(rarity === "medium"){
                const randi = getRndInteger(1, 101)
                if(randi < 40){
                    rary = "common"
                }
                else if(randi< 85){
                    rary = "rare"
                }
                else if(randi < 97){
                    rary = "epic"
                }
                else{
                    rary = "legendary"
                }
            }
            if(rarity === "high"){
                const randi = getRndInteger(1, 101)
                if(randi < 20){
                    rary = "common"
                }
                else if(randi< 70){
                    rary = "rare"
                }
                else if(randi < 90){
                    rary = "epic"
                }
                else{
                    rary = "legendary"
                }
            }

            const itemss = allItems.filter(x=>x.rarity === rary)
            // const itemss = allItems.filter(x=>x.itemName === "Elixir of Foresight")
            const theItem = Array.from(itemss).sort(()=> 0.5- Math.random()).slice(0, 1)
            setItems(prev =>[...prev, theItem[0]])
        }

    }


    useEffect(()=>{
        
        if(cards.length<1){

            if(allMonster.length > 0){
                AddSuffle("low")
                AddSuffle("low", true, 1)
                AddSuffle("medium")
                AddSuffle("medium", true, 1)
                AddSuffle("high")
                AddSuffle("high", true, 1)
            }
           
        }

    },[allMonster])

    const HandlePosition = () =>{

        setPosition(position+1)
        if(position < cards.length){
            setUsedItem([])
            setOnMonster(cards[position])
            setOnItem(items[position])
            console.log(onItem)
        }
    }

    const HandleRemoveItem = async (name:string) =>{

        console.log(name)
        const i = [...userItems].reverse().findIndex(item => item.itemName === name);

        if (i === -1) return; 
        const realIndex = userItems.length - 1 - i;
        const item = userItems[realIndex];
        setUsedItem(prev => [...prev, item]);

        if(item.effect === "heal"){
            HandleSetHp(+ item.measure);
        }
        if (item.effect === "maxHeal"){
            HandleSetHp(maxHp);
            character.setDisadvantage(true)
        }
        if(item.effect === "attack"){
            character.setAttack(character.attack + item.measure)
            character.setPlusDmg(true)
        }
        if(item.effect === "flee"){
            character.setFlee(character.flee + item.measure)
            character.setPlusDmg(true)
        }
        if(item.effect === "advantage"){
            character.setAdvantage(true)
        }
        if(item.effect === "rewardPoti"){
            character.setDoublePoti(true)
        }
        if(item.effect === "double"){
            character.setDouble(true)
            HandleSetHp(1-Hp)
        }
        if(item.effect === "inspiration")
            console.log("jo")
        if(item.effect === "resistance"){
            character.setResistance(true)
        }
        if(item.effect === "fullResistance"){
            character.setFullResistance(true)
        }

        setUserItems(prev => prev.filter((_, id) => id !== realIndex))
    }

    const HandleAddItem = ()=>{
        setUserItems(prev=> [...prev, onItem])
        if(character.doublePoti)
            setUserItems(prev=> [...prev, onItem])
    }

    return (
        <MainContext.Provider value={{
            cards: cards, 
            items:userItems, 
            onItem: onItem,
            usedItem: usedItem,
            onMonster: onMonster,
            position: position,
            roll: roll, 
            result: result,
            isFlee: isFlee,
            maxHp: maxHp,
            hp: Hp,
            setHp: HandleSetHp,
            setIsFlee: setIsFlee, 
            setResult: HandleSetResult, 
            setRoll: setRoll, 
            setPosition: HandlePosition, 
            addItem: HandleAddItem,
            removeItem: HandleRemoveItem}}>
            {props.children}
        </MainContext.Provider>
    )
}

export default MainContextProvider