import { createContext, useState, type ReactNode } from "react"



type CharacterContextType = {
    attack: number,
    flee: number,
    plusDmg: boolean,
    advantage: boolean,
    disadvantage: boolean,
    doublePoti: boolean,
    doubleGold: boolean,
    double: boolean,
    resistance: boolean,
    fullResistance: boolean,
    setPlusDmg: (value: boolean) => void;
    setAttack: (value: number) => void;
    setFlee: (value: number) => void;
    setAdvantage: (value: boolean) => void;
    setDisadvantage: (value: boolean) => void;
    setDoublePoti: (value: boolean) => void;
    setDoubleGold: (value: boolean) => void;
    setDouble: (value: boolean) => void;
    setResistance: (value: boolean) => void;
    setFullResistance: (value: boolean) => void;
    setToDefault: ()=>void;
}


export const CharacterContext = createContext<CharacterContextType>({
    attack: 0,
    flee: 0,
    plusDmg: false,
    advantage: false,
    disadvantage: false,
    doublePoti: false,
    doubleGold: false,
    double: false,
    resistance: false,
    fullResistance: false,
    setPlusDmg: () => {},
    setAttack: () => {},
    setFlee: () => {},
    setAdvantage: () => {},
    setDisadvantage: () => {},
    setDoublePoti: () => {},
    setDoubleGold: () => {},
    setDouble: () => {},
    setResistance: () => {},
    setFullResistance: () => {},
    setToDefault: ()=>{}
    });

const CharacterContextProvider = (prop: {children: ReactNode}) => {

    const [attack, setAttack] = useState<number>(0);
    const [flee, setFlee] = useState<number>(0);
    const [plusDmg, setPlusDmg] = useState<boolean>(false);
    const [advantage, setAdvantage] = useState<boolean>(false);
    const [disadvantage, setDisadvantage] = useState<boolean>(false);
    const [doublePoti, setDoublePoti] = useState<boolean>(false);
    const [doubleGold, setDoubleGold] = useState<boolean>(false);
    const [double, setDouble] = useState<boolean>(false);
    const [resistance, setResistance] = useState<boolean>(false);
    const [fullResistance, setFullResistance] = useState<boolean>(false);


    const setToDefault = () =>{
        setAttack(0);
        setFlee(0);
        setPlusDmg(false);
        setAdvantage(false);
        setDisadvantage(false);
        setDoublePoti(false);
        setDoubleGold(false);
        setDouble(false);
        setResistance(false);
        setFullResistance(false);
    }


    const value: CharacterContextType = {
        plusDmg,
        attack,
        flee,
        advantage,
        disadvantage,
        doublePoti,
        doubleGold,
        double,
        resistance,
        fullResistance,

        setPlusDmg,
        setAttack,
        setFlee,
        setAdvantage,
        setDisadvantage,
        setDoublePoti,
        setDoubleGold,
        setDouble,
        setResistance,
        setFullResistance,
        setToDefault
    };

    return (  
        <CharacterContext.Provider value={value}>
            {prop.children}
        </CharacterContext.Provider>
    )
}

export default CharacterContextProvider