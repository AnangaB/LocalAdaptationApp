import { DataHeaders } from "../Datasets/DatasetTypes";

//specifies which keys are ok to appear on the side
export const PieChartkeysList:DataHeaders[] = [
    "Eco-Evo Focus",
    "Life history",
    "Ecological Loci/Traits",
    "Additional Loci/Traits",
    "Mating system",
    "Ploidy",
    "Selection",
    "Spatial Structure",
    "Population Size",
    "Ecological Model",
    "Recurrent Mutation",
    "IBS",
  ];
  export type PieChartkeysType = (typeof PieChartkeysList)[number];