interface Store {
  name: string;
  coodinate: number[];
  movement: { [key in string]: number };
  total: number;
}

type Stores = Store[];

export type { Store, Stores };
