import fs from 'fs';
import path from 'path';
import { randomBytes } from "node:crypto";
import {
  int,
  pick,
  extractHashtags,
  cleanHashtag,
  word,
  fisherYatesShuffle,
  randomNumber,
  randomDate,
  randomBoolean
} from './utils/index.js';

const dataPath = path.resolve(process.cwd(), './super-maker-storage.json');

if (!fs.existsSync(dataPath)) {
  throw new Error(`super-maker-storage.json not found at ${dataPath}.`);
}

const storage = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const getByPath = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
};

// one sentence generator
const sentence = ({
  wordMin = 0,
  wordMax = 0,
  hashtagMin = 0,
  hashtagMax = 0
}) => {
  const wordsCount = int({ min: wordMin, max: wordMax });
  const sentenceWords = Array.from({ length: wordsCount }, () => word(storage.words));
  const availableTags = [...new Set(storage.hashtags)];
  const shuffledTags = fisherYatesShuffle(availableTags);
  const hashtagsCount = Math.min(int({ min: hashtagMin, max: hashtagMax }), availableTags.length);
  const hashtagsSet = new Set();
  shuffledTags.slice(0, hashtagsCount).forEach(tag => hashtagsSet.add(tag));

  const hashtags = Array.from(hashtagsSet);
  for (let tag of hashtags) {
    const index = int({ min: 0, max: sentenceWords.length });
    sentenceWords.splice(index, 0, tag);
  }

  const firstWord = sentenceWords[0];
  if (!firstWord.startsWith("#")) {
    sentenceWords[0] = firstWord[0].toUpperCase() + firstWord.slice(1);
  } else {
    const tag = firstWord.slice(1);
    sentenceWords[0] = "#" + tag[0].toUpperCase() + tag.slice(1);
  }

  const lastWord = sentenceWords[sentenceWords.length - 1];
  return lastWord.startsWith("#")
    ? sentenceWords.join(" ") + "."
    : sentenceWords.join(" ") + ".";
};

const sentences = ({
  sentenceMin = 0,
  sentenceMax = 0,
  wordMin = 0,
  wordMax = 0,
  hashtagMin = 0,
  hashtagMax = 0
}) => {

  const count = int({
    min: sentenceMin,
    max: sentenceMax
  });

  return Array.from({ length: count }, () =>
    sentence({ wordMin, wordMax, hashtagMin, hashtagMax })
  ).join(' ');
};

const generateTextBlock = (params) => {
  const text = sentences(params);
  return { text, hashtags: extractHashtags(text) };
};

const fullText = {
  title: { sentences: generateTextBlock },
  text: { sentences: generateTextBlock },
  generate: ({ titleOptions, textOptions }) => {
    const titleData = generateTextBlock(titleOptions);
    const textData = generateTextBlock(textOptions);
    const allHashtags = [...new Set([
      ...titleData.hashtags.map(cleanHashtag),
      ...textData.hashtags.map(cleanHashtag)
    ])];

    return {
      title: titleData.text,
      text: textData.text,
      hashtagsFromFullText: allHashtags
    };
  }
};

const randomEmailCrypto = (length) => `${randomBytes(length).toString("hex")}@gmail.com`;

const randomCrypto = (length) => randomBytes(length).toString("hex");

const values = (value = {}) => {
  const storageKey = value.key ?? 'objectsIdUsers';
  const storageArray = getByPath(storage, storageKey) ?? [];

  if (!Array.isArray(storageArray) || storageArray.length === 0) return [];

  const min = value.min ?? 0;
  const max = Math.min(value.max ?? storageArray.length, storageArray.length);
  const duplicate = value.duplicate || false;
  const count = int({ min, max });

  if (duplicate) {
    const picked = Array.from({ length: count }, () => pick(storageArray));
    return value.reverse ? picked.reverse() : picked;
  }

  const shuffled = fisherYatesShuffle(storageArray);
  const sliced = shuffled.slice(0, count);
  return value.reverse ? sliced.reverse() : sliced;
};

const value = (value = {}) => {
  const storageKey = value.key ?? 'objectsIdUsers';
  const storageArray = getByPath(storage, storageKey) ?? [];
  if (!Array.isArray(storageArray) || storageArray.length === 0) return null;

  const shuffled = fisherYatesShuffle(storageArray);
  return value.fromEnd ? shuffled.at(-1) : shuffled[0];
};

