import florest from '../assets/florest.png'
import bluedark from '../assets/bluedark.png'
import soldatarde from '../assets/soldatarde.png'

/**
 * Linhas (rotulos) da MARS BEER — usadas na Home (destaques) e como
 * opcao de "linha" no cadastro de cervejas. Cada linha tem uma cor de
 * destaque e a foto da garrafa correspondente.
 */
export const LINHAS = {
  'FLOREST': {
    cor: '#4A5E3A',
    img: florest,
    estilo: 'India Pale Ale',
    desc: 'Lupulada e herbal, com final seco e aroma de mata fechada.',
  },
  'BLUE DARK': {
    cor: '#2f5a8f',
    img: bluedark,
    estilo: 'Dunkel',
    desc: 'Maltada e encorpada, notas de caramelo, chocolate e noite fria.',
  },
  'SOL DA TARDE': {
    cor: '#d07a2b',
    img: soldatarde,
    estilo: 'American Pale Ale',
    desc: 'Cítrica e refrescante, dourada como o fim de uma tarde de verão.',
  },
}

export const LINHA_NOMES = Object.keys(LINHAS)

export const ESTILOS = ['IPA', 'APA', 'Lager', 'Pilsen', 'Weiss', 'Witbier', 'Stout', 'Dunkel']
