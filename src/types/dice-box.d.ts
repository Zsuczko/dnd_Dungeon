declare module "@3d-dice/dice-box" {
  export default class DiceBox {
    constructor(container: string | HTMLElement, options?: any);
    init(): Promise<void>;
    roll(notation: string | string[] | any): Promise<any>;
    add(roll: any, groupId?: string | number): void;
    clear(): void;
    updateConfig(config: any): void;
    onRollComplete?: (results: any) => void;
    
  }
}

declare module "@3d-dice/fui/src/displayResults" {
  export default class DisplayResults {
    constructor(target: string | HTMLElement);
    showResults(results: any): void;
    clear(): void;
  }
}

declare module "@3d-dice/fui/src/advancedRoller" {
  type AdvancedRollerOptions = {
    target: string | HTMLElement;
    onSubmit?: (notation: string | string[]) => void;
    onClear?: () => void;
    onReroll?: (rolls: any[]) => void;
    onResults?: (results: any) => void;
  };
  export default class AdvancedRoller {
    constructor(options: AdvancedRollerOptions);
    handleResults(results: any): void;
  }
}

declare module "@3d-dice/fui/src/boxControls" {
  type BoxControlsOptions = {
    onUpdate?: (updates: any) => void;
  };
  export default class BoxControls {
    constructor(options?: BoxControlsOptions);
  }
}