const superMaker = {

  // lorem from - super-maker-storage.json
  lorem: {
    word: () => word(storage.words),
    /*
    Usage:
    superMaker.lorem.word(),
    Returns:
    astronae
    */

    sentences,
    /*
    Usage:
    superMaker.lorem.sentences({
            sentenceMin: 3,
            sentenceMax: 6,
            wordMin: 5,
            wordMax: 3,
            hashtagMin: 1,
            hashtagMax: 2
        }),
     Returns:
     Lunara #Makemake zenthul eltheon vireon. Quarnex kalyra #Moon stelmara thalor #Jupiter. Velmari #Uranus #Haumea dravion velmari astronae. Virella lurexis nexura #Oberon nexura.   
    */

    fullText
    /*
    Usage:
    export async function generatingData({ createdAt, updatedAt }) {
    const {
        title,
        text,
        hashtagsFromFullText
    } = superMaker.lorem.fullText.generate({

        titleOptions: {
            sentenceMin: 0,
            sentenceMax: 3,
            wordMin: 5,
            wordMax: 12,
            hashtagMin: 2,
            hashtagMax: 2
        },

        textOptions: {
            sentenceMin: 1,
            sentenceMax: 8,
            wordMin: 5,
            wordMax: 12,
            hashtagMin: 1,
            hashtagMax: 5
        }
    });

    return {
    title,
    text,
    hashtags: hashtagsFromFullText,
    ....
    };
    }
    Returns:  
    title: #Leda astronae #Oberon ximora nuvion dravion skavari solvenar nuvion gralith. Mirthos virella yxelan draxil eltheon #Neptune #Mars.
    text: Draxil zorvian orleth quarnex #Oberon cryonex nexura ximora #Makemake #Jupiter. Vireon gralith zephirion stelmara vorthal yxelan #Leda #Jupiter quarnex tarnyx. Stelmara #Makemake #Venus zenthul nexura zenthul tarnyx stelmara. Eltheon zenthul zorvian nexura lunara quarnex #Carme stelmara #Elara #Mars astronae.
    hashtags:Array (9)("#leda", "#oberon", "#neptune", "#mars", "#makemake", "#jupiter", "#venus", "#carme", "#elara")
    */
  },
  // /lorem from - super-maker-storage.json

  // take from - super-maker-storage.json
  take: {
    value,
    /*
    Usage: 
    export async function generatingData({ createdAt, updatedAt }) {
    const user = superMaker.take.value({
            key: 'users',
            fromEnd: true
        });
    return {
    user: new ObjectId(user)
        };
    }
     Returns:
    ObjectId('683a6220c57fe3aba56e3745')
    ---
    Usage: 
    mainImageUri: superMaker.take.value({
                key: 'images.avatar'
            }),
    Returns:        
    https://raw.githubusercontent.com/AndrewShedov/superMaker/refs/heads/main/storage/images/3.webp
    
    */

    values
    /*    
    Usage:
    liked: superMaker.take.values({
                key: 'users',
                duplicate: false,
                min: 3,
                max: 10,
                reverse: true
            }),
    Returns:
    liked: Array (6)(
    "683a6220c57fe3aba56e3745",
    "683a62204094be10d6f90378",
    "683a62208ec63ed29e9a0137",
    "683a6251661f8f39765a75cc",
    "683a62208355f4708ed7ed81",
    "683a6220941ebd4340a2e226"
    )
    */

  },
  // /take from - super-maker-storage.json

  randomNumber,
  /*
  Usage:
  superMaker.randomNumber();
  Returns:
  0... Number.MAX_SAFE_INTEGER
  ---
  superMaker.randomNumber({ max: 500 });
  0...500
  ---
  superMaker.randomNumber({ min: 500 });
  500...
  ---
  superMaker.randomNumber({ min: 100, max: 500 });
  100...500
  ---
  superMaker.randomNumber({ min: 500, max: 100 });
  100...500 (swap)
  ---
  randomNumber({ max: -50, min: -1000 })
  -483
  ---
  superMaker.randomNumber({ min: 5, max: 7, float: true });
  for example 5.2342531
  ---
  superMaker.randomNumber({ float: true });
  random number between 0 and Number.MAX_SAFE_INTEGER (floating point)
  ---
  superMaker.randomNumber({ float: true }).toFixed(2)
  2858776836282319.50
  */

  randomDate,
  /*
  Usage:
  date: superMaker.randomDate({
       min: { year: 2005, month: 2, day: 28, hour: 5, minute: 1, second: 1, ms: 1 },
       max: { year: 2010, month: 7, day: 21, hour: 5, minute: 1, second: 1, ms: 1 }
    }),
  Returns:
  2007-04-27T01:32:19.181+00:00
  ---
  Usage:
  date: superMaker.randomDate({
       min: { year: 2005},
       max: { year: 2010}
    }),
  Returns:
  2007-04-27T01:32:19.181+00:00
  ---
  Usage:
  date: superMaker.randomDate({
      max: { year: 2010}
    }),
  Returns:
  2007-04-27T01:32:19.181+00:00
  ---
  Usage:
  date: superMaker.randomDate(),
  Returns:
  1990-04-27T01:32:19.181+00:00
  */

  randomBoolean,
  /*
  superMaker.randomBoolean();
  50% true / 50 % false

  superMaker.randomBoolean(0.7);
  70% true / 30 % false

  superMaker.randomBoolean(0.1);
  10% true / 90 % false
  */

  randomCrypto,
  /*
    customId: superMaker.randomCrypto(16)
    19ed1bd590cbdf368c4ad8823f5cf25b
  */

  randomEmailCrypto
  /*
   email: superMaker.randomEmailCrypto(5)
   06e675b854@gmail.com
  */
};

export { superMaker, storage };
