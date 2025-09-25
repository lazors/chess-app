export interface ECOOpening {
  code: string
  name: string
  moves?: string
}

export const ECO_MAPPINGS: Record<string, ECOOpening> = {
  // A00-A99: Irregular Openings and Flank Openings
  'A00': { code: 'A00', name: 'Polish Opening', moves: '1.b4' },
  'A01': { code: 'A01', name: 'Nimzo-Larsen Attack', moves: '1.b3' },
  'A02': { code: 'A02', name: 'Bird\'s Opening', moves: '1.f4' },
  'A03': { code: 'A03', name: 'Bird\'s Opening: Dutch Variation', moves: '1.f4 d5' },
  'A04': { code: 'A04', name: 'Réti Opening', moves: '1.Nf3' },
  'A05': { code: 'A05', name: 'Réti Opening: King\'s Indian Attack', moves: '1.Nf3 Nf6' },
  'A06': { code: 'A06', name: 'Réti Opening: Nimzowitsch-Larsen Attack', moves: '1.Nf3 d5' },
  'A07': { code: 'A07', name: 'King\'s Indian Attack', moves: '1.Nf3 d5 2.g3' },
  'A08': { code: 'A08', name: 'King\'s Indian Attack: French Variation', moves: '1.Nf3 d5 2.g3 c5' },
  'A09': { code: 'A09', name: 'Réti Opening: Advance Variation', moves: '1.Nf3 d5 2.c4' },
  'A10': { code: 'A10', name: 'English Opening', moves: '1.c4' },
  'A11': { code: 'A11', name: 'English Opening: Caro-Kann Defensive System', moves: '1.c4 c6' },
  'A12': { code: 'A12', name: 'English Opening: Caro-Kann Defensive System', moves: '1.c4 c6 2.Nf3 d5' },
  'A13': { code: 'A13', name: 'English Opening: Agincourt Defense', moves: '1.c4 e6' },
  'A14': { code: 'A14', name: 'English Opening: Agincourt Defense, Neo-Catalan', moves: '1.c4 e6 2.Nf3 d5' },
  'A15': { code: 'A15', name: 'English Opening: Anglo-Indian Defense', moves: '1.c4 Nf6' },
  'A16': { code: 'A16', name: 'English Opening: Anglo-Indian Defense, Anglo-Grünfeld Variation', moves: '1.c4 Nf6 2.Nc3' },
  'A17': { code: 'A17', name: 'English Opening: Anglo-Indian Defense, Hedgehog System', moves: '1.c4 Nf6 2.Nc3 e6' },
  'A18': { code: 'A18', name: 'English Opening: Mikenas-Carls Variation', moves: '1.c4 Nf6 2.Nc3 e6 3.e4' },
  'A19': { code: 'A19', name: 'English Opening: Mikenas-Carls, Sicilian Variation', moves: '1.c4 Nf6 2.Nc3 e6 3.e4 c5' },
  'A20': { code: 'A20', name: 'English Opening: King\'s English Variation', moves: '1.c4 e5' },
  'A21': { code: 'A21', name: 'English Opening: King\'s English Variation, Reversed Sicilian', moves: '1.c4 e5 2.Nc3' },
  'A22': { code: 'A22', name: 'English Opening: King\'s English Variation, Two Knights Variation', moves: '1.c4 e5 2.Nc3 Nf6' },
  'A23': { code: 'A23', name: 'English Opening: King\'s English Variation, Closed System', moves: '1.c4 e5 2.Nc3 Nc6' },
  'A24': { code: 'A24', name: 'English Opening: King\'s English Variation, Closed System', moves: '1.c4 e5 2.Nc3 Nc6 3.g3' },
  'A25': { code: 'A25', name: 'English Opening: King\'s English Variation, Closed System', moves: '1.c4 e5 2.Nc3 Nc6 3.g3 g6' },
  'A26': { code: 'A26', name: 'English Opening: King\'s English Variation, Closed System', moves: '1.c4 e5 2.Nc3 Nc6 3.g3 g6 4.Bg2' },
  'A27': { code: 'A27', name: 'English Opening: King\'s English Variation, Three Knights System', moves: '1.c4 e5 2.Nc3 Nc6 3.Nf3' },
  'A28': { code: 'A28', name: 'English Opening: King\'s English Variation, Four Knights System', moves: '1.c4 e5 2.Nc3 Nc6 3.Nf3 Nf6' },
  'A29': { code: 'A29', name: 'English Opening: King\'s English Variation, Four Knights, Fianchetto Variation', moves: '1.c4 e5 2.Nc3 Nc6 3.Nf3 Nf6 4.g3' },
  'A30': { code: 'A30', name: 'English Opening: Symmetrical Variation', moves: '1.c4 c5' },

  // B00-B99: Semi-Open Games other than the French Defense
  'B00': { code: 'B00', name: 'King\'s Pawn Game', moves: '1.e4' },
  'B01': { code: 'B01', name: 'Scandinavian Defense', moves: '1.e4 d5' },
  'B02': { code: 'B02', name: 'Alekhine\'s Defense', moves: '1.e4 Nf6' },
  'B03': { code: 'B03', name: 'Alekhine\'s Defense: Four Pawns Attack', moves: '1.e4 Nf6 2.e5 Nd5 3.d4' },
  'B04': { code: 'B04', name: 'Alekhine\'s Defense: Modern Variation', moves: '1.e4 Nf6 2.e5 Nd5 3.d4 d6' },
  'B05': { code: 'B05', name: 'Alekhine\'s Defense: Modern Variation', moves: '1.e4 Nf6 2.e5 Nd5 3.d4 d6 4.Nf3' },
  'B06': { code: 'B06', name: 'Robatsch Defense', moves: '1.e4 g6' },
  'B07': { code: 'B07', name: 'Pirc Defense', moves: '1.e4 d6' },
  'B08': { code: 'B08', name: 'Pirc Defense: Classical System', moves: '1.e4 d6 2.d4 Nf6 3.Nc3' },
  'B09': { code: 'B09', name: 'Pirc Defense: Austrian Attack', moves: '1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.f4' },
  'B10': { code: 'B10', name: 'Caro-Kann Defense', moves: '1.e4 c6' },
  'B11': { code: 'B11', name: 'Caro-Kann Defense: Two Knights Attack', moves: '1.e4 c6 2.Nc3' },
  'B12': { code: 'B12', name: 'Caro-Kann Defense: Advance Variation', moves: '1.e4 c6 2.d4 d5 3.e5' },
  'B13': { code: 'B13', name: 'Caro-Kann Defense: Exchange Variation', moves: '1.e4 c6 2.d4 d5 3.exd5' },
  'B14': { code: 'B14', name: 'Caro-Kann Defense: Panov-Botvinnik Attack', moves: '1.e4 c6 2.d4 d5 3.exd5 cxd5 4.c4' },
  'B15': { code: 'B15', name: 'Caro-Kann Defense: Main Line', moves: '1.e4 c6 2.d4 d5 3.Nc3' },
  'B16': { code: 'B16', name: 'Caro-Kann Defense: Bronstein-Larsen Variation', moves: '1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Nf6 5.Nxf6+ gxf6' },
  'B17': { code: 'B17', name: 'Caro-Kann Defense: Steinitz Variation', moves: '1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Nd7' },
  'B18': { code: 'B18', name: 'Caro-Kann Defense: Classical Variation', moves: '1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Bf5' },
  'B19': { code: 'B19', name: 'Caro-Kann Defense: Classical Variation, Spassky System', moves: '1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Bf5 5.Ng3 Bg6 6.h4' },
  'B20': { code: 'B20', name: 'Sicilian Defense', moves: '1.e4 c5' },
  'B21': { code: 'B21', name: 'Sicilian Defense: Smith-Morra Gambit', moves: '1.e4 c5 2.d4' },
  'B22': { code: 'B22', name: 'Sicilian Defense: Alapin Variation', moves: '1.e4 c5 2.c3' },
  'B23': { code: 'B23', name: 'Sicilian Defense: Closed Variation', moves: '1.e4 c5 2.Nc3' },
  'B24': { code: 'B24', name: 'Sicilian Defense: Closed Variation', moves: '1.e4 c5 2.Nc3 Nc6' },
  'B25': { code: 'B25', name: 'Sicilian Defense: Closed Variation', moves: '1.e4 c5 2.Nc3 Nc6 3.g3' },
  'B26': { code: 'B26', name: 'Sicilian Defense: Closed Variation', moves: '1.e4 c5 2.Nc3 Nc6 3.g3 g6' },
  'B27': { code: 'B27', name: 'Sicilian Defense: Hungarian Variation', moves: '1.e4 c5 2.Nf3 g6' },
  'B28': { code: 'B28', name: 'Sicilian Defense: O\'Kelly Variation', moves: '1.e4 c5 2.Nf3 a6' },
  'B29': { code: 'B29', name: 'Sicilian Defense: Nimzowitsch Variation', moves: '1.e4 c5 2.Nf3 Nf6' },
  'B30': { code: 'B30', name: 'Sicilian Defense: Old Sicilian', moves: '1.e4 c5 2.Nf3 Nc6' },

  // C00-C99: French Defense and other Open Games
  'C00': { code: 'C00', name: 'French Defense', moves: '1.e4 e6' },
  'C01': { code: 'C01', name: 'French Defense: Exchange Variation', moves: '1.e4 e6 2.d4 d5 3.exd5' },
  'C02': { code: 'C02', name: 'French Defense: Advance Variation', moves: '1.e4 e6 2.d4 d5 3.e5' },
  'C03': { code: 'C03', name: 'French Defense: Tarrasch Variation', moves: '1.e4 e6 2.d4 d5 3.Nd2' },
  'C04': { code: 'C04', name: 'French Defense: Tarrasch Variation, Guimard Main Line', moves: '1.e4 e6 2.d4 d5 3.Nd2 Nc6' },
  'C05': { code: 'C05', name: 'French Defense: Tarrasch Variation, Closed System', moves: '1.e4 e6 2.d4 d5 3.Nd2 Nf6' },
  'C06': { code: 'C06', name: 'French Defense: Tarrasch Variation, Closed System', moves: '1.e4 e6 2.d4 d5 3.Nd2 Nf6 4.e5 Nfd7' },
  'C07': { code: 'C07', name: 'French Defense: Tarrasch Variation, Open System', moves: '1.e4 e6 2.d4 d5 3.Nd2 c5' },
  'C08': { code: 'C08', name: 'French Defense: Tarrasch Variation, Open System', moves: '1.e4 e6 2.d4 d5 3.Nd2 c5 4.exd5 exd5' },
  'C09': { code: 'C09', name: 'French Defense: Tarrasch Variation, Open System', moves: '1.e4 e6 2.d4 d5 3.Nd2 c5 4.exd5 exd5 5.Ngf3 Nc6' },
  'C10': { code: 'C10', name: 'French Defense: Paulsen Variation', moves: '1.e4 e6 2.d4 d5 3.Nc3' },
  'C11': { code: 'C11', name: 'French Defense: Classical Variation', moves: '1.e4 e6 2.d4 d5 3.Nc3 Nf6' },
  'C12': { code: 'C12', name: 'French Defense: MacCutcheon Variation', moves: '1.e4 e6 2.d4 d5 3.Nc3 Nf6 4.Bg5 Bb4' },
  'C13': { code: 'C13', name: 'French Defense: Classical Variation, Alekhine-Chatard Attack', moves: '1.e4 e6 2.d4 d5 3.Nc3 Nf6 4.Bg5 Be7 5.e5 Nfd7 6.h4' },
  'C14': { code: 'C14', name: 'French Defense: Classical Variation, Steinitz Variation', moves: '1.e4 e6 2.d4 d5 3.Nc3 Nf6 4.Bg5 Be7 5.e5 Nfd7 6.Bxe7 Qxe7' },
  'C15': { code: 'C15', name: 'French Defense: Winawer Variation', moves: '1.e4 e6 2.d4 d5 3.Nc3 Bb4' },
  'C16': { code: 'C16', name: 'French Defense: Winawer Variation, Advance Line', moves: '1.e4 e6 2.d4 d5 3.Nc3 Bb4 4.e5' },
  'C17': { code: 'C17', name: 'French Defense: Winawer Variation, Advance Line', moves: '1.e4 e6 2.d4 d5 3.Nc3 Bb4 4.e5 c5' },
  'C18': { code: 'C18', name: 'French Defense: Winawer Variation, Advance Line', moves: '1.e4 e6 2.d4 d5 3.Nc3 Bb4 4.e5 c5 5.a3 Bxc3+' },
  'C19': { code: 'C19', name: 'French Defense: Winawer Variation, Advance Line', moves: '1.e4 e6 2.d4 d5 3.Nc3 Bb4 4.e5 c5 5.a3 Bxc3+ 6.bxc3 Ne7' },
  'C20': { code: 'C20', name: 'King\'s Pawn Game', moves: '1.e4 e5' },

  // D00-D99: Closed Games and Queen's Gambit
  'D00': { code: 'D00', name: 'Queen\'s Pawn Game', moves: '1.d4' },
  'D01': { code: 'D01', name: 'Richter-Veresov Attack', moves: '1.d4 Nf6 2.Nc3' },
  'D02': { code: 'D02', name: 'Queen\'s Pawn Game: London System', moves: '1.d4 d5 2.Nf3 Nf6 3.Bf4' },
  'D03': { code: 'D03', name: 'Torre Attack', moves: '1.d4 Nf6 2.Nf3 e6 3.Bg5' },
  'D04': { code: 'D04', name: 'Queen\'s Pawn Game: Colle System', moves: '1.d4 Nf6 2.Nf3 e6 3.e3' },
  'D05': { code: 'D05', name: 'Queen\'s Pawn Game: Colle System', moves: '1.d4 Nf6 2.Nf3 e6 3.e3 c5' },
  'D06': { code: 'D06', name: 'Queen\'s Gambit Declined', moves: '1.d4 d5 2.c4' },
  'D07': { code: 'D07', name: 'Queen\'s Gambit Declined: Chigorin Defense', moves: '1.d4 d5 2.c4 Nc6' },
  'D08': { code: 'D08', name: 'Queen\'s Gambit Declined: Albin Countergambit', moves: '1.d4 d5 2.c4 e5' },
  'D09': { code: 'D09', name: 'Queen\'s Gambit Declined: Albin Countergambit', moves: '1.d4 d5 2.c4 e5 3.dxe5 d4' },
  'D10': { code: 'D10', name: 'Queen\'s Gambit Declined: Slav Defense', moves: '1.d4 d5 2.c4 c6' },
  'D11': { code: 'D11', name: 'Queen\'s Gambit Declined: Slav Defense', moves: '1.d4 d5 2.c4 c6 3.Nf3' },
  'D12': { code: 'D12', name: 'Queen\'s Gambit Declined: Slav Defense', moves: '1.d4 d5 2.c4 c6 3.Nf3 Nf6' },
  'D13': { code: 'D13', name: 'Queen\'s Gambit Declined: Slav Defense, Exchange Variation', moves: '1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.cxd5' },
  'D14': { code: 'D14', name: 'Queen\'s Gambit Declined: Slav Defense, Exchange Variation', moves: '1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.cxd5 cxd5' },
  'D15': { code: 'D15', name: 'Queen\'s Gambit Declined: Slav Defense, Four Knights Variation', moves: '1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3' },
  'D16': { code: 'D16', name: 'Queen\'s Gambit Declined: Slav Defense, Steiner Variation', moves: '1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 dxc4' },
  'D17': { code: 'D17', name: 'Queen\'s Gambit Declined: Slav Defense, Czech Variation', moves: '1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 dxc4 5.a4' },
  'D18': { code: 'D18', name: 'Queen\'s Gambit Declined: Slav Defense, Dutch Variation', moves: '1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 dxc4 5.a4 Bf5' },
  'D19': { code: 'D19', name: 'Queen\'s Gambit Declined: Slav Defense, Dutch Variation', moves: '1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 dxc4 5.a4 Bf5 6.e3' },
  'D20': { code: 'D20', name: 'Queen\'s Gambit Accepted', moves: '1.d4 d5 2.c4 dxc4' },

  // E00-E99: Indian Defenses
  'E00': { code: 'E00', name: 'Queen\'s Pawn Game', moves: '1.d4 Nf6' },
  'E01': { code: 'E01', name: 'Catalan Opening', moves: '1.d4 Nf6 2.c4 e6 3.g3' },
  'E02': { code: 'E02', name: 'Catalan Opening: Open Defense', moves: '1.d4 Nf6 2.c4 e6 3.g3 d5 4.Bg2 dxc4' },
  'E03': { code: 'E03', name: 'Catalan Opening: Open Defense', moves: '1.d4 Nf6 2.c4 e6 3.g3 d5 4.Bg2 dxc4 5.Qa4+' },
  'E04': { code: 'E04', name: 'Catalan Opening: Open Defense', moves: '1.d4 Nf6 2.c4 e6 3.g3 d5 4.Bg2 dxc4 5.Nf3' },
  'E05': { code: 'E05', name: 'Catalan Opening: Open Defense, Classical Line', moves: '1.d4 Nf6 2.c4 e6 3.g3 d5 4.Bg2 dxc4 5.Nf3 Be7' },
  'E06': { code: 'E06', name: 'Catalan Opening: Closed Defense', moves: '1.d4 Nf6 2.c4 e6 3.g3 d5 4.Bg2 Be7' },
  'E07': { code: 'E07', name: 'Catalan Opening: Closed Defense', moves: '1.d4 Nf6 2.c4 e6 3.g3 d5 4.Bg2 Be7 5.Nf3' },
  'E08': { code: 'E08', name: 'Catalan Opening: Closed Defense', moves: '1.d4 Nf6 2.c4 e6 3.g3 d5 4.Bg2 Be7 5.Nf3 O-O' },
  'E09': { code: 'E09', name: 'Catalan Opening: Closed Defense', moves: '1.d4 Nf6 2.c4 e6 3.g3 d5 4.Bg2 Be7 5.Nf3 O-O 6.O-O Nbd7' },
  'E10': { code: 'E10', name: 'Queen\'s Pawn Game: Blumenfeld Countergambit', moves: '1.d4 Nf6 2.c4 e6 3.Nf3' },
  'E11': { code: 'E11', name: 'Bogo-Indian Defense', moves: '1.d4 Nf6 2.c4 e6 3.Nf3 Bb4+' },
  'E12': { code: 'E12', name: 'Queen\'s Indian Defense', moves: '1.d4 Nf6 2.c4 e6 3.Nf3 b6' },
  'E13': { code: 'E13', name: 'Queen\'s Indian Defense: Fianchetto Variation', moves: '1.d4 Nf6 2.c4 e6 3.Nf3 b6 4.g3' },
  'E14': { code: 'E14', name: 'Queen\'s Indian Defense: Fianchetto Variation', moves: '1.d4 Nf6 2.c4 e6 3.Nf3 b6 4.g3 Bb7' },
  'E15': { code: 'E15', name: 'Queen\'s Indian Defense: Nimzowitsch Variation', moves: '1.d4 Nf6 2.c4 e6 3.Nf3 b6 4.g3 Bb7 5.Bg2 Be7' },
  'E16': { code: 'E16', name: 'Queen\'s Indian Defense: Capablanca Variation', moves: '1.d4 Nf6 2.c4 e6 3.Nf3 b6 4.g3 Bb7 5.Bg2 Bb4+' },
  'E17': { code: 'E17', name: 'Queen\'s Indian Defense: Traditional Variation', moves: '1.d4 Nf6 2.c4 e6 3.Nf3 b6 4.g3 Bb7 5.Bg2 Be7 6.O-O' },
  'E18': { code: 'E18', name: 'Queen\'s Indian Defense: Old Main Line', moves: '1.d4 Nf6 2.c4 e6 3.Nf3 b6 4.g3 Bb7 5.Bg2 Be7 6.O-O O-O' },
  'E19': { code: 'E19', name: 'Queen\'s Indian Defense: Old Main Line', moves: '1.d4 Nf6 2.c4 e6 3.Nf3 b6 4.g3 Bb7 5.Bg2 Be7 6.O-O O-O 7.Nc3 Ne4' },
  'E20': { code: 'E20', name: 'Nimzo-Indian Defense', moves: '1.d4 Nf6 2.c4 e6 3.Nc3 Bb4' },
}

