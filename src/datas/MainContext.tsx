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
    onMonster: MonsterType | undefined,
    roll: boolean,
    setRoll: (r: boolean)=> void
    setPosition: () => void,
    removeItem: (i: number) => void
}


export const MainContext = createContext<MainContextType | undefined>(undefined) 

const MainContextProvider = (props: {children: ReactNode}) => {

    const [cards, setCards] = useState<MonsterType[]>([])
    const [allMonster, setAllMonster] = useState<MonsterType[]>([])

    const [onMonster, setOnMonster] = useState<MonsterType>()

    const [items, setItems] = useState<ItemType[]>([])
    const [position, setPosition] = useState<number>(0)

    const [roll, setRoll] = useState<boolean>(false)



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
        <MainContext.Provider value={{cards: cards, items:items, onMonster: onMonster,roll: roll,setRoll: setRoll, setPosition: HandlePosition, removeItem: HandleRemoveItem}}>
            {props.children}
        </MainContext.Provider>
    )
}

export default MainContextProvider