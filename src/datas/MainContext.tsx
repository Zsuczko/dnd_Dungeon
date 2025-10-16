import { createContext, useState, type ReactNode } from "react"

export type MonsterType = {
    enemyName: string;
    enemyIcon: string;
    cr: number;
    baseDamage: number;
    minDamage: number;
    maxDamage: number;
    flee: number;
    reward: string;
}

export type ItemType ={
    itemName: string,
    effect: string,
    rarity: string
}

type MainContextType ={
    cards: MonsterType[],
    items: ItemType[],
    position: number,
    setPosition: (i: number) => void,
    removeItem: (i: number) => void
}


export const MainContext = createContext<MainContextType | undefined>(undefined) 

const MainContextProvider = (props: {children: ReactNode}) => {

    const [cards, setCards] = useState<MonsterType[]>([])
    const [items, setItems] = useState<ItemType[]>([])
    const [position, setPosition] = useState<number>(0)

    const HandlePosition = (i:number) =>{
        setPosition(i)
    }

    const HandleRemoveItem = (i:number) =>{
        setItems(prev => prev.filter((_, id) => id !== i))
    }

    return (
        <MainContext.Provider value={{cards: cards, items:items, position: position, setPosition: HandlePosition, removeItem: HandleRemoveItem}}>
            {props.children}
        </MainContext.Provider>
    )
}

export default MainContextProvider