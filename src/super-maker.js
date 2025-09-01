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
  wordMin,
  wordMax,
  hashtagMin,
  hashtagMax,
  wordsKey,
  hashtagsKey,
}) => {
  // storage words
  const storageWordsKey = wordsKey;
  const storageWordsArray = getByPath(storage, storageWordsKey) ?? [];
  if (!Array.isArray(storageWordsArray) || storageWordsArray.length === 0) return null;
  // /storage words

  // storage hashtags
  const storageHashtagsKey = hashtagsKey;
  const storageHashtagsArray = getByPath(storage, storageHashtagsKey) ?? [];
  if (!Array.isArray(storageHashtagsArray) || storageHashtagsArray.length === 0) return null;
  // /storage hashtags

  const wordsCount = int({ min: wordMin, max: wordMax });
  const sentenceWords = Array.from({ length: wordsCount }, () => word(storageWordsArray));

  // if sentenceWords is empty, return an empty sentence or default word
  if (sentenceWords.length === 0) {
    return null;
  }

  const availableTags = [...new Set(storageHashtagsArray)];
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


// sentence generator
const sentences = ({
  sentenceMin = 0,
  sentenceMax = 0,
  wordMin = 0,
  wordMax = 0,
  hashtagMin = 0,
  hashtagMax = 0,
  wordsKey = 'words',
  hashtagsKey = 'hashtags',
} = {}) => {

  const count = int({
    min: sentenceMin,
    max: sentenceMax
  });

  return Array.from({ length: count }, () =>
    sentence({
      wordMin,
      wordMax,
      hashtagMin,
      hashtagMax,
      wordsKey,
      hashtagsKey
    })
  ).filter(sentence => sentence !== null).join(' ');
};

// word generator
const words = ({ key = 'words' } = {}) => {
  const storageKey = key;
  const storageArray = getByPath(storage, storageKey) ?? [];
  if (!Array.isArray(storageArray) || storageArray.length === 0) return null;

  return word(storageArray);
};

const generateTextBlock = (params) => {
  const text = sentences(params);
  return { text, hashtags: extractHashtags(text) };
};

const fullText = {
  title: { sentences: generateTextBlock },
  text: { sentences: generateTextBlock },
  generate: ({ titleOptions, textOptions } = {}) => {
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
  const storageKey = value.key;
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
  const storageKey = value.key;
  const storageArray = getByPath(storage, storageKey) ?? [];
  if (!Array.isArray(storageArray) || storageArray.length === 0) return null;

  const shuffled = fisherYatesShuffle(storageArray);
  return value.fromEnd ? shuffled.at(-1) : shuffled[0];
};

const superMaker = {

  lorem: {
    words,
    sentences,
    fullText
  },

  take: {
    value,
    values
  },

  randomNumber,
  randomDate,
  randomBoolean,
  randomCrypto,
  randomEmailCrypto
};

export { superMaker, storage };
