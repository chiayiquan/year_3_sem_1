import * as JD from 'decoders'

type NodeEnv = 'development' | 'test'
export type Env = Readonly<{
  
}>

const env = JD.guard<Env>