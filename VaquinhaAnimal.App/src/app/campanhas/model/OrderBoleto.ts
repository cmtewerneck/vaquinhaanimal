export class OrderBoleto {
    items!: Items[];
    payments!: Payments[];
}

export class Items {
    amount!: number;
    description!: string;
    quantity!: number;
    code!: string;
}

export class Payments {
    payment_method!: string;
    boleto!: Boleto;
}

export class Boleto {
    instructions!: string;
    due_at?: Date;
}