export function getOpeningName(ecoCode: string): string {
  const opening = ECO_MAPPINGS[ecoCode]
  return opening ? opening.name : `ECO ${ecoCode}`
}

export function getOpeningByMoves(moves: string): ECOOpening | null {
  for (const opening of Object.values(ECO_MAPPINGS)) {
    if (opening.moves && moves.startsWith(opening.moves.replace(/\d+\./g, '').trim())) {
      return opening
    }
  }
  return null
}

// Map opening variations to their base opening names
export const OPENING_FAMILIES: Record<string, string> = {
  // Caro-Kann Defense family
  'Caro-Kann Defense': 'Caro-Kann Defense',
  'Caro-Kann Defense: Two Knights Attack': 'Caro-Kann Defense',
  'Caro-Kann Defense: Advance Variation': 'Caro-Kann Defense',
  'Caro-Kann Defense: Exchange Variation': 'Caro-Kann Defense',
  'Caro-Kann Defense: Panov-Botvinnik Attack': 'Caro-Kann Defense',
  'Caro-Kann Defense: Main Line': 'Caro-Kann Defense',
  'Caro-Kann Defense: Bronstein-Larsen Variation': 'Caro-Kann Defense',
  'Caro-Kann Defense: Steinitz Variation': 'Caro-Kann Defense',
  'Caro-Kann Defense: Classical Variation': 'Caro-Kann Defense',
  'Caro-Kann Defense: Classical Variation, Spassky System': 'Caro-Kann Defense',

  // Sicilian Defense family
  'Sicilian Defense': 'Sicilian Defense',
  'Sicilian Defense: Smith-Morra Gambit': 'Sicilian Defense',
  'Sicilian Defense: Alapin Variation': 'Sicilian Defense',
  'Sicilian Defense: Closed Variation': 'Sicilian Defense',
  'Sicilian Defense: Hungarian Variation': 'Sicilian Defense',
  'Sicilian Defense: O\'Kelly Variation': 'Sicilian Defense',
  'Sicilian Defense: Nimzowitsch Variation': 'Sicilian Defense',
  'Sicilian Defense: Old Sicilian': 'Sicilian Defense',

  // French Defense family
  'French Defense': 'French Defense',
  'French Defense: Exchange Variation': 'French Defense',
  'French Defense: Advance Variation': 'French Defense',
  'French Defense: Tarrasch Variation': 'French Defense',
  'French Defense: Tarrasch Variation, Guimard Main Line': 'French Defense',
  'French Defense: Tarrasch Variation, Closed System': 'French Defense',
  'French Defense: Tarrasch Variation, Open System': 'French Defense',
  'French Defense: Paulsen Variation': 'French Defense',
  'French Defense: Classical Variation': 'French Defense',
  'French Defense: MacCutcheon Variation': 'French Defense',
  'French Defense: Classical Variation, Alekhine-Chatard Attack': 'French Defense',
  'French Defense: Classical Variation, Steinitz Variation': 'French Defense',
  'French Defense: Winawer Variation': 'French Defense',
  'French Defense: Winawer Variation, Advance Line': 'French Defense',

  // Queen's Gambit family
  'Queen\'s Gambit Declined': 'Queen\'s Gambit',
  'Queen\'s Gambit Declined: Chigorin Defense': 'Queen\'s Gambit',
  'Queen\'s Gambit Declined: Albin Countergambit': 'Queen\'s Gambit',
  'Queen\'s Gambit Declined: Slav Defense': 'Queen\'s Gambit',
  'Queen\'s Gambit Declined: Slav Defense, Exchange Variation': 'Queen\'s Gambit',
  'Queen\'s Gambit Declined: Slav Defense, Four Knights Variation': 'Queen\'s Gambit',
  'Queen\'s Gambit Declined: Slav Defense, Steiner Variation': 'Queen\'s Gambit',
  'Queen\'s Gambit Declined: Slav Defense, Czech Variation': 'Queen\'s Gambit',
  'Queen\'s Gambit Declined: Slav Defense, Dutch Variation': 'Queen\'s Gambit',
  'Queen\'s Gambit Accepted': 'Queen\'s Gambit',

  // English Opening family
  'English Opening': 'English Opening',
  'English Opening: Caro-Kann Defensive System': 'English Opening',
  'English Opening: Agincourt Defense': 'English Opening',
  'English Opening: Agincourt Defense, Neo-Catalan': 'English Opening',
  'English Opening: Anglo-Indian Defense': 'English Opening',
  'English Opening: Anglo-Indian Defense, Anglo-Grünfeld Variation': 'English Opening',
  'English Opening: Anglo-Indian Defense, Hedgehog System': 'English Opening',
  'English Opening: Mikenas-Carls Variation': 'English Opening',
  'English Opening: Mikenas-Carls, Sicilian Variation': 'English Opening',
  'English Opening: King\'s English Variation': 'English Opening',
  'English Opening: King\'s English Variation, Reversed Sicilian': 'English Opening',
  'English Opening: King\'s English Variation, Two Knights Variation': 'English Opening',
  'English Opening: King\'s English Variation, Closed System': 'English Opening',
  'English Opening: King\'s English Variation, Three Knights System': 'English Opening',
  'English Opening: King\'s English Variation, Four Knights System': 'English Opening',
  'English Opening: King\'s English Variation, Four Knights, Fianchetto Variation': 'English Opening',
  'English Opening: Symmetrical Variation': 'English Opening',

  // Alekhine's Defense family
  'Alekhine\'s Defense': 'Alekhine\'s Defense',
  'Alekhine\'s Defense: Four Pawns Attack': 'Alekhine\'s Defense',
  'Alekhine\'s Defense: Modern Variation': 'Alekhine\'s Defense',

  // Pirc Defense family
  'Pirc Defense': 'Pirc Defense',
  'Pirc Defense: Classical System': 'Pirc Defense',
  'Pirc Defense: Austrian Attack': 'Pirc Defense',

  // Réti Opening family
  'Réti Opening': 'Réti Opening',
  'Réti Opening: King\'s Indian Attack': 'Réti Opening',
  'Réti Opening: Nimzowitsch-Larsen Attack': 'Réti Opening',
  'Réti Opening: Advance Variation': 'Réti Opening',

  // Bird's Opening family
  'Bird\'s Opening': 'Bird\'s Opening',
  'Bird\'s Opening: Dutch Variation': 'Bird\'s Opening',

  // Nimzo-Indian Defense family
  'Nimzo-Indian Defense': 'Nimzo-Indian Defense',

  // Queen's Indian Defense family
  'Queen\'s Indian Defense': 'Queen\'s Indian Defense',
  'Queen\'s Indian Defense: Fianchetto Variation': 'Queen\'s Indian Defense',
  'Queen\'s Indian Defense: Nimzowitsch Variation': 'Queen\'s Indian Defense',
  'Queen\'s Indian Defense: Capablanca Variation': 'Queen\'s Indian Defense',
  'Queen\'s Indian Defense: Traditional Variation': 'Queen\'s Indian Defense',
  'Queen\'s Indian Defense: Old Main Line': 'Queen\'s Indian Defense',

  // Catalan Opening family
  'Catalan Opening': 'Catalan Opening',
  'Catalan Opening: Open Defense': 'Catalan Opening',
  'Catalan Opening: Open Defense, Classical Line': 'Catalan Opening',
  'Catalan Opening: Closed Defense': 'Catalan Opening',

  // King's Indian Attack family
  'King\'s Indian Attack': 'King\'s Indian Attack',
  'King\'s Indian Attack: French Variation': 'King\'s Indian Attack',
}

export function getBaseOpeningName(openingName: string): string {
  // First try exact match
  if (OPENING_FAMILIES[openingName]) {
    return OPENING_FAMILIES[openingName]
  }

  // Try to find a partial match for unlisted variations
  for (const [variation, base] of Object.entries(OPENING_FAMILIES)) {
    if (openingName.includes(base.split(':')[0]) && openingName !== base) {
      return base
    }
  }

  // If no match found, try to extract the main opening name before the colon
  const colonIndex = openingName.indexOf(':')
  if (colonIndex > 0) {
    const baseName = openingName.substring(0, colonIndex).trim()
    return baseName
  }

  return openingName
}