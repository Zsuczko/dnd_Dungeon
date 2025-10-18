import { createContext, useEffect, useState, type ReactNode } from "react"

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

export type ItemType ={
  itemName: string;
  tier: "low" | "medium" | "high"; 
  rarity: "common" | "rare" | "epic" | "legendary"; 
  type: "consumable";
  attack_measure: number;
  flee_measure: number;
  heal_measure: number;
  isBossOnly: boolean;
  givesAdvantage: boolean;

}

type MainContextType ={
    cards: MonsterType[],
    items: ItemType[],
    onItem: ItemType,
    usedItem: ItemType,
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
    removeItem: (i: number) => void
}


export const MainContext = createContext<MainContextType>({
    cards: [], 
    items: [],
    onItem: {
        itemName: "",
        tier: "low",
        rarity: "common",
        type: "consumable",
        attack_measure: 0,
        flee_measure: 0,
        heal_measure: 0,
        isBossOnly: false,  
        givesAdvantage: false,
    },
    usedItem: {
        itemName: "",
        tier: "low",
        rarity: "common",
        type: "consumable",
        attack_measure: 0,
        flee_measure: 0,
        heal_measure: 0,
        isBossOnly: false,  
        givesAdvantage: false,
    },
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

    const [items, setItems] = useState<ItemType[]>([])
    const [userItems, setUserItems] = useState<ItemType[]>([])
    const [allItems, setAllItems] = useState<ItemType[]>([])
    const [onItem, setOnItem] = useState<ItemType>({
        itemName: "",
        tier: "low",
        rarity: "common",
        type: "consumable",
        attack_measure: 0,
        flee_measure: 0,
        heal_measure: 0,
        isBossOnly: false,
        givesAdvantage: false,
        })
    const [usedItem, setUsedItem] = useState<ItemType>({
        itemName: "",
        tier: "low",
        rarity: "common",
        type: "consumable",
        attack_measure: 0,
        flee_measure: 0,
        heal_measure: 0,
        isBossOnly: false,
        givesAdvantage: true,
        })
   
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

        fetch("/items.json").then(res => res.json()).then(data =>{
            setAllItems(data)
        })
        
    },[])


    const AddSuffle = (rarity: string, isboss: boolean = false, howmany: number = 5) =>{

        const Monster = allMonster.filter(x=>x.tier === rarity && x.isBoss === isboss)
        const suffledMonsters = Array.from(Monster).sort(() => 0.5 - Math.random()).slice(0, howmany)
        setCards(prev => [...prev, ...suffledMonsters])

        for (let i = 0; i < howmany; i++) {   
            const itemss = allItems.filter(x=>x.tier === rarity)
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
            setUsedItem({  itemName: "",
                tier: "low",
                rarity: "common",
                type: "consumable",
                attack_measure: 0,
                flee_measure: 0,
                heal_measure: 0,
                isBossOnly: false,
                givesAdvantage: false,
                })
            setOnMonster(cards[position])
            setOnItem(items[position])
        }
    }

    const HandleRemoveItem = async (i:number) =>{
        const item = userItems[i];
        setUsedItem(item);
        setHp(Hp +item.heal_measure); 
        setUserItems(prev => prev.filter((_, id) => id !== i))
    }

    const HandleAddItem = ()=>{
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
            setHp: setHp,
            setIsFlee: setIsFlee, 
            setResult: setResult, 
            setRoll: setRoll, 
            setPosition: HandlePosition, 
            addItem: HandleAddItem,
            removeItem: HandleRemoveItem}}>
            {props.children}
        </MainContext.Provider>
    )
}

export default MainContextProvider