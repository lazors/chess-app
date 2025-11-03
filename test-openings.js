// Quick test for enhanced opening detection
import { getOpeningByMoves } from './src/data/ecoMappings.js'

console.log('Testing Enhanced Opening Detection:')
console.log('')

// London System tests
console.log('London System Tests:')
console.log('1.d4 d5 2.Bf4:', getOpeningByMoves('1.d4 d5 2.Bf4')?.name)
console.log('1.d4 Nf6 2.Bf4:', getOpeningByMoves('1.d4 Nf6 2.Bf4')?.name)
console.log('1.d4 Nf6 2.Bf4 g6 3.Nf3 Bg7:', getOpeningByMoves('1.d4 Nf6 2.Bf4 g6 3.Nf3 Bg7')?.name)
console.log('1.d4 e6 2.Bf4:', getOpeningByMoves('1.d4 e6 2.Bf4')?.name)
console.log('')

// Scandinavian Defense tests
console.log('Scandinavian Defense Tests:')
console.log('1.e4 d5:', getOpeningByMoves('1.e4 d5')?.name)
console.log('1.e4 d5 2.exd5 Nf6:', getOpeningByMoves('1.e4 d5 2.exd5 Nf6')?.name)
console.log('1.e4 d5 2.exd5 Qxd5:', getOpeningByMoves('1.e4 d5 2.exd5 Qxd5')?.name)
console.log('1.e4 d5 2.exd5 Qxd5 3.Nc3 Qa5:', getOpeningByMoves('1.e4 d5 2.exd5 Qxd5 3.Nc3 Qa5')?.name)