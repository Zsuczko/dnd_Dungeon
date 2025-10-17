import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

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
    itemName: string,
    effect: string,
    rarity: string
}

type MainContextType ={
    cards: MonsterType[],
    items: ItemType[],
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
    removeItem: (i: number) => void
}


export const MainContext = createContext<MainContextType>({
    cards: [], // empty array for monsters
    items: [], // empty array for items
    onMonster: {
        enemyName: "",
        enemyIcon: "",
        tier: "low", // or whatever default tier
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
    removeItem: () => {},
    }) 

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
        
    },[])


    const AddSuffle = (rarity: string, isboss: boolean, howmany: number = 5) =>{

        const Monster = allMonster.filter(x=>x.tier === rarity && x.isBoss === isboss)
        const suffledMonsters = Array.from(Monster).sort(() => 0.5 - Math.random()).slice(0, howmany)
        setCards(prev => [...prev, ...suffledMonsters])

    }


    useEffect(()=>{
        
        if(cards.length<1){

            if(allMonster.length > 0){

                AddSuffle("low", false)
                AddSuffle("low", true, 1)
                AddSuffle("medium", false)
                AddSuffle("medium", true, 1)
                AddSuffle("high", false)
                AddSuffle("high", true, 1)
            }
           
        }

    },[allMonster])

    const HandlePosition = () =>{

        setPosition(position+1)
        setOnMonster(cards[position])
    }

    const HandleRemoveItem = (i:number) =>{
        setItems(prev => prev.filter((_, id) => id !== i))
    }

    return (
        <MainContext.Provider value={{
            cards: cards, 
            items:items, 
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
            removeItem: HandleRemoveItem}}>
            {props.children}
        </MainContext.Provider>
    )
}

export default MainContextProvider