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
    items: ItemType[]
}


export const MainContext = createContext<MainContextType | undefined>(undefined) 

const MainContextProvider = (props: {children: ReactNode}) => {

    const [cards, setCards] = useState<MonsterType[]>([])
    const [items, setItems] = useState<ItemType[]>([])

  return (
    <MainContext.Provider value={undefined}>
        {props.children}
    </MainContext.Provider>
  )
}

export default MainContextProvider