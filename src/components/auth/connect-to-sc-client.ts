import { ScClient } from '../../ts-sc-client/src'

export const client = new ScClient(`https://localhost:${import.meta.env.VITE_MACHINE_PORT}`);