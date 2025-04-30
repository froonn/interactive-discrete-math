import { ScClient } from 'ts-sc-client'

export const client = new ScClient(`ws://localhost:${import.meta.env.VITE_MACHINE_PORT}`);