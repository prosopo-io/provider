import { Enum } from '@polkadot/types-codec'
import { Registry } from 'redspot/types/provider'
import { Payee } from '.'

export type PayeeType = 'Provider' | 'Dapp' | 'None';

class PayeeClass extends Enum implements Payee {
    isProvider = true
    isDapp = false
    // isNone and type exist on Enum, overriden by Payee and now it just makes a mess
    // @ts-ignore
    isNone = false
    // @ts-ignore
    type: PayeeType = 'Provider'

    constructor (registry: Registry, value: PayeeType) {
        // tried { Provider: 'Provider', Dapp: 'Dapp', None: 'None' } can't find None (probably since rust has None value for Option type and they conflict)
        // tried passing the definition: prosopo.types.Payee._enum
        super(registry, { Provider: 'String', Dapp: 'String', None: 'String' }, value)
        this.setValue(value)
    }

    setValue (value: PayeeType) {
        this.type = value
        this.isProvider = value === 'Provider'
        this.isDapp = value === 'Dapp'
        this.isNone = value === 'None'
    }
}

export function initPayee (registry: Registry, value: PayeeType): Payee {
    return new PayeeClass(registry, value)
}
